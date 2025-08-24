import React from "react";
import { Document, Page, Text, View, Image, StyleSheet, Font, pdf } from "@react-pdf/renderer";



const styles = StyleSheet.create({
  page: {
    padding: 32,
    backgroundColor: "#F8FAFC",
    fontFamily: "Helvetica", // <- usar estándar para evitar "Unknown font format"
    fontSize: 11,
    color: "#0F172A",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    border: "1pt solid #E2E8F0",
    boxShadow: "0 2pt 8pt rgba(15,23,42,0.06)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  logoWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: { width: 56, height: 56, objectFit: "contain" },
  titleBox: { marginLeft: 8 },
  title: { fontSize: 18, fontWeight: "bold", color: "#111827" }, // usar 'bold' con Helvetica
  subtitle: { fontSize: 10, color: "#64748B", marginTop: 2 },
  badge: {
    border: "1pt solid #60A5FA",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 10,
    color: "#1D4ED8",
  },
  sectionTitle: { fontSize: 12, fontWeight: "bold", marginTop: 12, marginBottom: 8, color: "#0F172A" },
  grid: { display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 8 },
  field: {
    width: "48%",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    border: "1pt solid #E2E8F0",
  },
  label: { fontSize: 9, color: "#475569", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  value: { fontSize: 11, color: "#0F172A" },
  footer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#64748B",
    fontSize: 9,
  },
  watermark: { position: "absolute", top: 200, left: 75, opacity: 0.05 },
});

const fmtDate = (iso) => {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("es-GT", { dateStyle: "long" }).format(d);
  } catch (e) {
    return String(iso);
  }
};

const NiniosPDFDoc = ({ data, logoSrc }) => {
  const {
    id_paciente,
    num_expediente,
    nombre_completo,
    direccion_exacta,
    edad,
    fecha_nacimiento,
    cui,
    numero_telefono,
    fecha_inscripcion,
    lugar,
  } = data || {};

  return (
    <Document author="Sistema de Registro" title={`Niño/a ${nombre_completo || "-"}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.watermark}>
          {logoSrc ? <Image src={logoSrc} style={{ width: 400, height: 400 }} /> : null}
        </View>

        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.logoWrap}>
              {logoSrc ? <Image src={logoSrc} style={styles.logo} /> : null}
              <View style={styles.titleBox}>
                <Text style={styles.title}>Ficha de Registro — Niños</Text>
                <Text style={styles.subtitle}>Centro de Salud | Registro de pacientes pediátricos</Text>
              </View>
            </View>
            <Text style={styles.badge}>Expediente #{num_expediente || "-"}</Text>
          </View>

          <Text style={styles.sectionTitle}>Datos del paciente</Text>
          <View style={styles.grid}>
            <View style={styles.field}>
              <Text style={styles.label}>ID Paciente</Text>
              <Text style={styles.value}>{id_paciente ?? "-"}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Nombre completo</Text>
              <Text style={styles.value}>{nombre_completo || "-"}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>CUI</Text>
              <Text style={styles.value}>{cui || "-"}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Edad</Text>
              <Text style={styles.value}>{edad != null ? `${edad} años` : "-"}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Fecha de nacimiento</Text>
              <Text style={styles.value}>{fmtDate(fecha_nacimiento)}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Teléfono</Text>
              <Text style={styles.value}>{numero_telefono || "-"}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Fecha de inscripción</Text>
              <Text style={styles.value}>{fmtDate(fecha_inscripcion)}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Lugar</Text>
              <Text style={styles.value}>{lugar || "-"}</Text>
            </View>
            <View style={[styles.field, { width: "100%" }]}>
              <Text style={styles.label}>Dirección exacta</Text>
              <Text style={styles.value}>{direccion_exacta || "-"}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text>Generado por el Sistema — {new Date().toLocaleDateString("es-GT")}</Text>
            <Text>Página 1</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const API_URL = import.meta.env.VITE_API_URL; // asegúrate que termine con '/'

export const generarPDF = async (id) => {
  try {
    const res = await fetch(`${API_URL}ninios/${id}`);
    if (!res.ok) throw new Error(`Error al obtener datos (${res.status})`);
    const data = await res.json();

    let logoSrc = null;
    try {
      // Mejor PNG/JPG que SVG en PDF
      // Ajusta la ruta real (assets vs assest)
      const pngLogo = new URL("../assest/logo.svg", import.meta.url).toString();
      logoSrc = pngLogo;
    } catch {
      logoSrc = null;
    }

    const blob = await pdf(<NiniosPDFDoc data={data} logoSrc={logoSrc} />).toBlob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nino_${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("No se pudo generar el PDF:", err);
    alert(`No se pudo generar el PDF: ${err.message}`);
  }
};

// SIN TILDE en el nombre del componente/export
export const NiniosPDF = ({ data, logoSrc }) => <NiniosPDFDoc data={data} logoSrc={logoSrc} />;
export default NiniosPDF;
