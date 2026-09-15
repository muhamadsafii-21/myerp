import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../../api/customers';
import CustomerForm from './CustomerForm';


export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState('');

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const data = await getCustomers();
            setCustomers(data);
            setError(null);
        } catch (err) {
            setError('Gagal memuat data customer.');
            toast.error('Gagal memuat data customer.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleOpenCreate = () => {
        setEditingCustomer(null);
        setShowForm(true);
    };

    const handleOpenEdit = (customer) => {
        setEditingCustomer(customer);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        if (submitting) return;
        setShowForm(false);
        setEditingCustomer(null);
    };

    const handleSubmit = async (formData) => {
        try {
            setSubmitting(true);
            if (editingCustomer) {
                await updateCustomer(editingCustomer.id, { ...formData, isActive: editingCustomer.isActive });
                toast.success('Customer berhasil diperbarui!');
            } else {
                await createCustomer(formData);
                toast.success('Customer berhasil ditambahkan!');
            }
            setShowForm(false);
            setEditingCustomer(null);
            await fetchCustomers();
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal menyimpan customer.';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (customer) => {
        const result = await Swal.fire({
            title: 'Hapus customer?',
            text: `Customer "${customer.name}" akan dihapus.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
        });

        if (!result.isConfirmed) return;

        try {
            await deleteCustomer(customer.id);
            toast.success('Customer berhasil dihapus!');
            await fetchCustomers();
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal menghapus customer.';
            toast.error(message);
        }
    };

    const filteredCustomers = customers.filter((customer) => {
        const keyword = search.toLowerCase();
        return (
            customer.name?.toLowerCase().includes(keyword) ||
            customer.city?.toLowerCase().includes(keyword) ||
            customer.phone?.toLowerCase().includes(keyword)
        );
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Master Customer</h1>
                <button onClick={handleOpenCreate} className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Tambah Customer
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
                        placeholder="Cari nama, kota, atau phone..."
                    />
                </div>
            </div>

            {loading ? (
                <div className="card text-center text-gray-500">Memuat data...</div>
            ) : error ? (
                <div className="card text-center text-red-600">{error}</div>
            ) : filteredCustomers.length === 0 ? (
                <div className="card text-center text-gray-500">
                    {search ? 'Tidak ada customer yang cocok.' : 'Belum ada customer. Klik "Tambah Customer" untuk memulai.'}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kota</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{customer.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{customer.phone || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{customer.email || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{customer.city || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenEdit(customer)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(customer)}
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

            <CustomerForm
                isOpen={showForm}
                onClose={handleCloseForm}
                onSubmit={handleSubmit}
                initialData={editingCustomer}
                loading={submitting}
            />
        </div>
    );
}