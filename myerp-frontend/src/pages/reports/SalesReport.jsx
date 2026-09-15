import { useState, useEffect } from 'react';
import { Search, FileText, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSalesReport } from '../../api/reports';
import { getCustomers } from '../../api/customers';
import { formatRupiah } from '../../utils/formatCurrency';
import { exportToExcel, exportToPDF } from '../../utils/exportHelper';

export default function SalesReport() {
    const [report, setReport] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [customerId, setCustomerId] = useState('');

    useEffect(() => {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        setEndDate(today.toISOString().split('T')[0]);
        setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);

        getCustomers().then(setCustomers).catch(() => {});
    }, []);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const params = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
            if (customerId) params.customerId = customerId;

            const data = await getSalesReport(params);
            setReport(data);
        } catch (err) {
            toast.error('Gagal memuat laporan penjualan.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const columns = [
        { header: 'No. Invoice', key: 'invoiceNumber' },
        { header: 'Customer', key: 'customerName' },
        {
            header: 'Tanggal',
            key: 'orderDate',
            format: (v) => new Date(v).toLocaleDateString('id-ID'),
            pdfFormat: (v) => new Date(v).toLocaleDateString('id-ID')
        },
        { header: 'Status', key: 'status' },
        {
            header: 'Total',
            key: 'totalAmount',
            format: (v) => formatRupiah(v),
            pdfFormat: (v) => formatRupiah(v)
        }
    ];

    const handleExportExcel = () => {
        if (!report?.items?.length) {
            toast.error('Tidak ada data untuk diexport.');
            return;
        }
        exportToExcel(report.items, columns, `Laporan-Penjualan-${startDate}-${endDate}`, 'Laporan Penjualan');
        toast.success('Excel berhasil diunduh!');
    };

    const handleExportPDF = () => {
        if (!report?.items?.length) {
            toast.error('Tidak ada data untuk diexport.');
            return;
        }
        exportToPDF(report.items, columns, `Laporan-Penjualan-${startDate}-${endDate}`, 'Laporan Penjualan');
        toast.success('PDF berhasil diunduh!');
    };

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                        <select
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            className="input-field"
                        >
                            <option value="">Semua Customer</option>
                            {customers.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={fetchReport} className="btn-primary flex items-center justify-center gap-2">
                        <Search className="w-4 h-4" />
                        Cari
                    </button>
                </div>
            </div>

            {report && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Total Transaksi</p>
                            <p className="text-2xl font-bold text-green-600">{report.totalTransactions}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Penjualan</p>
                            <p className="text-2xl font-bold text-green-600">{formatRupiah(report.totalAmount)}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-bold text-gray-800">Detail Transaksi</h3>
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
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Invoice</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {report.items.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-mono">{item.invoiceNumber}</td>
                                    <td className="px-4 py-3 text-sm">{item.customerName || '-'}</td>
                                    <td className="px-4 py-3 text-sm">
                                        {new Date(item.orderDate).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right font-medium">
                                        {formatRupiah(item.totalAmount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}