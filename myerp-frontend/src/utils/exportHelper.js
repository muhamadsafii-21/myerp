import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatRupiah } from './formatCurrency';

export const exportToExcel = (data, columns, filename, title) => {
    const rows = data.map((item) => {
        const row = {};
        columns.forEach((col) => {
            row[col.header] = col.format ? col.format(item[col.key]) : item[col.key];
        });
        return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToPDF = (data, columns, filename, title) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(title, 14, 20);

    doc.setFontSize(10);
    doc.text(`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`, 14, 28);

    const tableColumns = columns.map((col) => col.header);
    const tableRows = data.map((item) =>
        columns.map((col) => {
            const value = item[col.key];
            if (col.pdfFormat) return col.pdfFormat(value);
            if (col.format) return col.format(value);
            return value ?? '-';
        })
    );

    autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: 35,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save(`${filename}.pdf`);
};

export const currencyFormatter = (value) => formatRupiah(value);