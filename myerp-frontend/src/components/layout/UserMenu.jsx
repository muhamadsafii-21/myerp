import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/authContext';
import { getInitials, getAvatarColor, getAvatarUrl } from '../../utils/avatarHelper';

export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { user, logoutUser } = useAuth();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const fullName = user?.fullName || user?.username || 'User';
    const roleName = typeof user?.role === 'string'
        ? user.role
        : user?.role?.name || '-';
    const avatarUrl = getAvatarUrl(user?.avatarUrl);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={fullName}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getAvatarColor(fullName)}`}>
                        {getInitials(fullName)}
                    </div>
                )}
                <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-800 leading-tight">
                        {fullName}
                    </p>
                    <p className="text-xs text-gray-500 leading-tight">{roleName}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{fullName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{user?.email || user?.username}</p>
                        <p className="text-xs text-blue-600 mt-1 font-medium">{roleName}</p>
                    </div>

                    <div className="py-1">
                        <Link
                            to="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            <User className="w-4 h-4" />
                            <span>Profil Saya</span>
                        </Link>
                    </div>

                    <div className="border-t border-gray-100 py-1">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}