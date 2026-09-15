import { useState, useEffect } from 'react';
import { User, Mail, Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProfile, updateProfile, changePassword } from '../../api/users';
import { useAuth } from '../../context/authContext';
import AvatarUpload from '../../components/profile/AvatarUpload';

export default function ProfilePage() {
    const { user, loginUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [profileForm, setProfileForm] = useState({ fullName: '', email: '' });
    const [savingProfile, setSavingProfile] = useState(false);

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [savingPassword, setSavingPassword] = useState(false);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await getProfile();
            setProfile(data);
            setProfileForm({ fullName: data.fullName, email: data.email });
        } catch (err) {
            toast.error('Gagal memuat profil.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileForm({ ...profileForm, [name]: value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            setSavingProfile(true);
            const updated = await updateProfile(profileForm);
            setProfile(updated);

            const token = localStorage.getItem('token');
            loginUser(
                {
                    ...user,
                    fullName: updated.fullName,
                    email: updated.email,
                    avatarUrl: updated.avatarUrl
                },
                token
            );

            toast.success('Profil berhasil diperbarui!');
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal menyimpan profil.';
            toast.error(message);
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm({ ...passwordForm, [name]: value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Konfirmasi password tidak cocok.');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            toast.error('Password minimal 6 karakter.');
            return;
        }

        try {
            setSavingPassword(true);
            await changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            toast.success('Password berhasil diubah!');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal mengubah password.';
            toast.error(message);
        } finally {
            setSavingPassword(false);
        }
    };

    const handleAvatarUpdate = (updatedProfile) => {
        setProfile(updatedProfile);
        const token = localStorage.getItem('token');
        loginUser(
            {
                ...user,
                avatarUrl: updatedProfile.avatarUrl
            },
            token
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-gray-500">Memuat profil...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Profil Saya</h1>
                <p className="text-gray-500 text-sm mt-1">Kelola informasi akun Anda</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Foto Profil</h2>
                <AvatarUpload user={profile} onUpdate={handleAvatarUpdate} />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Informasi Akun</h2>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            value={profile?.username || ''}
                            disabled
                            className="input-field bg-gray-100 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">Username tidak bisa diubah.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Lengkap
                        </label>
                        <div className="relative">
                            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="fullName"
                                value={profileForm.fullName}
                                onChange={handleProfileChange}
                                className="input-field pl-9"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={profileForm.email}
                                onChange={handleProfileChange}
                                className="input-field pl-9"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <input
                            type="text"
                            value={profile?.role || '-'}
                            disabled
                            className="input-field bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={savingProfile}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {savingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Ganti Password</h2>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password Lama
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                className="input-field pl-9"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password Baru
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                className="input-field pl-9"
                                minLength="6"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Konfirmasi Password Baru
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                                className="input-field pl-9"
                                minLength="6"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={savingPassword}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50"
                        >
                            <Lock className="w-4 h-4" />
                            {savingPassword ? 'Menyimpan...' : 'Ubah Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}