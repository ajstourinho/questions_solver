
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './routes/HomePage';
export function Links() {
    return (
        <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
    )
}