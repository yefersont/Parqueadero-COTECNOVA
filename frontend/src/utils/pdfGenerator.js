import jsPDF from "jspdf";

/**
 * Carga una imagen y la convierte a base64
 * @param {string} url - URL de la imagen
 * @returns {Promise<string>} - Imagen en base64
 */
const cargarImagen = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Genera un PDF con el reporte de ingresos en formato profesional
 * @param {Array} datos - Array de objetos con los datos filtrados
 * @returns {Promise<void>} - Abre el PDF en una nueva ventana
 */
export const generarPDFIngresos = async (datos) => {
  const doc = new jsPDF({
    orientation: "portrait", // Vertical
    unit: "mm",
    format: "letter", // Tamaño Carta
  });

  const margin = 20; // Márgenes laterales aumentados
  let yPos = 15;

  // Establecer Times New Roman como fuente predeterminada
  doc.setFont("times");

  // Cargar el logo
  let logoBase64;
  try {
    logoBase64 = await cargarImagen("/cotecnova.png");
  } catch (error) {
    console.warn("No se pudo cargar el logo:", error);
  }

  // ========== ENCABEZADO (Tabla con 3 columnas) ==========
  const headerHeight = 25;
  const headerWidth = 215.9 - margin * 2; // Ancho total Carta vertical - márgenes

  // Rectángulo exterior del encabezado con borde delgado
  doc.setDrawColor(0);
  doc.setLineWidth(0.25); // Borde delgado
  doc.rect(margin, yPos, headerWidth, headerHeight);

  // COLUMNA 1: Logo (20% = ~50mm)
  const col1Width = 37; // Ajustado al 20% del ancho
  doc.line(margin + col1Width, yPos, margin + col1Width, yPos + headerHeight);

  // Mostrar logo si se cargó correctamente
  if (logoBase64) {
    try {
      // Logo más grande para mejor visibilidad
      doc.addImage(logoBase64, "PNG", margin + 7, yPos + 5, 20, 15);
    } catch (error) {
      console.warn("Error al agregar logo al PDF:", error);
      // Si falla, mostrar placeholder
      doc.setFillColor(240, 240, 240);
      doc.rect(margin + 7, yPos + 5, 20, 15, "F");
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text("LOGO", margin + 12, yPos + 13);
    }
  } else {
    // Placeholder del logo si no se pudo cargar
    doc.setFillColor(240, 240, 240);
    doc.rect(margin + 7, yPos + 5, 20, 15, "F");
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("LOGO", margin + 12, yPos + 13);
  }

  // COLUMNA 2: Título central (60% del ancho disponible)
  const col2Width = headerWidth - col1Width - 37; // 37mm para la columna de fecha
  doc.setFontSize(16); // Título reducido
  doc.setTextColor(0);
  doc.setFont("times", "bold");
  doc.text("COTECNOVA", margin + col1Width + col2Width / 2, yPos + 12, {
    align: "center",
  });

  doc.setFontSize(12); // Subtítulo reducido
  doc.setFont("times", "normal");
  doc.text(
    "Sistema de gestión vehicular",
    margin + col1Width + col2Width / 2,
    yPos + 18,
    { align: "center" }
  );

  // COLUMNA 3: Fecha (37mm)
  doc.setLineWidth(0.25);
  doc.line(
    margin + col1Width + col2Width,
    yPos,
    margin + col1Width + col2Width,
    yPos + headerHeight
  );

  doc.setFontSize(10); // Fecha reducida
  doc.setTextColor(0);
  const fechaText = `Fecha:\n${new Date().toLocaleDateString("es-CO")}`;
  const fechaX = margin + col1Width + col2Width + 18.5;
  doc.text("Fecha:", fechaX, yPos + 10, { align: "center" });
  doc.text(
    new Date().toLocaleDateString("es-CO"),
    fechaX,
    yPos + 16,
    { align: "center" }
  );

  yPos += headerHeight + 8;

  // ========== TABLA DE DATOS ==========
  // Ancho disponible: 215.9mm (carta) - 28mm (márgenes) = 187.9mm
  const colWidths = [55, 25, 22, 35, 35]; // Total: 172mm - Propietario más ancho, fechas reducidas
  const rowHeight = 14; // Altura mayor para acomodar 2 líneas
  const tableHeaders = ["Propietario", "Cédula", "Placa", "Ingreso", "Salida"];
  const padding = 5; // Padding horizontal aumentado

  // Encabezados de tabla con bordes delgados
  doc.setFillColor(241, 241, 241); // #f1f1f1 from CSS
  doc.setDrawColor(0);
  doc.setLineWidth(0.2); // Bordes delgados
  doc.rect(margin, yPos, headerWidth, rowHeight, "FD");

  doc.setFontSize(10); // Encabezados aumentados
  doc.setFont("times", "bold");
  doc.setTextColor(0);

  let xPos = margin + padding;
  tableHeaders.forEach((header, i) => {
    doc.text(header, xPos, yPos + 9);
    if (i < tableHeaders.length - 1) {
      doc.line(
        xPos + colWidths[i] - padding,
        yPos,
        xPos + colWidths[i] - padding,
        yPos + rowHeight
      );
    }
    xPos += colWidths[i];
  });

  yPos += rowHeight;

  // Datos de la tabla
  doc.setFont("times", "normal");
  doc.setFontSize(9); // Datos aumentados

  datos.forEach((item, index) => {
    // Alternar color de fondo (#fafafa from CSS)
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, yPos, headerWidth, rowHeight, "F");
    }

    // Dibujar bordes de fila
    doc.setLineWidth(0.2);
    doc.rect(margin, yPos, headerWidth, rowHeight);

    xPos = margin + padding;
    
    // Formatear fechas en dos líneas
    const ingreso =
      item.Fecha && item.Hora
        ? `${item.Fecha}\n${item.Hora}` // Fecha arriba, hora abajo
        : item.Fecha || "—";
    const salida =
      item.FechaSalida && item.HoraSalida && item.FechaSalida !== "--/--/--"
        ? `${item.FechaSalida}\n${item.HoraSalida}` // Fecha arriba, hora abajo
        : "—";

    const row = [
      item.Propietario.substring(0, 35), // Más caracteres permitidos
      item.Cedula,
      item.Vehículo,
      ingreso,
      salida,
    ];

    row.forEach((cell, i) => {
      // Para fechas con salto de línea, dibujar en dos líneas
      if (i >= 3 && String(cell).includes('\n')) {
        const lineas = String(cell).split('\n');
        doc.text(lineas[0], xPos, yPos + 6); // Fecha
        doc.text(lineas[1], xPos, yPos + 11); // Hora
      } else {
        doc.text(String(cell), xPos, yPos + 9);
      }
      
      if (i < row.length - 1) {
        doc.line(
          xPos + colWidths[i] - padding,
          yPos,
          xPos + colWidths[i] - padding,
          yPos + rowHeight
        );
      }
      xPos += colWidths[i];
    });

    yPos += rowHeight;

    // Nueva página si es necesario
    if (yPos > 250) { // Más espacio vertical en formato carta
      doc.addPage();
      yPos = 20;
    }
  });

  // ========== FOOTER ==========
  const footerY = 270;
  doc.setFontSize(8);
  doc.setTextColor(85);
  const footerText = `Generado automáticamente por el Sistema de Gestión Vehicular — ${new Date().toLocaleString(
    "es-CO"
  )}`;
  doc.text(footerText, 215.9 / 2, footerY, { align: "center" }); // Centrado en página Carta vertical

  // Abrir en nueva ventana en lugar de descargar
  window.open(doc.output("bloburl"), "_blank");
};
