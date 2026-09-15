import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getDashboardData } from '../../api/dashboard';
import StatsCards from './StatsCards';
import SalesChart from './SalesChart';
import LowStockAlert from './LowStockAlert';
import RecentActivity from './RecentActivity';

export default function DashboardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getDashboardData();
            setData(response);
        } catch (err) {
            toast.error('Gagal memuat data dashboard.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-gray-500">Memuat dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Ringkasan bisnis Anda</p>
            </div>

            <StatsCards stats={data?.stats} />

            <SalesChart data={data?.salesChart} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LowStockAlert products={data?.lowStockProducts} />
                <RecentActivity activities={data?.recentActivity} />
            </div>
        </div>
    );
}