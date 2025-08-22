import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Header.jsx';
import { Alert, AlertTitle } from '@mui/material';
import Loading from '../../components/Loading.jsx';
import AlertDialogDelete from "../../components/dialog/AlertDialogDelete.jsx";
import { Menu, MenuItem } from '@mui/material';
import AlertDialogDeleteConsultaGeneral from '../../components/dialog/AlertDialogDeleteConsulta.jsx';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

import '../../styles/global.css';
import '../../styles/usuario.css';

const Paciente = () => {
    {/* Variables */ }
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [busqueda, setBusqueda] = useState('');
    const [paciente, setPaciente] = useState([]);
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
        obttenerPaciente(busqueda);
        obtenerLugar();
    }, [])


    {/* obtener listado */ }
    const obttenerPaciente = async (busqueda) => {
        const respone = await fetch(`${API_URL}consulta/general/busqueda`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ busqueda: busqueda })
        });

        if (respone.ok) {
            const data = await respone.json();
            setPaciente(data.consultageneral);
            console.table(data.consultageneral);
            return true;
        } else {
            const data = await respone.json();
            console.error(data.message);
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

    {/* CRUD */ }
    const crearPaciente = async () => {
        const {
            num_expediente, nombre_completo, direccion_exacta, edad,
            fecha_nacimiento, cui, numero_telefono, fecha_inscripcion,
            fk_id_lugares
        } = formPaciente;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}consulta/general`, {
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

                    setView(true);
                    setEdit(false);
                    setAdd(false);

                    obttenerPaciente(busqueda);
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
            const response = await fetch(`${API_URL}consulta/general/${id_paciente}`, {
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

                    obttenerPaciente(busqueda);

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
    }


    {/* editar, agregar o eliminar */ }
    const verifyDay = new Date().toISOString().split('T')[0];
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
    const handleEdit = (id) => {
        const consultageneral = paciente.find((cg => cg.id_paciente === id))

        if (consultageneral) {

            const fechaNacimiento = consultageneral.fecha_nacimiento
                ? new Date(consultageneral.fecha_nacimiento).toISOString().split("T")[0]
                : "";

            
            setFormPaciente({
                id_paciente: consultageneral.id_paciente,
                num_expediente: consultageneral.num_expediente,
                nombre_completo: consultageneral.nombre_completo,
                direccion_exacta: consultageneral.direccion_exacta,
                fecha_nacimiento: fechaNacimiento,
                edad: consultageneral.edad,
                cui: consultageneral.cui,
                numero_telefono: consultageneral.numero_telefono,
                fk_id_lugares: consultageneral.fk_id_lugares
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

    return (
        <div className="contaniner">
            <Sidebar />

            <main className="main">

                <div className="cardview">

                    {view && (
                        <div>

                            <AlertDialogDeleteConsultaGeneral
                                open={openDeleteDialog}
                                id={selectedId}
                                onCancel={() => setOpenDeleteDialog(false)}
                                onConfirm={(msg) => {
                                    setOpenDeleteDialog(false);
                                    showAlert('success', msg || 'Usuario eliminado correctamente');
                                    obttenerPaciente(busqueda);
                                }}
                            />

                            <section className="section--search">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        obttenerPaciente(busqueda.trim());
                                    }}>

                                    <input
                                        type="search"
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                        placeholder="Buscar por nombre, cui"
                                    />

                                    <nav>
                                        <button type="button" onClick={handleAdd}>
                                            Agregar paciente
                                        </button>
                                    </nav>

                                </form>

                            </section>

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
                                        ) : (paciente?.length ?? 0) === 0 ? (
                                            <tr><td colSpan="10" style={{ textAlign: 'center', padding: '1rem' }}>No se encontraron pacientes</td></tr>
                                        ) : (
                                            paciente.map((p, i) => (
                                                <tr key={p.id_paciente ?? i}>
                                                    <td>{i + 1}</td>
                                                    <td>{p.num_expediente}</td>
                                                    <td>{p.nombre_completo}</td>
                                                    <td>{p.direccion_exacta}</td>
                                                    <td>{p.edad}</td>
                                                    <td>{formatDate(p.fecha_nacimiento)}</td>
                                                    <td>{p.cui}</td>
                                                    <td>{p.numero_telefono}</td>
                                                    <td>{formatDate(p.fecha_inscripcion)}</td>
                                                    <td>{p.lugar}</td>
                                                    <td>

                                                        <Tooltip title="Editar">
                                                            <IconButton color="primary" onClick={() => { handleEdit(p.id_paciente) }}>
                                                                <ModeEditOutlineOutlinedIcon />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title="Delete">
                                                            <IconButton color="error" onClick={() => { deleteUsuario(p.id_paciente) }}>
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



export default Paciente;