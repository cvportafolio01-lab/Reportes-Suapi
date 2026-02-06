document.getElementById("downloadPDF").addEventListener("click", () => {
    // Selecciona el div que está visible
    const form = document.querySelector(".page:not([style*='display: none'])"); 

    html2canvas(form, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jspdf.jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("Formato.pdf");
    });
});
