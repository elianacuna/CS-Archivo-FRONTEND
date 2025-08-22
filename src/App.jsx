import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


import Main from "./routes/Main";
import Login from "./routes/auth/login";
import Ajustes from "./routes/ajustes/ajustes.jsx";
import Niños from "./routes/niños/niños.jsx";
import Paciente from "./routes/pacientes/pacientes.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

function App() {
  return (

    <Router>

      <Routes>

        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />


        {/* Rutas privadas*/}
        <Route path="/usuarios"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          } />

        <Route path="/ajustes"
          element={
            <ProtectedRoute>
              <Ajustes />
            </ProtectedRoute>
          } />

        <Route path="/niños"
          element={
            <ProtectedRoute>
              <Niños />
            </ProtectedRoute>
          } />

          <Route path="/pacientes"
          element={
            <ProtectedRoute>
              <Paciente />
            </ProtectedRoute>
          } />

      </Routes>
    </Router>
  );
};

export default App;
