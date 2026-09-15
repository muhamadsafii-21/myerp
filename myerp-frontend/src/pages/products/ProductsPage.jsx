import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/products';
import { formatRupiah } from '../../utils/formatCurrency';
import ProductForm from './ProductForm';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
            setError(null);
        } catch (err) {
            setError('Gagal memuat data produk.');
            toast.error('Gagal memuat data produk.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleOpenCreate = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    const handleOpenEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        if (submitting) return;
        setShowForm(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (formData) => {
        try {
            setSubmitting(true);
            if (editingProduct) {
                await updateProduct(editingProduct.id, { ...formData, isActive: editingProduct.isActive });
                toast.success('Produk berhasil diperbarui!');
            } else {
                await createProduct(formData);
                toast.success('Produk berhasil ditambahkan!');
            }
            setShowForm(false);
            setEditingProduct(null);
            await fetchProducts();
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal menyimpan produk.';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (product) => {
        const result = await Swal.fire({
            title: 'Hapus produk?',
            text: `Produk "${product.name}" akan dihapus.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
        });

        if (!result.isConfirmed) return;

        try {
            await deleteProduct(product.id);
            toast.success('Produk berhasil dihapus!');
            await fetchProducts();
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal menghapus produk.';
            toast.error(message);
        }
    };

    const getStockClass = (product) => {
        if (product.stock <= product.stockMinimum) {
            return 'text-red-600 font-semibold';
        }
        return 'text-gray-700';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Master Produk</h1>
                <button onClick={handleOpenCreate} className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Tambah Produk
                </button>
            </div>

            {loading ? (
                <div className="card text-center text-gray-500">Memuat data...</div>
            ) : error ? (
                <div className="card text-center text-red-600">{error}</div>
            ) : products.length === 0 ? (
                <div className="card text-center text-gray-500">
                    Belum ada produk. Klik "Tambah Produk" untuk memulai.
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga Beli</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga Jual</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stok</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Min</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">{product.sku}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{product.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{product.unit || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 text-right">{formatRupiah(product.cost)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 text-right">{formatRupiah(product.price)}</td>
                                    <td className={`px-4 py-3 text-sm text-right ${getStockClass(product)}`}>{product.stock}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 text-right">{product.stockMinimum}</td>
                                    <td className="px-4 py-3 text-sm text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenEdit(product)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product)}
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

            <ProductForm
                isOpen={showForm}
                onClose={handleCloseForm}
                onSubmit={handleSubmit}
                initialData={editingProduct}
                loading={submitting}
            />
        </div>
    );
}