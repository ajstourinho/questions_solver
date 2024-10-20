import { Routes, Route, Navigate } from "react-router-dom";
import InitialPage from "./pages/InitialPage";
import NewInitialPage from "./pages/NewInitialPage";

export default function Links() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/medicina" />} />
      <Route path="/medicina" element={<NewInitialPage />} />
      {/* <Route path="/medicina" element={<InitialPage />} /> */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}