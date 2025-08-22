import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = sessionStorage.getItem('id_usuario') || localStorage.getItem('id_usuario');

    if (!isAuthenticated) {
        // Si no está autenticado, redirige a login
        return <Navigate to="/" replace />;
    }

    // Si está autenticado, muestra el contenido
    return children;
};

export default ProtectedRoute;
