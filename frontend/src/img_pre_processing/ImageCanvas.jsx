// ImageCanvas.jsx
import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Box, Avatar } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import cv from "@techstark/opencv-js";

const ImageCanvas = forwardRef(({ src }, ref) => {
  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);

  const [areas, setAreas] = useState([]);
  const [draggingAreaIndex, setDraggingAreaIndex] = useState(null);
  const [draggingCornerIndex, setDraggingCornerIndex] = useState(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mouseDownPos, setMouseDownPos] = useState(null);

  const [canvasDisplayedSize, setCanvasDisplayedSize] = useState({
    width: 0,
    height: 0,
  });
  const [cursorStyle, setCursorStyle] = useState("crosshair");

  useEffect(() => {
    setAreas([]);
    setImageLoaded(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = src;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      setImageLoaded(true);
      imageRef.current = image;

      // Obter o tamanho exibido do canvas
      const displayedWidth = canvas.clientWidth;
      const displayedHeight = canvas.clientHeight;
      setCanvasDisplayedSize({
        width: displayedWidth,
        height: displayedHeight,
      });
    };
  }, [src]);

  // Atualiza o tamanho exibido do canvas quando a janela é redimensionada
  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        setCanvasDisplayedSize({
          width: canvas.clientWidth,
          height: canvas.clientHeight,
        });
      }
    };

    window.addEventListener("resize", updateCanvasSize);
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  useEffect(() => {
    if (imageLoaded) {
      redrawCanvas();
    }
  }, [areas, imageLoaded]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imageRef.current, 0, 0);

    // Desenha todas as áreas em azul
    areas.forEach((area, index) => {
      drawArea(ctx, area, "blue", index);
    });
  };

  const drawArea = (ctx, area, color, areaIndex) => {
    const { points } = area;
    // Desenha os pontos
    ctx.fillStyle = color;
    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI); // Raio de 8 para pontos maiores
      ctx.fill();
    });

    // Desenha o retângulo/quadrilátero
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.closePath();
    ctx.stroke();

    // Calcula a posição para o ícone de exclusão baseado no ponto superior direito (points[1])
    const iconOffsetX = 35; // Margem maior para a direita
    const iconOffsetY = -10; // Ajuste vertical se necessário
    const iconX = points[1].x + iconOffsetX;
    const iconY = points[1].y + iconOffsetY;

    // Armazena a posição do ícone na área
    area.deleteIconPosition = { x: iconX, y: iconY };
  };

  const getMousePos = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    return { x, y };
  };

  const handleMouseDown = (event) => {
    if (!imageLoaded) return;

    const pos = getMousePos(event);
    setIsMouseDown(true);
    setMouseDownPos(pos);

    // Verifica se está clicando em um canto de alguma área
    let cornerFound = false;
    for (let i = areas.length - 1; i >= 0; i--) {
      const area = areas[i];
      const cornerIndex = area.points.findIndex(
        (point) => Math.hypot(point.x - pos.x, point.y - pos.y) < 12
      );
      if (cornerIndex !== -1) {
        setDraggingAreaIndex(i);
        setDraggingCornerIndex(cornerIndex);
        cornerFound = true;
        break;
      }
    }
    if (cornerFound) {
      return;
    }

    // Não inicia uma nova área aqui
    setDraggingAreaIndex(null);
    setDraggingCornerIndex(null);
  };

  const handleMouseMove = (event) => {
    if (!imageLoaded) return;

    const pos = getMousePos(event);

    // Verifica se o mouse está sobre um ponto de canto
    let overCorner = false;
    for (let i = areas.length - 1; i >= 0; i--) {
      const area = areas[i];
      const cornerIndex = area.points.findIndex(
        (point) => Math.hypot(point.x - pos.x, point.y - pos.y) < 12
      );
      if (cornerIndex !== -1) {
        overCorner = true;
        break;
      }
    }

    if (overCorner) {
      setCursorStyle("pointer");
    } else {
      setCursorStyle("crosshair");
    }

    if (isMouseDown) {
      if (draggingAreaIndex !== null && draggingCornerIndex !== null) {
        // Atualiza a posição do canto arrastado
        const areasCopy = [...areas];
        const area = areasCopy[draggingAreaIndex];
        area.points[draggingCornerIndex] = { x: pos.x, y: pos.y };
        areasCopy[draggingAreaIndex] = area;
        setAreas(areasCopy);
      } else if (!isDrawing) {
        // Verifica se o usuário arrastou o mouse para iniciar uma nova área
        const dx = pos.x - mouseDownPos.x;
        const dy = pos.y - mouseDownPos.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 5) {
          // Inicia uma nova área
          setIsDrawing(true);

          const minX = Math.min(mouseDownPos.x, pos.x);
          const maxX = Math.max(mouseDownPos.x, pos.x);
          const minY = Math.min(mouseDownPos.y, pos.y);
          const maxY = Math.max(mouseDownPos.y, pos.y);

          const newArea = {
            points: [
              { x: minX, y: minY }, // Top-left
              { x: maxX, y: minY }, // Top-right
              { x: maxX, y: maxY }, // Bottom-right
              { x: minX, y: maxY }, // Bottom-left
            ],
          };
          setAreas((prevAreas) => [...prevAreas, newArea]);
          setDraggingAreaIndex(areas.length);
          setDraggingCornerIndex(null);
        }
      } else if (isDrawing) {
        // Atualiza os pontos do retângulo enquanto desenha
        const areasCopy = [...areas];
        const area = areasCopy[draggingAreaIndex];

        const minX = Math.min(mouseDownPos.x, pos.x);
        const maxX = Math.max(mouseDownPos.x, pos.x);
        const minY = Math.min(mouseDownPos.y, pos.y);
        const maxY = Math.max(mouseDownPos.y, pos.y);

        area.points = [
          { x: minX, y: minY }, // Top-left
          { x: maxX, y: minY }, // Top-right
          { x: maxX, y: maxY }, // Bottom-right
          { x: minX, y: maxY }, // Bottom-left
        ];

        areasCopy[draggingAreaIndex] = area;
        setAreas(areasCopy);
      }
    }
  };

  const handleMouseUp = (event) => {
    if (!imageLoaded) return;

    setIsMouseDown(false);
    setIsDrawing(false);
    setDraggingCornerIndex(null);
    setDraggingAreaIndex(null);
  };

  const handleDeleteArea = (index) => {
    setAreas((prevAreas) => prevAreas.filter((_, i) => i !== index));
  };

  // Expondo o método para obter as imagens transformadas
  useImperativeHandle(ref, () => ({
    getTransformedImages: () => {
      if (!imageLoaded) return [];
      const images = [];
      const srcCanvas = canvasRef.current;
      const srcMat = cv.imread(srcCanvas);

      areas.forEach((area) => {
        const areaPoints = area.points;

        const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
          areaPoints[0].x,
          areaPoints[0].y,
          areaPoints[1].x,
          areaPoints[1].y,
          areaPoints[2].x,
          areaPoints[2].y,
          areaPoints[3].x,
          areaPoints[3].y,
        ]);

        const width = Math.hypot(
          areaPoints[1].x - areaPoints[0].x,
          areaPoints[1].y - areaPoints[0].y
        );
        const height = Math.hypot(
          areaPoints[3].x - areaPoints[0].x,
          areaPoints[3].y - areaPoints[0].y
        );

        const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
          0,
          0,
          width - 1,
          0,
          width - 1,
          height - 1,
          0,
          height - 1,
        ]);

        const M = cv.getPerspectiveTransform(srcTri, dstTri);
        const dsize = new cv.Size(width, height);

        const dstMat = new cv.Mat();
        cv.warpPerspective(
          srcMat,
          dstMat,
          M,
          dsize,
          cv.INTER_LINEAR,
          cv.BORDER_CONSTANT,
          new cv.Scalar()
        );

        const canvas = document.createElement("canvas");
        cv.imshow(canvas, dstMat);

        const transformedImageSrc = canvas.toDataURL();
        images.push(transformedImageSrc);

        // Liberar memória
        dstMat.delete();
        srcTri.delete();
        dstTri.delete();
        M.delete();
      });

      srcMat.delete();
      return images;
    },
  }));

  return (
    <Box
      pt={2}
      pb={4}
      style={{
        overflow: "auto",
        maxHeight: "70vh",
        backgroundColor: "lightgrey",
        display: "flex",
        justifyContent: "center", // Centraliza horizontalmente
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: "85%",
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            cursor: cursorStyle,
            width: "100%",
            border: "1px solid black",
          }}
        />
        {areas.map((area, index) => {
          const { deleteIconPosition } = area;
          if (
            !deleteIconPosition ||
            !canvasDisplayedSize.width ||
            !imageRef.current
          )
            return null;

          const scaleX = canvasDisplayedSize.width / imageRef.current.width;
          const scaleY = canvasDisplayedSize.height / imageRef.current.height;

          const displayedX = deleteIconPosition.x * scaleX;
          const displayedY = deleteIconPosition.y * scaleY;

          return (
            <Avatar
              key={index}
              style={{
                position: "absolute",
                left: displayedX,
                top: displayedY,
                cursor: "pointer",
                backgroundColor: "red",
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => handleDeleteArea(index)}
            >
              <DeleteForeverIcon style={{ color: "white" }} />
            </Avatar>
          );
        })}
      </div>
    </Box>
  );
});

export default ImageCanvas;
