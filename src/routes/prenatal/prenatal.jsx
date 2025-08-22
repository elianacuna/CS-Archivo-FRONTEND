import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Header.jsx';
import { Alert, AlertTitle } from '@mui/material';
import Loading from '../../components/Loading.jsx';
import AlertDialogDelete from "../../components/dialog/AlertDialogDelete.jsx";
import { Menu, MenuItem } from '@mui/material';
import AlertDialogDeletePrenatal from '../../components/dialog/AlertDialogDeletePrenatal.jsx';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

import '../../styles/global.css';
import '../../styles/usuario.css';

const Prenatal = () => {
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
        fk_id_lugares: "",
        fecha_probable_parto: "",
        primer_control_post_parto: "",
        segundo_control_post_parto: ""
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
        obtenerPaciente(busqueda);
        obtenerLugar();
    }, [])


    {/* obtener listado */ }
    const obtenerPaciente = async (busqueda) => {
        const respone = await fetch(`${API_URL}prenatal/busqueda`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ busqueda: busqueda })
        });

        if (respone.ok) {
            const data = await respone.json();
            setPaciente(data.prenatal);
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
            fk_id_lugares, primer_control_post_parto, segundo_control_post_parto,
            fecha_probable_parto
        } = formPaciente;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}prenatal`, {
                method: 'POST',
                headers: ({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({
                    num_expediente, nombre_completo, direccion_exacta,
                    edad, fecha_nacimiento, cui, numero_telefono,
                    fecha_inscripcion, fk_id_lugares, fecha_probable_parto,
                    primer_control_post_parto, segundo_control_post_parto
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
                        fk_id_lugares: "",
                        fecha_probable_parto: "",
                        primer_control_post_parto: "",
                        segundo_control_post_parto: ""
                    });

                    obtenerPaciente(busqueda);

                    setView(true);
                    setEdit(false);
                    setAdd(false);
                })
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
            fecha_nacimiento, cui, numero_telefono, fk_id_lugares, fecha_probable_parto,
            primer_control_post_parto, segundo_control_post_parto
        } = formPaciente;

        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}prenatal/${id_paciente}`, {
                method: 'PUT',
                headers: ({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({
                    num_expediente, nombre_completo, direccion_exacta,
                    edad, fecha_nacimiento, cui, numero_telefono,
                    fk_id_lugares, fecha_probable_parto,
                    primer_control_post_parto, segundo_control_post_parto
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
                        fk_id_lugares: "",
                        fecha_probable_parto: "",
                        primer_control_post_parto: "",
                        segundo_control_post_parto: ""
                    });

                    obtenerPaciente(busqueda);

                    setView(true);
                    setEdit(false);
                    setAdd(false);
                }, 30000);

                return true;
            } else {
                const data = await response.json();
                showAlert('error', `${data.message}`)
                console.error(data.message);
                return false;
            }
        } catch (error) {
            showAlert('error', `Hubo un error: ${error.message}`);
            console.error(error.message);
        } finally {
            setIsLoading(false)
        }
    };
    const deleteUsuario = async (id) => {

        setSelectedId(id);
        setOpenDeleteDialog(true);
    };


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
    const handleAdd = () => {
        setView(false);
        setAdd(true);
        setEdit(false);
    };
    const handleEdit = (id) => {
        const prenatal = paciente.find((p => p.id_paciente === id));

        if (prenatal) {
            const fechaNacimiento = prenatal.fecha_nacimiento
                ? new Date(prenatal.fecha_nacimiento).toISOString().split("T")[0]
                : "";

            const fechaParto = prenatal.fecha_probable_parto
                ? new Date(prenatal.fecha_probable_parto).toISOString().split("T")[0]
                : "";

            const fechaPrimer = prenatal.primer_control_post_parto
                ? new Date(prenatal.primer_control_post_parto).toISOString().split("T")[0]
                : "";
            
            const fechaSegundo = prenatal.segundo_control_post_parto
                ? new Date(prenatal.segundo_control_post_parto).toISOString().split("T")[0]
                : "";

            setFormPaciente({
                id_paciente: prenatal.id_paciente,
                num_expediente: prenatal.num_expediente,
                nombre_completo: prenatal.nombre_completo,
                direccion_exacta: prenatal.direccion_exacta,
                fecha_nacimiento: fechaNacimiento,
                edad: prenatal.edad,
                cui: prenatal.cui,
                numero_telefono: prenatal.numero_telefono,
                fk_id_lugares: prenatal.fk_id_lugares,
                fecha_probable_parto: fechaParto,
                primer_control_post_parto: fechaPrimer,
                segundo_control_post_parto: fechaSegundo
            });

            setView(false);
            setEdit(true);
            setAdd(false);
        }
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
            fk_id_lugares: "",
            fecha_probable_parto: "",
            primer_control_post_parto: "",
            segundo_control_post_parto: ""
        });
    };

    return (
        <div className="contaniner">
            <Sidebar />

            <main className="main">

                <div className="cardview">

                    {view && (
                        <div>

                            <AlertDialogDeletePrenatal
                                open={openDeleteDialog}
                                id={selectedId}
                                onCancel={() => setOpenDeleteDialog(false)}
                                onConfirm={(msg) => {
                                    setOpenDeleteDialog(false);
                                    showAlert('success', msg || 'Usuario eliminado correctamente');
                                    obtenerPaciente(busqueda);
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
                                            <th>Fecha Parto</th>
                                            <th>Primer contro</th>
                                            <th>Segundo contro</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr><td colSpan="14" style={{ textAlign: 'center', padding: '1rem' }}>Cargando…</td></tr>
                                        ) : (paciente?.length ?? 0) === 0 ? (
                                            <tr><td colSpan="14" style={{ textAlign: 'center', padding: '1rem' }}>No se encontraron pacientes</td></tr>
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
                                                    <td>{formatDate(p.fecha_probable_parto)}</td>
                                                    <td>{formatDate(p.primer_control_post_parto)}</td>
                                                    <td>{formatDate(p.segundo_control_post_parto)}</td>
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

                                    <section className="card--form">
                                        <label name="fecha_probable_parto">Fecha Parto:</label>
                                        <input
                                            type="date"
                                            name="fecha_probable_parto"
                                            value={formPaciente.fecha_probable_parto}
                                            onChange={handleChange}
                                            required
                                        />
                                    </section>

                                    <section className="card--form">
                                        <label name="primer_control_post_parto">Primer Control:</label>
                                        <input
                                            type="date"
                                            name="primer_control_post_parto"
                                            value={formPaciente.primer_control_post_parto}
                                            onChange={handleChange}
                                        />
                                    </section>

                                    <section className="card--form">
                                        <label name="segundo_control_post_parto">Segundo control:</label>
                                        <input
                                            type="date"
                                            name="segundo_control_post_parto"
                                            value={formPaciente.segundo_control_post_parto}
                                            onChange={handleChange}
                                        />
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

                                    <section className="card--form">
                                        <label name="fecha_probable_parto">Fecha Parto:</label>
                                        <input
                                            type="date"
                                            name="fecha_probable_parto"
                                            value={formPaciente.fecha_probable_parto}
                                            onChange={handleChange}
                                            required
                                        />
                                    </section>

                                    <section className="card--form">
                                        <label name="primer_control_post_parto">Primer Control:</label>
                                        <input
                                            type="date"
                                            name="primer_control_post_parto"
                                            value={formPaciente.primer_control_post_parto}
                                            onChange={handleChange}

                                        />
                                    </section>

                                    <section className="card--form">
                                        <label name="segundo_control_post_parto">Segundo control:</label>
                                        <input
                                            type="date"
                                            name="segundo_control_post_parto"
                                            value={formPaciente.segundo_control_post_parto}
                                            onChange={handleChange}
                                        />
                                    </section>

                                    <section className="button--option">
                                        <button type="button" onClick={handleCancel}>
                                            Cancelar
                                        </button>
                                        <button type="submit">
                                            agregar paciente
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

export default Prenatal;