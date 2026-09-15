import { useState, useEffect, useRef } from 'react';
import { Bell, AlertTriangle, Package, TrendingUp } from 'lucide-react';
import { getNotifications, getNotificationCount } from '../../api/notifications';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [count, setCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const fetchCount = async () => {
        try {
            const data = await getNotificationCount();
            setCount(data.unreadCount || 0);
        } catch {
            // silent fail
        }
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await getNotifications();
            setNotifications(data);
        } catch {
            // silent fail
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCount();
        const interval = setInterval(fetchCount, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        if (!isOpen) {
            fetchNotifications();
        }
        setIsOpen(!isOpen);
    };

    const getIcon = (type) => {
        if (type === 'warning') return <AlertTriangle className="w-4 h-4 text-orange-500" />;
        if (type === 'success') return <TrendingUp className="w-4 h-4 text-green-500" />;
        return <Package className="w-4 h-4 text-blue-500" />;
    };

    const formatTime = (date) => {
        const diff = Date.now() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Baru saja';
        if (minutes < 60) return `${minutes} menit lalu`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} jam lalu`;
        const days = Math.floor(hours / 24);
        return `${days} hari lalu`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleToggle}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                {count > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
                        {count > 99 ? '99+' : count}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">Notifikasi</h3>
                        {count > 0 && (
                            <span className="text-xs text-gray-500">{count} baru</span>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-6 text-center text-sm text-gray-500">Memuat...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-6 text-center text-sm text-gray-500">
                                Tidak ada notifikasi
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className="flex gap-3 p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 cursor-pointer"
                                >
                                    <div className="flex-shrink-0 mt-0.5">
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800">
                                            {notif.title}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                                            {notif.message}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatTime(notif.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}