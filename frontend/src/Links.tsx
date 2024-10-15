import { Routes, Route, Navigate } from "react-router-dom";
import InitialPage from "./pages/InitialPage";
import ImageProcessor from "./img_pre_processing/ImageProcessor";

export default function Links() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/medicina" />} />
      <Route path="/medicina" element={<InitialPage />} />
      <Route path="/edit" element={<ImageProcessor />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}