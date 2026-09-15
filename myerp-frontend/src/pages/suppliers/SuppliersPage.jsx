import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../../api/suppliers';
import SupplierForm from './SupplierForm';

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState('');

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const data = await getSuppliers();
            setSuppliers(data);
            setError(null);
        } catch (err) {
            setError('Gagal memuat data supplier.');
            toast.error('Gagal memuat data supplier.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleOpenCreate = () => {
        setEditingSupplier(null);
        setShowForm(true);
    };

    const handleOpenEdit = (supplier) => {
        setEditingSupplier(supplier);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        if (submitting) return;
        setShowForm(false);
        setEditingSupplier(null);
    };

    const handleSubmit = async (formData) => {
        try {
            setSubmitting(true);
            if (editingSupplier) {
                await updateSupplier(editingSupplier.id, { ...formData, isActive: editingSupplier.isActive });
                toast.success('Supplier berhasil diperbarui!');
            } else {
                await createSupplier(formData);
                toast.success('Supplier berhasil ditambahkan!');
            }
            setShowForm(false);
            setEditingSupplier(null);
            await fetchSuppliers();
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal menyimpan supplier.';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (supplier) => {
        const result = await Swal.fire({
            title: 'Hapus supplier?',
            text: `Supplier "${supplier.name}" akan dihapus.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
        });

        if (!result.isConfirmed) return;

        try {
            await deleteSupplier(supplier.id);
            toast.success('Supplier berhasil dihapus!');
            await fetchSuppliers();
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal menghapus supplier.';
            toast.error(message);
        }
    };

    const filteredSuppliers = suppliers.filter((supplier) => {
        const keyword = search.toLowerCase();
        return (
            supplier.name?.toLowerCase().includes(keyword) ||
            supplier.city?.toLowerCase().includes(keyword) ||
            supplier.contactPerson?.toLowerCase().includes(keyword)
        );
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Master Supplier</h1>
                <button onClick={handleOpenCreate} className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Tambah Supplier
                </button>
            </div>

            <div className="mb-4">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-9"
                        placeholder="Cari nama, kota, atau contact person..."
                    />
                </div>
            </div>

            {loading ? (
                <div className="card text-center text-gray-500">Memuat data...</div>
            ) : error ? (
                <div className="card text-center text-red-600">{error}</div>
            ) : filteredSuppliers.length === 0 ? (
                <div className="card text-center text-gray-500">
                    {search ? 'Tidak ada supplier yang cocok.' : 'Belum ada supplier. Klik "Tambah Supplier" untuk memulai.'}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kota</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSuppliers.map((supplier) => (
                                <tr key={supplier.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{supplier.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{supplier.contactPerson || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{supplier.phone || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{supplier.email || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{supplier.city || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenEdit(supplier)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(supplier)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <SupplierForm
                isOpen={showForm}
                onClose={handleCloseForm}
                onSubmit={handleSubmit}
                initialData={editingSupplier}
                loading={submitting}
            />
        </div>
    );
}