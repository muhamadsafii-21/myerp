import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { getSalesOrders, createSalesOrder, completeSalesOrder, deleteSalesOrder } from '../../api/salesOrders';
import { getCustomers } from '../../api/customers';
import { getProducts } from '../../api/products';
import { formatRupiah } from '../../utils/formatCurrency';
import SalesOrderForm from './SalesOrderForm';

export default function SalesOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [filterStatus, setFilterStatus] = useState('All');
    const [detailOrder, setDetailOrder] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ordersData, customersData, productsData] = await Promise.all([
                getSalesOrders(),
                getCustomers(),
                getProducts()
            ]);
            setOrders(ordersData);
            setCustomers(customersData);
            setProducts(productsData);
            setError(null);
        } catch (err) {
            setError('Gagal memuat data.');
            toast.error('Gagal memuat data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenForm = () => {
        setShowForm(true);
    };

    const handleCloseForm = () => {
        if (submitting) return;
        setShowForm(false);
    };

    const handleSubmit = async (formData) => {
        try {
            setSubmitting(true);
            await createSalesOrder(formData);
            toast.success('Sales Order berhasil dibuat!');
            setShowForm(false);
            await fetchData();
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal membuat Sales Order.';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleComplete = async (order) => {
        const result = await Swal.fire({
            title: 'Selesaikan SO ini?',
            html: `SO <strong>${order.invoiceNumber}</strong> akan diselesaikan.<br/>Stok produk akan berkurang.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Selesaikan',
            cancelButtonText: 'Batal'
        });

        if (!result.isConfirmed) return;

        try {
            await completeSalesOrder(order.id);
            toast.success('SO berhasil diselesaikan. Stok telah diperbarui.');
            await fetchData();
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal menyelesaikan SO.';
            toast.error(message);
        }
    };

    const handleDelete = async (order) => {
        const result = await Swal.fire({
            title: 'Hapus SO ini?',
            text: `SO "${order.invoiceNumber}" akan dihapus.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
        });

        if (!result.isConfirmed) return;

        try {
            await deleteSalesOrder(order.id);
            toast.success('SO berhasil dihapus.');
            await fetchData();
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal menghapus SO.';
            toast.error(message);
        }
    };

    const filteredOrders = filterStatus === 'All'
        ? orders
        : orders.filter((o) => o.status === filterStatus);

    const getStatusBadge = (status) => {
        if (status === 'Completed') {
            return 'bg-green-100 text-green-800';
        }
        return 'bg-yellow-100 text-yellow-800';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Sales Orders</h1>
                <button onClick={handleOpenForm} className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Buat SO Baru
                </button>
            </div>

            <div className="mb-4 flex gap-2">
                {['All', 'Draft', 'Completed'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filterStatus === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="card text-center text-gray-500">Memuat data...</div>
            ) : error ? (
                <div className="card text-center text-red-600">{error}</div>
            ) : filteredOrders.length === 0 ? (
                <div className="card text-center text-gray-500">
                    Belum ada Sales Order. Klik "Buat SO Baru" untuk memulai.
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Invoice</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-mono font-medium text-gray-800">{order.invoiceNumber}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{order.customerName || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {new Date(order.orderDate).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-800 font-medium text-right">
                                        {formatRupiah(order.totalAmount)}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() => setDetailOrder(order)}
                                                className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                                                title="Detail"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {order.status === 'Draft' && (
                                                <>
                                                    <button
                                                        onClick={() => handleComplete(order)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                                                        title="Selesaikan"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(order)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <SalesOrderForm
                isOpen={showForm}
                onClose={handleCloseForm}
                onSubmit={handleSubmit}
                customers={customers}
                products={products}
                loading={submitting}
            />

            {detailOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">Detail SO</h2>
                            <button onClick={() => setDetailOrder(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">No. Invoice</p>
                                    <p className="font-medium">{detailOrder.invoiceNumber}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Customer</p>
                                    <p className="font-medium">{detailOrder.customerName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Tanggal</p>
                                    <p className="font-medium">{new Date(detailOrder.orderDate).toLocaleDateString('id-ID')}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Status</p>
                                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(detailOrder.status)}`}>
                                        {detailOrder.status}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-2">Items</h3>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">Produk</th>
                                            <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Qty</th>
                                            <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Harga</th>
                                            <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detailOrder.items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-2 py-2 text-sm">{item.productName}</td>
                                                <td className="px-2 py-2 text-sm text-right">{item.quantity}</td>
                                                <td className="px-2 py-2 text-sm text-right">{formatRupiah(item.unitPrice)}</td>
                                                <td className="px-2 py-2 text-sm text-right font-medium">{formatRupiah(item.subtotal)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="border-t pt-4 flex justify-between items-center">
                                <span className="font-medium text-gray-700">Total</span>
                                <span className="text-lg font-bold text-blue-600">{formatRupiah(detailOrder.totalAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}