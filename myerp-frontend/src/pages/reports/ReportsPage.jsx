import { useState } from 'react';
import { ShoppingCart, TrendingUp, Package } from 'lucide-react';
import PurchaseReport from './PurchaseReport';
import SalesReport from './SalesReport';
import StockReport from './StockReport';

const tabs = [
    { id: 'purchase', label: 'Pembelian', icon: ShoppingCart },
    { id: 'sales', label: 'Penjualan', icon: TrendingUp },
    { id: 'stock', label: 'Stok', icon: Package }
];

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState('purchase');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Laporan</h1>
                <p className="text-gray-500 text-sm mt-1">Rekap data transaksi dan stok</p>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="flex border-b border-gray-200">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                                    isActive
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {activeTab === 'purchase' && <PurchaseReport />}
            {activeTab === 'sales' && <SalesReport />}
            {activeTab === 'stock' && <StockReport />}
        </div>
    );
}