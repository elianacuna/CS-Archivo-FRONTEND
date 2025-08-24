import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Header.jsx';
import { Alert, AlertTitle } from '@mui/material';
import Loading from '../../components/Loading.jsx';
import AlertDialogDelete from "../../components/dialog/AlertDialogDelete.jsx";
import { Menu, MenuItem } from '@mui/material';
import AlertDialogDeletNiño from '../../components/dialog/AlertDialogDeleteNiño.jsx';
import { generarPDF  } from "../../components/PDF/NiñosPDF.jsx";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

import '../../styles/global.css';
import '../../styles/usuario.css';
import { PDFDownloadLink } from "@react-pdf/renderer";

const Niños = () => {
    {/* Variables */ }
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    //filtro
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);


    const [busqueda, setBusqueda] = useState('');
    const [edad, setEdad] = useState('17');
    const [niños, setNiños] = useState([]);
    const [lugares, setLugares] = useState([]);
    const [formPaciente, setFormPaciente] = useState({
        id_paciente: "",
        num_expediente: "",
        nombre_completo: "",
        direccion_exacta: "",
        fecha_nacimiento: "",
        edad: "",
        cui: "",
        numero_telefono: "",
        fecha_inscripcion: "",
        fk_id_lugares: ""
    });

    const [view, setView] = useState(true);
    const [add, setAdd] = useState(false);
    const [edit, setEdit] = useState(false);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

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
        obtnerPacientes(busqueda, edad);
        obtenerLugar();
    }, [])


    {/* obtener listado */ }
    const obtnerPacientes = async (busqueda, edad) => {
        try {
            const response = await fetch(`${API_URL}ninios/busqueda`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ busqueda: busqueda, edad: edad })
            })

            if (response.ok) {
                const data = await response.json();

                showAlert('success', `${data.message}`);

                setNiños(data.ninios);
                return true;
            } else {
                const data = await response.json();
                showAlert('error', `${data.message}`);
                return false;
            }
        } catch (error) {
            setIsLoading(false);
            showAlert('error', `Hubo un error: ${error.message}`);
        }
    };
    const obtenerLugar = async () => {
        const response = await fetch(`${API_URL}municipio/lugares`);

        if (response.ok) {
            const data = await response.json();
            setLugares(data.lugares);
            return true;
        } else {
            return false;
        }
    };
    const verifyDay = new Date().toISOString().split('T')[0];


    {/* CRUD */ }
    const crearPaciente = async () => {
        const {
            num_expediente, nombre_completo, direccion_exacta, edad,
            fecha_nacimiento, cui, numero_telefono, fecha_inscripcion,
            fk_id_lugares
        } = formPaciente;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}ninios`, {
                method: 'POST',
                headers: ({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({
                    num_expediente, nombre_completo, direccion_exacta,
                    edad, fecha_nacimiento, cui, numero_telefono,
                    fecha_inscripcion, fk_id_lugares
                })
            });

            if (response.ok) {
                const data = await response.json();

                showAlert('success', `${data.message}`)

                setTimeout(() => {
                    setFormUsuario({
                        id_paciente: "",
                        num_expediente: "",
                        nombre_completo: "",
                        direccion_exacta: "",
                        fecha_nacimiento: "",
                        edad: "",
                        cui: "",
                        numero_telefono: "",
                        fecha_inscripcion: "",
                        fk_id_lugares: ""
                    });

                    obtnerPacientes(busqueda, edad);

                    setView(true);
                    setEdit(false);
                    setAdd(false);
                }, 3000);
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
    const updatePaciente = async () => {
        const {
            id_paciente, num_expediente, nombre_completo, direccion_exacta, edad,
            fecha_nacimiento, cui, numero_telefono, fk_id_lugares
        } = formPaciente;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}ninios/${id_paciente}`, {
                method: 'PUT',
                headers: ({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({
                    num_expediente, nombre_completo, direccion_exacta,
                    edad, fecha_nacimiento, cui, numero_telefono,
                    fk_id_lugares
                })
            });

            if (response.ok) {
                const data = await response.json();
                showAlert('success', `${data.message}`)

                setTimeout(() => {
                    setFormPaciente({
                        id_paciente: "",
                        num_expediente: "",
                        nombre_completo: "",
                        direccion_exacta: "",
                        fecha_nacimiento: "",
                        edad: "",
                        cui: "",
                        numero_telefono: "",
                        fecha_inscripcion: "",
                        fk_id_lugares: ""
                    });

                    obtnerPacientes(busqueda, edad);

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
            showAlert('error', `Hubo un error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    const deleteUsuario = async (id) => {
        
        setSelectedId(id);
        setOpenDeleteDialog(true);
    };
    

    {/* editar, agregar o eliminar */ }
    const calcularEdad = (isoDate) => {
        if (!isoDate) return "";
        const [y, m, d] = isoDate.split('-').map(Number);
        const hoy = new Date();
        let edad = hoy.getFullYear() - y;
        const mes = hoy.getMonth() + 1;
        const dia = hoy.getDate();
        if (mes < m || (mes === m && dia < d)) edad--;
        return String(Math.max(edad, 0));
    };
    const handleChange = (evt) => {
        const { name, value } = evt.target;

        if (name === "fecha_nacimiento") {
            if (value > verifyDay) return;

            setFormPaciente(prevState => ({
                ...prevState,
                fecha_nacimiento: value,
                edad: calcularEdad(value),
            }));
        }

        setFormPaciente(prevState => ({
            ...prevState,
            [name]: value,
        }));

    };
    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleSelectEdad = (value) => {
        setEdad(value);
        setAnchorEl(null);
        // opcional: ejecutar búsqueda de inmediato
        obtnerPacientes(busqueda.trim(), value);
    };
    const handleAdd = () => {
        setAdd(true);
        setView(false);
        setEdit(false);
    };
    const handleCancel = () => {
        setView(true);
        setAdd(false);
        setEdit(false);

        setFormPaciente({
            id_paciente: "",
            num_expediente: "",
            nombre_completo: "",
            direccion_exacta: "",
            fecha_nacimiento: "",
            edad: "",
            cui: "",
            numero_telefono: "",
            fecha_inscripcion: "",
            fk_id_lugares: ""
        });
    };
    const handleEdit = (id) => {
        const paciente = niños.find((n => n.id_paciente === id))

        if (paciente) {
            const fechaNacimiento = paciente.fecha_nacimiento
                ? new Date(paciente.fecha_nacimiento).toISOString().split("T")[0]
                : "";

            setFormPaciente({
                id_paciente: paciente.id_paciente,
                num_expediente: paciente.num_expediente,
                nombre_completo: paciente.nombre_completo,
                direccion_exacta: paciente.direccion_exacta,
                edad: paciente.edad,
                fecha_nacimiento: fechaNacimiento,
                cui: paciente.cui,
                numero_telefono: paciente.numero_telefono,
                fk_id_lugares: paciente.fk_id_lugares
            });

            setView(false);
            setEdit(true);
            setAdd(false);
        }
    };

    return (
        <div className="contaniner">

            <Sidebar />

            <main className="main">

                <div className="cardview">

                    {view && (
                        <div>

                            <section className="section--search">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        obtnerPacientes(busqueda.trim(), edad);
                                    }}>
                                    <input
                                        type="search"
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                        placeholder="Buscar por nombre, cui"
                                    />

                                    <div>
                                        <Tooltip title="Filtrar por edad">
                                            <IconButton onClick={handleClick}>
                                                <FilterListIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Menu
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                        >
                                            <MenuItem onClick={() => handleSelectEdad('5')}>5 años</MenuItem>
                                            <MenuItem onClick={() => handleSelectEdad('17')}>17 años</MenuItem>
                                        </Menu>
                                    </div>
                                </form>
                            </section>

                            <nav className="nav--option">
                                <button type="button" className="button--niños"
                                    onClick={handleAdd}>
                                    Agregar paciente
                                </button>
                            </nav>

                            <section className="tabla--responsiva">
                                <table>

                                    <thead>

                                        <tr>
                                            <th>ID</th>
                                            <th>Expediente</th>
                                            <th>Nombre</th>
                                            <th>Dirección</th>
                                            <th>Edad</th>
                                            <th>Nacimiento</th>
                                            <th>CUI</th>
                                            <th>Teléfono</th>
                                            <th>Inscripción</th>
                                            <th>Lugar</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr><td colSpan="10" style={{ textAlign: 'center', padding: '1rem' }}>Cargando…</td></tr>
                                        ) : (niños?.length ?? 0) === 0 ? (
                                            <tr><td colSpan="10" style={{ textAlign: 'center', padding: '1rem' }}>No se encontraron pacientes</td></tr>
                                        ) : (
                                            niños.map((n, i) => (
                                                <tr key={n.id_paciente ?? i}>
                                                    <td>{i + 1}</td>
                                                    <td>{n.num_expediente}</td>
                                                    <td>{n.nombre_completo}</td>
                                                    <td>{n.direccion_exacta}</td>
                                                    <td>{n.edad}</td>
                                                    <td>{formatDate(n.fecha_nacimiento)}</td>
                                                    <td>{n.cui}</td>
                                                    <td>{n.numero_telefono}</td>
                                                    <td>{formatDate(n.fecha_inscripcion)}</td>
                                                    <td>{n.lugar}</td>
                                                    <td>

                                                        <Tooltip title="Editar">
                                                            <IconButton color="primary" onClick={() => { handleEdit(n.id_paciente) }}>
                                                                <ModeEditOutlineOutlinedIcon />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title="Delete">
                                                            <IconButton color="error" onClick={() => { deleteUsuario(n.id_paciente) }}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title="PDF">
                                                            <IconButton color="primary" onClick={() => { generarPDF(n.id_paciente) }}>
                                                                <PictureAsPdfIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </section>

                            <AlertDialogDeletNiño
                                open={openDeleteDialog}
                                id={selectedId}
                                onCancel={() => setOpenDeleteDialog(false)}
                                onConfirm={(msg) => {
                                    setOpenDeleteDialog(false);
                                    showAlert('success', msg || 'Usuario eliminado correctamente');
                                    obtnerPacientes(busqueda, edad);
                                }}
                            />
                        </div>
                    )}

                    {edit && (
                        <div>

                            <section className="card--option">
                                <nav className="on--back">
                                    <ArrowBackIcon onClick={handleCancel} className="icon--back" />
                                    <h5>actualizar paciente</h5>
                                </nav>
                            </section>

                            <section className="form">
                                <form onSubmit={updatePaciente}>
                                    <h2>Actualizar Paciente</h2>

                                    <section className="card--form">
                                        <label name="num_expediente">Número de expediente:</label>
                                        <input
                                            type="text"
                                            name="num_expediente"
                                            value={formPaciente.num_expediente}
                                            onChange={handleChange}
                                            required
                                        />
                                    </section>

                                    <section className="card--form">
                                        <label name="nombre_completo">Nombre completo:</label>
                                        <input
                                            type="text"
                                            name="nombre_completo"
                                            value={formPaciente.nombre_completo}
                                            onChange={handleChange}
                                            required
                                        />
                                    </section>

                                    <section className="card--form">
                                        <label name="direccion_exacta">Dirección exacta:</label>
                                        <input
                                            type="text"
                                            name="direccion_exacta"
                                            value={formPaciente.direccion_exacta}
                                            onChange={handleChange}
                                            required
                                        />
                                    </section>

                                    <section className="card--form">
                                        <label name="fecha_nacimiento">Fecha de nacimiento:</label>
                                        <input
                                            type="date"
                                            name="fecha_nacimiento"
                                            value={formPaciente.fecha_nacimiento}
                                            onChange={handleChange}
                                            required
                                            max={verifyDay}
                                        />
                                    </section>

                                    <section className="card--form">
                                        <label name="edad">Edad:</label>
                                        <input
                                            type="number"
                                            name="edad"
                                            value={formPaciente.edad}
                                            onChange={handleChange}
                                            required
                                            readOnly
                                        />
                                    </section>

                                    <section className="card--form">
                                        <label name="cui">CUI:</label>
                                        <input
                                            type="number"
                                            name="cui"
                                            value={formPaciente.cui}
                                            onChange={handleChange}
                                            required
                                        />
                                    </section>

                                    <section className="card--form">
                                        <label name="numero_telefono">Número de teléfono:</label>
                                        <input
                                            type="number"
                                            name="numero_telefono"
                                            value={formPaciente.numero_telefono}
                                            onChange={handleChange}
                                            required
                                        />
                                    </section>

                                    <section className="card--form">
                                        <label htmlFor="fk_id_lugares">Comunidad:</label>
                                        <select
                                            name="fk_id_lugares"
                                            value={formPaciente.fk_id_lugares}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccione una comunidad</option>
                                            {lugares.map((l) => (
                                                <option key={l.id} value={l.id}>
                                                    {l.lugar}
                                                </option>
                                            ))}
                                        </select>
                                    </section>

                                    <section className="button--option">
                                        <button type="button" onClick={handleCancel}>
                                            Cancelar
                                        </button>
                                        <button type="submit">
                                            actualizar paciente
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

                    {add && (
                        <div>
                            <section className="card--option">
                                <nav className="on--back">
                                    <ArrowBackIcon onClick={handleCancel} className="icon--back" />
                                    <h5>Agregar paciente</h5>
                                </nav>
                            </section>

                            <section className="form">
                                <form onSubmit={crearPaciente}>
                                    <h2>Agregar Paciente</h2>

                                    <section className="card--form">
                                        <label name="num_expediente">Número de expediente:</label>
                                        <input
                                            type="text"
                                            name="num_expediente"
                                            value={formPaciente.num_expediente}
                                            onChange={handleChange}
                                            required
                                        />
                                    </section>

                                    <section className="card--form">
                                        <label name="nombre_completo">Nombre completo:</label>
                                        <input
                                            type="text"
                                            name="nombre_completo"
                                            value={formPaciente.nombre_completo}
                                            onChange={handleChange}
                                            required
                                        />
                                    </section>

                                    <section className="card--form">
                                        <label name="direccion_exacta">Dirección exacta:</label>
                                        <input
                                            type="text"
                                            name="direccion_exacta"
                                            value={formPaciente.direccion_exacta}
                                            onChange={handleChange}
                                            required
                                        />
                                    </section>

                                    <section className="card--form">
                                        <label name="fecha_nacimiento">Fecha de nacimiento:</label>
                                        <input
                                            type="date"
                                            name="fecha_nacimiento"
                                            value={formPaciente.fecha_nacimiento}
                                            onChange={handleChange}
                                            required
                                            max={verifyDay}
                                        />
                                    </section>

                                    <section className="card--form">
                                        <label name="edad">Edad:</label>
                                        <input
                                            type="number"
                                            name="edad"
                                            value={formPaciente.edad}
                                            onChange={handleChange}
                                            required
                                            readOnly
                                        />
                                    </section>

                                    <section className="card--form">
                                        <label name="cui">CUI:</label>
                                        <input
                                            type="number"
                                            name="cui"
                                            value={formPaciente.cui}
                                            onChange={handleChange}
                                            required
                                        />
                                    </section>

                                    <section className="card--form">
                                        <label name="numero_telefono">Número de teléfono:</label>
                                        <input
                                            type="number"
                                            name="numero_telefono"
                                            value={formPaciente.numero_telefono}
                                            onChange={handleChange}
                                            required
                                        />
                                    </section>

                                    <section className="card--form">
                                        <label name="fecha_inscripcion">Fecha de inscripción:</label>
                                        <input
                                            type="date"
                                            name="fecha_inscripcion"
                                            value={formPaciente.fecha_inscripcion}
                                            onChange={handleChange}
                                            required
                                        />
                                    </section>

                                    <section className="card--form">
                                        <label htmlFor="fk_id_lugares">Comunidad:</label>
                                        <select
                                            name="fk_id_lugares"
                                            value={formPaciente.fk_id_lugares}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccione una comunidad</option>
                                            {lugares.map((l) => (
                                                <option key={l.id} value={l.id}>
                                                    {l.lugar}
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
                </div>

            </main>
        </div>
    )

}

export default Niños;