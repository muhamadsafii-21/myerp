import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Truck,
    LogOut,
    ShoppingCart,
    Users,
    ShoppingBag,
    FileBarChart,
    X
} from 'lucide-react';
import { useAuth } from '../../context/authContext';

const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/products', label: 'Produk', icon: Package },
    { path: '/suppliers', label: 'Supplier', icon: Truck },
    { path: '/customers', label: 'Customer', icon: Users },
    { path: '/purchase', label: 'Pembelian', icon: ShoppingCart },
    { path: '/sales', label: 'Penjualan', icon: ShoppingBag },
    { path: '/reports', label: 'Laporan', icon: FileBarChart }
];

export default function Sidebar({ isOpen, onClose }) {
    const { logoutUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const handleLinkClick = () => {
        if (onClose) onClose();
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed lg:sticky lg:top-0 lg:h-screen top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-200 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">M</span>
                        </div>
                        <h1 className="text-lg font-bold text-gray-800">MyERP</h1>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={handleLinkClick}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-600 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                }`}
                            >
                                <Icon className="w-[18px] h-[18px]" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-[18px] h-[18px]" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}