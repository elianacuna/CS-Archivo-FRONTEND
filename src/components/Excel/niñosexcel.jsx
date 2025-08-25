import * as XLSX from 'xlsx';

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

export function ExportNiniosExcel(rows, filename = `ninios_${new Date().getFullYear()}.xlsx`) {
  // rows puede venir como { ninios: [...] } o como [...]
  const dataArray = Array.isArray(rows?.ninios) ? rows.ninios : (Array.isArray(rows) ? rows : []);
  if (!dataArray.length) return;

  // armamos matriz (AOA) para control total del orden de columnas
  const aoa = [HEADERS, ...dataArray.map(mapRow)];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(aoa, { cellDates: true });

  // anchos aproximados
  ws["!cols"] = [
    { wch: 12 }, // ID
    { wch: 14 }, // expediente
    { wch: 28 }, // nombre
    { wch: 26 }, // dirección
    { wch: 6 },  // edad
    { wch: 18 }, // fec nac
    { wch: 18 }, // CUI
    { wch: 14 }, // tel
    { wch: 18 }, // fec insc
    { wch: 22 }, // lugar
    { wch: 12 }, // fk lugar
  ];

  // autofiltro en todo el rango
  ws["!autofilter"] = { ref: ws["!ref"] };

  XLSX.utils.book_append_sheet(wb, ws, "Ninios");
  XLSX.writeFile(wb, filename);
}