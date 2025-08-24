import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Header.jsx';
import { Alert, AlertTitle } from '@mui/material';
import Loading from '../../components/Loading.jsx';


import '../../styles/global.css';
import '../../styles/usuario.css';

const Reporte = () => {
    {/* Variables */ }
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();


    {/* use Effect */ }


    {/* obtener listado */ }


    {/* CRUD */ }


    {/* editar, agregar o eliminar */ }


    return (
        <div className="contaniner">

            <Sidebar />

            <main className="main">

                <div className="cardview">
                    <section className="card--option">
                        <h1>Reportes</h1>
                    </section>

                    <section className="tabla--responsiva">

                        <div className="center--card-excel">
                            <section className="section--excel">
                                <h2>Prenatal excel</h2>
                                <button type="button">
                                    Generar excel
                                </button>
                            </section>

                            <section className="section--excel">
                                <h2>Niños excel</h2>
                                <button type="button">
                                    Generar excel
                                </button>
                            </section>

                            <section className="section--excel">
                                <h2>Pacientes excel</h2>
                                <button type="button">
                                    Generar excel
                                </button>
                            </section>
                        </div>

                    </section>

                </div>


            </main>
        </div>
    )
};

export default Reporte;