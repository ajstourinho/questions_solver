import React from "react";
import { Box, Typography, Button, Divider, Chip } from "@mui/material";
import { nextModalPage } from "../../../store/slices/ModalControlSlice";
import { useDispatch } from "react-redux";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { ShoppingCart } from "@mui/icons-material";
import pixIcon from "../../../assets/pix_icon.webp";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { changePriceBasedOnModeChoice } from "../../../store/slices/CheckoutSlice";

function formatToCurrency(value: number): string {
  let formattedValue = value.toFixed(2);
  formattedValue = formattedValue.replace(".", ",");
  return `${formattedValue}`;
}

function ModalPage2Mode() {
  const price = useSelector((state: RootState) => state.checkoutSlice.price);

  const [radioValue, setRadioValue] = React.useState("without_human_revision");

  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(nextModalPage());
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const choice = (event.target as HTMLInputElement).value;
    dispatch(changePriceBasedOnModeChoice(choice));
    setRadioValue(choice);
  };

  return (
    <>
      <Typography variant="h6" component="h2" sx={{ mt: 1, mb: 1 }}>
        Escolha um modo:
      </Typography>

      <FormControl>
        {/* Mode choice */}
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={radioValue}
          onChange={handleChange}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              mb: 1,
            }}
          >
            <FormControlLabel
              value="without_human_revision"
              control={<Radio />}
              label={
                <>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "Roboto Mono, monospace" }}
                  >
                    Apenas IA 🤖
                  </Typography>
                </>
              }
            />
            <Typography
              variant="caption"
              sx={{
                fontFamily: "Roboto Mono, monospace",
                color: "grey",
                textAlign: "left",
                ml: 4,
              }}
            >
              {/* Resultado em até 10min */}
              Resultado em poucos instantes
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "Roboto Mono, monospace",
                color: "grey",
                textAlign: "left",
                ml: 4,
              }}
            >
              Pode apresentar alguns erros
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              mb: 1,
            }}
          >
            <FormControlLabel
              disabled
              value="with_human_revision"
              control={<Radio />}
              label={
                <>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "Roboto Mono, monospace" }}
                  >
                    IA 🤖 + Revisão humana 🧑‍🏫
                  </Typography>
                </>
              }
            />
            <Chip label="Em breve!" color="warning" size="small" />
            
            {/* <Typography
              variant="caption"
              sx={{
                fontFamily: "Roboto Mono, monospace",
                color: "grey",
                textAlign: "left",
                ml: 4,
              }}
            >
              Resultado em até 24h
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "Roboto Mono, monospace",
                color: "grey",
                textAlign: "left",
                ml: 4,
              }}
            >
              Mais confiável
            </Typography> */}
          </Box>
        </RadioGroup>

        {/* Divisor */}
        <Divider sx={{ mt: 1, mb: 1 }} />

        {/* Seção Valor total */}
        <Box>
          <Typography variant="overline">Valor total:</Typography>

          {/* Carrinho */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ marginTop: 5 }}
          >
            <Box display="flex" alignItems="center">
              <img src={pixIcon} alt="pixIcon" style={{ maxHeight: "25px" }} />
              <ShoppingCart style={{ marginRight: 10 }} />
              <Typography variant="subtitle1" color="grey">
                R$ {formatToCurrency(price.valueOf())}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Button for Modal next page */}
        <Button
          variant="contained"
          color="primary"
          disabled={radioValue === ""}
          sx={{ mt: 2, mb: 2 }}
          onClick={handleClick}
        >
          SEGUIR
        </Button>
      </FormControl>
    </>
  );
}

export default ModalPage2Mode;
