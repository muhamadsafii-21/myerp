import { useState, useEffect } from 'react';
import { Search, FileText, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';
import { getStockReport } from '../../api/reports';
import { formatRupiah } from '../../utils/formatCurrency';
import { exportToExcel, exportToPDF } from '../../utils/exportHelper';

export default function StockReport() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lowStockOnly, setLowStockOnly] = useState(false);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const data = await getStockReport({ lowStockOnly });
            setReport(data);
        } catch (err) {
            toast.error('Gagal memuat laporan stok.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const columns = [
        { header: 'SKU', key: 'sku' },
        { header: 'Nama Produk', key: 'name' },
        { header: 'Unit', key: 'unit' },
        { header: 'Stok', key: 'stock' },
        { header: 'Stok Min', key: 'stockMinimum' },
        {
            header: 'Harga Beli',
            key: 'cost',
            format: (v) => formatRupiah(v),
            pdfFormat: (v) => formatRupiah(v)
        },
        {
            header: 'Nilai Stok',
            key: 'stockValue',
            format: (v) => formatRupiah(v),
            pdfFormat: (v) => formatRupiah(v)
        }
    ];

    const handleExportExcel = () => {
        if (!report?.items?.length) {
            toast.error('Tidak ada data untuk diexport.');
            return;
        }
        exportToExcel(report.items, columns, `Laporan-Stok-${new Date().toISOString().split('T')[0]}`, 'Laporan Stok');
        toast.success('Excel berhasil diunduh!');
    };

    const handleExportPDF = () => {
        if (!report?.items?.length) {
            toast.error('Tidak ada data untuk diexport.');
            return;
        }
        exportToPDF(report.items, columns, `Laporan-Stok-${new Date().toISOString().split('T')[0]}`, 'Laporan Stok');
        toast.success('PDF berhasil diunduh!');
    };

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={lowStockOnly}
                            onChange={(e) => setLowStockOnly(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <span className="text-sm font-medium text-gray-700">
                            Tampilkan hanya stok menipis
                        </span>
                    </label>
                    <button onClick={fetchReport} className="btn-primary flex items-center gap-2 ml-auto">
                        <Search className="w-4 h-4" />
                        Cari
                    </button>
                </div>
            </div>

            {report && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Total Produk</p>
                            <p className="text-2xl font-bold text-purple-600">{report.totalProducts}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Nilai Stok</p>
                            <p className="text-2xl font-bold text-purple-600">{formatRupiah(report.totalStockValue)}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-bold text-gray-800">Detail Produk</h3>
                    <div className="flex gap-2">
                        <button onClick={handleExportExcel} className="btn-success flex items-center gap-2 text-sm">
                            <FileSpreadsheet className="w-4 h-4" />
                            Excel
                        </button>
                        <button onClick={handleExportPDF} className="btn-danger flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4" />
                            PDF
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="p-6 text-center text-gray-500">Memuat data...</div>
                ) : !report?.items?.length ? (
                    <div className="p-6 text-center text-gray-500">Tidak ada data.</div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stok</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Min</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga Beli</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Nilai Stok</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {report.items.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-mono">{item.sku}</td>
                                    <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                                    <td className="px-4 py-3 text-sm">{item.unit || '-'}</td>
                                    <td className={`px-4 py-3 text-sm text-right ${item.stock <= item.stockMinimum ? 'text-red-600 font-semibold' : ''}`}>
                                        {item.stock}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right text-gray-500">{item.stockMinimum}</td>
                                    <td className="px-4 py-3 text-sm text-right">{formatRupiah(item.cost)}</td>
                                    <td className="px-4 py-3 text-sm text-right font-medium">{formatRupiah(item.stockValue)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}