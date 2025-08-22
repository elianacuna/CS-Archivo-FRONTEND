import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiUsers, FiCalendar, FiFileText, FiSettings, FiLogOut, FiSearch, FiMenu } from "react-icons/fi";
import  ChildCareIcon from '@mui/icons-material/ChildCare';
import PersonalInjuryOutlinedIcon from '@mui/icons-material/PersonalInjuryOutlined';
import PregnantWomanOutlinedIcon from '@mui/icons-material/PregnantWomanOutlined';

import Logo from "../assets/logo.svg";
import "../styles/sidebar.css";

const menuItems = [
    { key: "usuarios", label: "Usuarios", icon: <FiUsers />, path: "/usuarios" },
    { key: "niños", label: "Niños", icon: <ChildCareIcon />, path: "/niños" },
    { key: "pacientes", label: "Pacientes", icon: <PersonalInjuryOutlinedIcon />, path: "/pacientes" },
    { key: "prenatal", label: "Prenatal", icon: <PregnantWomanOutlinedIcon />, path: "/prenatal" },
    { key: "reportes", label: "Reportes", icon: <FiFileText />, path: "/reportes" },
    { key: "ajustes", label: "Ajustes", icon: <FiSettings />, path: "/ajustes" },
];

const Sidebar = () => {
    {/* Variable */ }
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [collapsed, setCollapsed] = useState(true);
    const [q, setQ] = useState("");
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');

    {/* use effect */ }
    useEffect(() => {
        const nombreGuardado = localStorage.getItem('username');
        const emailGuardado = localStorage.getItem('email');

        if (nombreGuardado) setNombre(nombreGuardado);
        if (emailGuardado) setEmail(emailGuardado);
    })

    const toggleCollapsed = () => {
        setCollapsed(v => {
            const next = !v;
            document.body.classList.toggle("sb-collapsed", next);
            return next;
        });
    };


    const go = (path) => navigate(path);

    return (
        <nav className={`sidebar ${collapsed ? "is-collapsed" : ""}`}>

            <button className="sb-burger" onClick={toggleCollapsed} aria-label="Toggle sidebar">
                <FiMenu />
            </button>
            <header className="sb-header">


                <div className="image--text">
                    <span className="logo--sidebar">
                        <img src={Logo} alt="LOGO CENTRO DE SALUD" />
                    </span>

                    <div className="header--text">
                        <span>Centro de Salud</span>
                        <span>Santo Domingo Such.</span>
                    </div>
                </div>

            </header>



            <ul className="sb-menu">
                {menuItems.map(item => (
                    <li
                        key={item.key}
                        className={`sb-item ${pathname.startsWith(item.path) ? "active" : ""}`}
                        onClick={() => go(item.path)}
                    >
                        <span className="sb-icon">{item.icon}</span>
                        <span className="sb-label">{item.label}</span>
                    </li>
                ))}
            </ul>

            <div className="sb-footer">
                <div className="sb-profile">
                    <img src={`https://ui-avatars.com/api/?name=${nombre}&background=DDD`} alt="perfil" />
                    <div className="sb-profile-info">
                        <strong>{nombre}</strong>
                    </div>
                </div>

                <button className="sb-logout" onClick={() => go("/logout")}>
                    <FiLogOut />
                    <span>Salir</span>
                </button>
            </div>
        </nav>
    );
};

export default Sidebar;
