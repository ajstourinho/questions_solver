
import { Routes, Route, Navigate } from 'react-router-dom';
import { InitialPage } from './pages/InitialPage';
export function Links() {
    return (
        <Routes>
            <Route path="/home" element={<InitialPage />} />
            <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
    )
}