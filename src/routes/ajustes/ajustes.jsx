import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Header.jsx';
import { Alert, AlertTitle } from '@mui/material';
import Loading from '../../components/Loading.jsx';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';


import '../../styles/global.css';
import '../../styles/usuario.css';
import { Password } from "@mui/icons-material";

const Ajustes = () => {
    {/* Variables */ }
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [formChangePassword, setFomrChangePassword] = useState({
        id: "",
        new_password: "",
        confimr_password: ""
    });

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
    const changePassword = async () => {
        const { new_password, confimr_password } = formChangePassword;
        const id = sessionStorage.getItem('id_usuario') || localStorage.getItem('id_usuario');

        if (new_password < 8 || new_password > 12) {
            showAlert('error', 'Debe tener entre 8 y 12 caracteres.');
        }

        if (new_password && new_password !== confimr_password) {
            showAlert('error', 'Las contraseñas no coinciden.');
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}auth/change/password/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: new_password })
            });

            if (response.ok) {
                const data = await response.json();
                

                setTimeout(() => {
                    showAlert('success', `${data.message}`);
                    setFomrChangePassword({
                        id: "",
                        new_password: "",
                        confimr_password: ""
                    });

                    
                }, 3000);

                return true;
            } else {
                const data = await response.json();

                showAlert('error', `${data.message}`)

                return false;
            }

        } catch (error) {
            setIsLoading(false);
            showAlert('error', `Hubo un error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }

    };


    {/* CRUD */ }


    {/* editar, agregar o eliminar */ }
    const handleCancel = () => {

        navigate('/usuarios')

        setFomrChangePassword({
            id: "",
            new_password: "",
            confimr_password: ""
        });
    };
    const handleChange = (evt) => {
        const { name, value } = evt.target;

        setFomrChangePassword(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className="contaniner">
            <Sidebar />

            <main className="main">

                <div className="cardview">

                    <div>

                        <section className="card--option">
                            <nav className="on--back">
                                <ArrowBackIcon onClick={handleCancel} className="icon--back" />
                                <h5>actualizar contraseña</h5>
                            </nav>
                        </section>

                        <section className="form">
                            <form onSubmit={changePassword}>
                                <h2>Actualizar contraseña</h2>

                                <section className="card--form">
                                    <label name="new_password">Contraseña nueva:</label>
                                    <input
                                        type="password"
                                        name="new_password"
                                        placeholder="********"
                                        value={formChangePassword.new_password}
                                        onChange={handleChange}
                                        required
                                    />
                                </section>
                                <section className="card--form">
                                    <label name="confimr_password">Confirmar contraseña:</label>
                                    <input
                                        type="password"
                                        name="confimr_password"
                                        placeholder="********"
                                        value={formChangePassword.confimr_password}
                                        onChange={handleChange}
                                        required
                                    />
                                </section>

                                <section className="button--option">
                                    <button type="button" onClick={handleCancel}>
                                        Cancelar
                                    </button>
                                    <button type="submit">
                                        Actualizar contraeña
                                    </button>
                                </section>

                                {alert.show && (
                                    <Alert severity={alert.severity} className="alert-popup">
                                        <AlertTitle>{alert.severity === 'error' ? 'Error' : 'Éxito'}</AlertTitle>
                                        {alert.message}
                                    </Alert>
                                )}

                                {isLoading && (
                                    <div className="back-loading">
                                        <Loading />
                                    </div>
                                )}
                            </form>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    )

}

export default Ajustes;