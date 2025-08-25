// prenatalexcel.jsx
import * as XLSX from "xlsx";

// util: convertir iso a Date para que Excel lo reconozca como fecha
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
  "Fecha probable de parto",
  "Primer control post parto",
  "Segundo control post parto",
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
  toDate(r.fecha_probable_parto),
  toDate(r.primer_control_post_parto),
  toDate(r.segundo_control_post_parto),
]);

export function ExportPrenatalExcel(rows, filename = `prenatal_${new Date().getFullYear()}.xlsx`) {
  // rows puede venir como { prenatal: [...] } o como [...]
  const dataArray = Array.isArray(rows?.prenatal) ? rows.prenatal : (Array.isArray(rows) ? rows : []);
  if (!dataArray.length) return;

  // AOA para controlar orden de columnas
  const aoa = [HEADERS, ...dataArray.map(mapRow)];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(aoa, { cellDates: true });

  // anchos de columnas (aprox. en caracteres)
  ws["!cols"] = [
    { wch: 12 }, // ID
    { wch: 14 }, // expediente
    { wch: 28 }, // nombre
    { wch: 26 }, // dirección
    { wch: 6 },  // edad
    { wch: 18 }, // fecha nac
    { wch: 18 }, // CUI
    { wch: 14 }, // teléfono
    { wch: 18 }, // fecha inscripción
    { wch: 22 }, // lugar
    { wch: 12 }, // fk lugar
    { wch: 22 }, // FPP
    { wch: 24 }, // 1er control
    { wch: 24 }, // 2do control
  ];

  // autofiltro
  ws["!autofilter"] = { ref: ws["!ref"] };

  XLSX.utils.book_append_sheet(wb, ws, "Prenatal");
  XLSX.writeFile(wb, filename);
}
