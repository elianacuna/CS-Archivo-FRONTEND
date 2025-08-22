import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Header.jsx';
import { Alert, AlertTitle } from '@mui/material';
import Loading from '../components/Loading.jsx';
import AlertDialogDelete from "../components/dialog/AlertDialogDelete.jsx";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

import '../styles/global.css';
import '../styles/usuario.css';


const Main = () => {
    {/* Variables */ }
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [busqueda, setBusqueda] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [formUsuario, setFormUsuario] = useState({
        id: "",
        username: "",
        email: "",
        password: "",
        fk_id_rol: ""
    });

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [view, setView] = useState(true);
    const [add, setAdd] = useState(false);
    const [edit, setEdit] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, severity: '', message: '' });
    const showAlert = (severity, message) => {
        setAlert({ show: true, severity, message });
        setTimeout(() => {
            setAlert({ show: false, severity: '', message: '' });
        }, 3000);
    };


    {/* use Effect */ }
    useEffect(() => {
        obtenerUsuarios();
        obtenerRoles();
    }, [])


    {/* obtener listado */ }
    const obtenerUsuarios = async () => {
        try {
            const response = await fetch(`${API_URL}usuario`);

            if (!response.ok) {
                console.error("Error al obtener usuarios");
                return;
            }

            const data = await response.json();
            setUsuarios(data.usuarios ?? []);


        } catch (error) {
            console.error("Error de red:", error);
        }
    };
    const obtenerRoles = async () => {
        try {
            const response = await fetch(`${API_URL}rol`);

            if (response.ok) {
                const data = await response.json();
                setRoles(data.roles);
                return true;
            } else {
                return false
            }
        } catch (error) {
            console.error(`${error.message}`);
        }
    };

    
    {/* CRUD */ }
    const createusuairo = async () => {
        const { username, email, password, fk_id_rol } = formUsuario;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}usuario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, username, password, fk_id_rol })
            });

            if (response.ok) {
                const data = await response.json();

                showAlert('success', `${data.message}`)

                setTimeout(() => {
                    setFormUsuario({
                        id: "",
                        email: "",
                        username: "",
                        password: "",
                        fk_id_rol: ""
                    });

                    obtenerUsuarios();

                    setView(true);
                    setEdit(false);
                    setAdd(false);
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
    const updateUsuario = async () => {
        const { id, username, email } = formUsuario;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}usuario/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email })
            });

            if (response.ok) {
                const data = await response.json();

                showAlert('success', `${data.message}`)

                setTimeout(() => {
                    setFormUsuario({
                        id: "",
                        email: "",
                        username: "",
                        password: "",
                        fk_id_rol: ""
                    });

                    obtenerUsuarios();

                    setView(true);
                    setEdit(false);
                    setAdd(false);
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
    const deleteUsuario = async (id) => {

        setSelectedId(id);
        setOpenDeleteDialog(true);
    }


    {/* editar, agregar o eliminar */ }
    const handleEdit = (id) => {
        const usuario = usuarios.find(u => u.id === id);

        if (usuario) {
            setFormUsuario({
                id: usuario.id,
                username: usuario.username,
                email: usuario.email
            });

            setView(false);
            setEdit(true);
            setAdd(false);
        }
    };
    const handleAdd = () => {
        setView(false);
        setAdd(true);
        setEdit(false);
    };
    const handleCancel = () => {
        setView(true);
        setAdd(false);
        setEdit(false);

        setFormUsuario({
            id: "",
            username: "",
            email: "",
            password: "",
            fk_id_rol: ""
        });
    };
    const handleChange = (evt) => {
        const { name, value } = evt.target;

        setFormUsuario(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };


    {/* busqueda filtros */ }
    const usuarioBusqueda = usuarios.filter(u => {
        const termino = busqueda?.toLowerCase() || '';
        return (
            u.username?.toLowerCase().includes(termino) ||
            u.email?.toLowerCase().includes(termino)
        );
    });

    return (
        <div className="contaniner">

            <Sidebar />

            <main className="main">

                <div className="cardview">

                    {view && (
                        <div>

                            <section className="section--search">
                                <input
                                    type="search"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    placeholder="buscar usuario"
                                />
                                <nav>
                                    <button type="button" onClick={handleAdd}>
                                        Agregar usuario
                                    </button>
                                </nav>
                            </section>

                            <section className="tabla--responsiva">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre de usuario:</th>
                                            <th>Correo electrónico</th>
                                            <th>Rol</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuarioBusqueda.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>
                                                    No se encontraron usuarios
                                                </td>
                                            </tr>
                                        ) : (
                                            usuarioBusqueda.map((u, i) => (
                                                <tr key={u.id}>
                                                    <td>{i + 1}</td>
                                                    <td>{u.username}</td>
                                                    <td>{u.email}</td>
                                                    <td>{u.rol}</td>
                                                    <td>
                                                        <Tooltip title="Editar">
                                                            <IconButton color="primary" onClick={() => { handleEdit(u.id) }}>
                                                                <ModeEditOutlineOutlinedIcon />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title="Delete">
                                                            <IconButton color="error" onClick={() => { deleteUsuario(u.id) }}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </section>

                            <AlertDialogDelete
                                open={openDeleteDialog}
                                id={selectedId}
                                onCancel={() => setOpenDeleteDialog(false)}
                                onConfirm={(msg) => {
                                    setOpenDeleteDialog(false);
                                    showAlert('success', msg || 'Usuario eliminado correctamente');
                                    obtenerUsuarios(); 
                                }}
                            />

                        </div>
                    )}

                    {add && (
                        <div>
                            <section className="card--option">
                                <nav className="on--back">
                                    <ArrowBackIcon onClick={handleCancel} className="icon--back" />
                                    <h5>Agregar paciente</h5>
                                </nav>
                            </section>

                            <section className="form">
                                <form onSubmit={createusuairo}>
                                    <h2>Agregar Usuario</h2>

                                    <section className="card--form">
                                        <label name="username">Nombre de usuario:</label>
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="nombre completo"
                                            value={formUsuario.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </section>
                                    <section className="card--form">
                                        <label name="email">Correo electrónico:</label>
                                        <input
                                            type="text"
                                            name="email"
                                            placeholder="nombre completo"
                                            value={formUsuario.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </section>
                                    <section className="card--form">
                                        <label name="password">Contraseña:</label>
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="********"
                                            value={formUsuario.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </section>

                                    <section className="card--form">
                                        <label htmlFor="fk_id_rol">Roles:</label>
                                        <select
                                            name="fk_id_rol"
                                            value={formUsuario.fk_id_rol}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccione un Rol</option>
                                            {roles.map((r) => (
                                                <option key={r.id} value={r.id}>
                                                    {r.rol}
                                                </option>
                                            ))}
                                        </select>
                                    </section>

                                    <section className="button--option">
                                        <button type="button" onClick={handleCancel}>
                                            Cancelar
                                        </button>
                                        <button type="submit">
                                            agregar usuario
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
                    )}

                    {edit && (
                        <div>
                            <section className="card--option">
                                <nav className="on--back">
                                    <ArrowBackIcon onClick={handleCancel} className="icon--back" />
                                    <h5>Agregar paciente</h5>
                                </nav>
                            </section>

                            <section className="form">
                                <form onSubmit={updateUsuario}>
                                    <h2>Actualizar Usuario</h2>
                                    <section className="card--form">
                                        <label name="username">Nombre de usuario:</label>
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="nombre completo"
                                            value={formUsuario.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </section>
                                    <section className="card--form">
                                        <label name="email">Correo electrónico:</label>
                                        <input
                                            type="text"
                                            name="email"
                                            placeholder="nombre completo"
                                            value={formUsuario.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </section>

                                    <section className="button--option">
                                        <button type="button" onClick={handleCancel}>
                                            Cancelar
                                        </button>
                                        <button type="submit">
                                            actualizar usuario
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
                    )}
                </div>
            </main>
        </div>
    )
};

export default Main;
