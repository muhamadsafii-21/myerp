import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { formatRupiah } from '../../utils/formatCurrency';

export default function SalesChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Grafik 7 Hari Terakhir</h2>
                <p className="text-gray-500 text-center py-8">Belum ada data.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Grafik 7 Hari Terakhir</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip formatter={(value) => formatRupiah(value)} />
                    <Legend />
                    <Bar dataKey="sales" name="Penjualan" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="purchases" name="Pembelian" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}