import React, { useEffect, useState } from "react";
import { data, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Header.jsx';
import { Alert, AlertTitle } from '@mui/material';
import Loading from '../../components/Loading.jsx';
import { ExportNiniosExcel } from "../../components/Excel/niñosexcel.jsx";
import { ExportPrenatalExcel } from "../../components/Excel/prenatalexcel.jsx";
import { ExportConsultaExcel } from "../../components/Excel/consultaexcel.jsx";

import '../../styles/global.css';
import '../../styles/usuario.css';

const Reporte = () => {
    {/* Variables */ }
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, severity: '', message: '' });
    const showAlert = (severity, message) => {
        setAlert({ show: true, severity, message });
        setTimeout(() => {
            setAlert({ show: false, severity: '', message: '' });
        }, 3000);
    };


    {/* use Effect */ }


    {/* obtener listado */ }


    {/* CRUD */ }


    {/* editar, agregar o eliminar */ }
    const generarExcelNiños = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}excel/ninios`);
            if (!response.ok) {
                const errorData = await response.json();
                showAlert('error', `${errorData.ninios}`)
            }

            const rows = await response.json();
            ExportNiniosExcel(rows.ninios);
        } catch (error) {
            console.error(error.message);
        } finally {
            setIsLoading(false)
        }
    };
    const generarExcelPrenatal = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}excel/prenatal`);
            if (!response.ok) {
                const errorData = await response.json();
                showAlert('error', `${errorData.prenatal}`)
            }

            const rows = await response.json();
            ExportPrenatalExcel(rows.prenatal);
        } catch (error) {
            console.error(error.message);
        } finally {
            setIsLoading(false)
        }
    };
    const generarExcelConsulta = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}excel/consulta/general`);
            if (!response.ok) {
                const errorData = await response.json();
                showAlert('error', `${errorData.consulta}`)
            }

            const rows = await response.json();
            ExportConsultaExcel(rows.consulta);
        } catch (error) {
            console.error(error.message);
        } finally {
            setIsLoading(false)
        }
    };


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

                            {isLoading && (
                                <div className="back-loading">
                                    <Loading />
                                </div>
                            )}

                            {alert.show && (
                                <Alert severity={alert.severity} className="alert-popup">
                                    <AlertTitle>{alert.severity === 'error' ? 'Error' : 'Éxito'}</AlertTitle>
                                    {alert.message}
                                </Alert>
                            )}

                            <section className="section--excel">

                                <h2>Prenatal excel</h2>
                                <button type="button" onClick={generarExcelPrenatal}>
                                    Generar excel
                                </button>

                            </section>

                            <section className="section--excel">
                                <h2>Niños excel</h2>

                                <button type="button" onClick={generarExcelNiños}>
                                    Generar excel
                                </button>

                            </section>

                            <section className="section--excel">
                                <h2>Pacientes excel</h2>

                                <button type="button" onClick={generarExcelConsulta}>
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