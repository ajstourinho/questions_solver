import { Routes, Route, Navigate } from "react-router-dom";
import InitialPage from "./pages/InitialPage";

export default function Links() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/medicina" />} />
      <Route path="/medicina" element={<InitialPage />} />
      {/* <Route path="/medicina" element={<InitialPage />} /> */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}