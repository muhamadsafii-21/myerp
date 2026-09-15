import { Package, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { formatRupiah } from '../../utils/formatCurrency';

export default function StatsCards({ stats }) {
    const cards = [
        {
            label: 'Total Produk',
            value: stats?.totalProducts ?? 0,
            icon: Package,
            color: 'bg-blue-500',
            isCurrency: false
        },
        {
            label: 'Total Customer',
            value: stats?.totalCustomers ?? 0,
            icon: Users,
            color: 'bg-purple-500',
            isCurrency: false
        },
        {
            label: 'Pembelian Bulan Ini',
            value: stats?.purchasesThisMonth ?? 0,
            icon: TrendingDown,
            color: 'bg-orange-500',
            isCurrency: true
        },
        {
            label: 'Penjualan Bulan Ini',
            value: stats?.salesThisMonth ?? 0,
            icon: TrendingUp,
            color: 'bg-green-500',
            isCurrency: true
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div key={card.label} className="bg-white rounded-lg shadow p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{card.label}</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">
                                    {card.isCurrency ? formatRupiah(card.value) : card.value}
                                </p>
                            </div>
                            <div className={`${card.color} p-3 rounded-lg`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}