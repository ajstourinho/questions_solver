import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import Header from "./components/Header/Header";
import Links from "./Links";
import Footer from "./components/Footer/Footer";
import { setDeviceType } from "./store/slices/deviceSlice";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Adjust tab title (base it on the route)
    document.title = "iLoveProvaAntiga | Medicina";

    // Detect device type
    const detectDeviceType = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
        if (/ipad/i.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
          return 'tablet';
        }
        return 'mobile';
      }
      return 'desktop';
    };

    const deviceType = detectDeviceType();
    dispatch(setDeviceType(deviceType));
  }, [dispatch]);

  return (
    <Grid
      container
      spacing={1}
      justifyContent="center"
      style={{ textAlign: "center" }}
    >
      <Header />
      <Links />
      <Footer />
    </Grid>
  );
}
