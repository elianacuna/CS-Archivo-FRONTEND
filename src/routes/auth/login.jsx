import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Alert, AlertTitle } from '@mui/material';
import Loading from '../../components/Loading.jsx';
import Logo from '../../assets/logo.svg';

import '../../styles/global.css';
import '../../styles/login.css';


const Login = () => {
    {/* Variables */ }
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [formLogin, setFormLogin] = useState({
        email: "",
        password: "",
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


    {/* editar, agregar o eliminar */ }
    const handleAuth = async (evt) => {
        evt.preventDefault();

        const { email, password } = formLogin;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {

                const data = await response.json();
                const usuario = data.usuario;

                showAlert('success', `${data.message}`);

                sessionStorage.setItem('id', usuario.id);
                localStorage.setItem('id', usuario.id);
                localStorage.setItem('username', usuario.username ?? '');
                localStorage.setItem('email', usuario.email ?? '');

                setTimeout(() => {
                    navigate('/usuarios');
                }, 2000);

            } else {
                const data = await response.json();
                showAlert('error', `${data.message}`);
                return;
            }
        } catch (error) {
            showAlert('error', `${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };



    {/* interactuar con los botones */ }
    const handleChange = (evt) => {
        const { name, value } = evt.target;

        setFormLogin(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className="contaniner">
            <main className="main--auth">

                <div className="div--form">

                    <img
                        src={Logo}
                        alt="LOGO CENTRO DE SALUD"
                        className="logo--login"
                    />

                    <h1 id="title">Iniciar sesión</h1>

                    <form onSubmit={handleAuth}>
                        <section className="section--input">
                            <label htmlFor="email">Correo electronico:</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="exmaple@example.com"
                                value={formLogin.email}
                                onChange={handleChange}
                                required
                            />
                        </section>
                        <section className="section--input">
                            <label htmlFor="password">Contraseña:</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="********"
                                value={formLogin.password}
                                onChange={handleChange}
                                required
                            />
                        </section>
                        <section className="section--button--login">
                            <button type="submit">
                                Iniciar sesión
                            </button>
                        </section>

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
                    </form>
                </div>

            </main>
        </div>
    )
};

export default Login;
