import { useState, useRef } from 'react';
import { Camera, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadAvatar, deleteAvatar } from '../../api/users';
import { getInitials, getAvatarColor, getAvatarSrc } from '../../utils/avatarHelper';

export default function AvatarUpload({ user, onUpdate }) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const fullName = user?.fullName || user?.username || 'User';
   const avatarUrl = getAvatarSrc(user);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Ukuran file maksimal 2 MB.');
            return;
        }

        try {
            setUploading(true);
            const updated = await uploadAvatar(file);
            toast.success('Foto profil berhasil diperbarui!');
            onUpdate(updated);
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal upload foto.';
            toast.error(message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async () => {
        try {
            setUploading(true);
            await deleteAvatar();
            toast.success('Foto profil dihapus.');
            onUpdate({ ...user, avatarUrl: null });
        } catch {
            toast.error('Gagal menghapus foto.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex items-center gap-6">
            <div className="relative">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={fullName}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                    />
                ) : (
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow ${getAvatarColor(fullName)}`}>
                        {getInitials(fullName)}
                    </div>
                )}
                {uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-white animate-pulse" />
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                        <Camera className="w-4 h-4" />
                        {avatarUrl ? 'Ganti Foto' : 'Upload Foto'}
                    </button>

                    {avatarUrl && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={uploading}
                            className="btn-danger flex items-center gap-2 text-sm disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4" />
                            Hapus
                        </button>
                    )}
                </div>

                <p className="text-xs text-gray-500">
                    Format JPG/PNG, maksimal 2 MB.
                </p>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}