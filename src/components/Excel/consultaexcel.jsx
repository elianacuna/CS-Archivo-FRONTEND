// consultaexcel.jsx
import * as XLSX from "xlsx";

// util: convertir ISO a Date para que Excel lo reconozca como fecha
const toDate = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d) ? null : d;
};

const HEADERS = [
  "ID Paciente",
  "N° Expediente",
  "Nombre completo",
  "Dirección exacta",
  "Edad",
  "Fecha de nacimiento",
  "CUI",
  "Teléfono",
  "Fecha de inscripción",
  "Lugar",
  "fk_id_lugares",
];

const mapRow = (r = {}) => ([
  r.id_paciente ?? "",
  r.num_expediente ?? "",
  r.nombre_completo ?? "",
  r.direccion_exacta ?? "",
  r.edad ?? "",
  toDate(r.fecha_nacimiento),
  r.cui ?? "",
  r.numero_telefono ?? "",
  toDate(r.fecha_inscripcion),
  r.lugar ?? "",
  r.fk_id_lugares ?? "",
]);

export function ExportConsultaExcel(rows, filename = `consulta_${new Date().getFullYear()}.xlsx`) {
  // rows puede venir como { consulta: [...] } o como [...]
  const dataArray = Array.isArray(rows?.consulta) ? rows.consulta : (Array.isArray(rows) ? rows : []);
  if (!dataArray.length) return;

  const aoa = [HEADERS, ...dataArray.map(mapRow)];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(aoa, { cellDates: true });

  // anchos de columnas
  ws["!cols"] = [
    { wch: 12 }, // ID
    { wch: 14 }, // expediente
    { wch: 30 }, // nombre
    { wch: 26 }, // dirección
    { wch: 6 },  // edad
    { wch: 18 }, // fecha nac
    { wch: 18 }, // CUI
    { wch: 14 }, // teléfono
    { wch: 18 }, // fecha insc
    { wch: 24 }, // lugar
    { wch: 12 }, // fk lugar
  ];

  // autofiltro
  ws["!autofilter"] = { ref: ws["!ref"] };

  XLSX.utils.book_append_sheet(wb, ws, "Consulta");
  XLSX.writeFile(wb, filename);
}
