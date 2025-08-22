import React, { useEffect, useState, useRef } from "react";

import Loading from "../Loading";
import { Alert, AlertTitle } from '@mui/material';

import "../../styles/dialogdelete.css";

export default function AlertDialogDeleteConsultaGeneral({ open, onCancel, onConfirm, id }) {
    if (!open) return null;

    {/* Variables */ }
    const API_URL = import.meta.env.VITE_API_URL;
    const cancelRef = useRef(null);

    useEffect(() => {
        cancelRef.current?.focus();
        const onKey = (e) => e.key === "Escape" && onCancel?.();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onCancel]);

    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, severity: '', message: '' });
    const showAlert = (severity, message) => {
        setAlert({ show: true, severity, message });
        setTimeout(() => {
            setAlert({ show: false, severity: '', message: '' });
        }, 3000);
    };

    const defaultDeleteUsuario = async (userId) => {
        setIsLoading(true)
        try {
            const response = await fetch(`${API_URL}prenatal/${userId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const data = await response.json();
                showAlert('success', `${data.message}`);
                setTimeout(() => {
                
                    onConfirm?.(data?.message);

                }, 3000);

            } else {
                const data = await response.json();
                setIsLoading(false);
                showAlert('error', `${data.message}`);
                onCancel?.();
            }
        } catch (error) {
            setIsLoading(false);
            showAlert('error', `${error.message}`);
            onCancel?.();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="overlay"
            onClick={(e) => e.target === e.currentTarget && onCancel?.()}
            role="presentation"
        >
            <section
                className="dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="logout-title"
                aria-describedby="logout-desc"
            >
                <div className="div--loading">
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

                </div>

                <div className="div--parrafos">
                    <h5>¿Estás seguro de que quieres eliminar este Paciente?</h5>

                    <p>Si elimina este paciente ya no podrás recuperar su información.</p>
                </div>

                <nav className="nav--dialog">
                    <button type="button" className="button--cancel" onClick={onCancel} ref={cancelRef}>
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="button--delete"
                        onClick={() => { setIsLoading(true); defaultDeleteUsuario(id); }}
                        disabled={isLoading}
                    >
                        Eliminar
                    </button>
                </nav>
            </section>
        </div>
    );
}
