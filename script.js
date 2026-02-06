document.addEventListener("DOMContentLoaded", () => {
  const downloadBtn = document.getElementById("downloadPDF");
  if (!downloadBtn) return; // No hay botón, salir

  downloadBtn.addEventListener("click", async () => {
    // Buscar el formulario que exista en el DOM y sea visible (form1, form2,... form5)
    let form = null;
    for (let i = 1; i <= 5; i++) {
      const f = document.getElementById("form" + i);
      if (f && window.getComputedStyle(f).display !== "none") {
        form = f;
        break;
      }
    }

    if (!form) {
      alert("No se encontró el formulario visible para generar PDF.");
      return;
    }

    // Forzar estilos para capturar todo
    const originalStyle = {
      height: form.style.height,
      overflow: form.style.overflow
    };
    form.style.height = "auto";
    form.style.overflow = "visible";

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    const canvas = await html2canvas(form, {
      scale: isIOS ? 1.5 : 2,
      useCORS: true,
      windowWidth: form.scrollWidth,
      windowHeight: form.scrollHeight,
      scrollX: 0,
      scrollY: -window.scrollY
    });

    // Restaurar estilos
    form.style.height = originalStyle.height;
    form.style.overflow = originalStyle.overflow;

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jspdf.jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("Documento.pdf");
  });
});
