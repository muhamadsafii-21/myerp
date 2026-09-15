import NotificationBell from './NotificationBell';
import UserMenu from './UserMenu';

export default function Header() {
    return (
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
            <div>
                <h2 className="text-lg font-semibold text-gray-800">Selamat datang kembali 👋</h2>
                <p className="text-xs text-gray-500">
                    {new Date().toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <NotificationBell />
                <UserMenu />
            </div>
        </header>
    );
}