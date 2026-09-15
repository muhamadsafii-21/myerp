import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { formatRupiah } from '../../utils/formatCurrency';

const emptyItem = { productId: '', quantity: 1, unitPrice: 0 };

export default function PurchaseOrderForm({ isOpen, onClose, onSubmit, suppliers, products, loading }) {
    const [supplierId, setSupplierId] = useState('');
    const [items, setItems] = useState([{ ...emptyItem }]);

    useEffect(() => {
        if (isOpen) {
            setSupplierId('');
            setItems([{ ...emptyItem }]);
        }
    }, [isOpen]);

    const handleItemChange = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = value;

        if (field === 'productId') {
            const product = products.find((p) => p.id === parseInt(value));
            if (product) {
                updated[index].unitPrice = product.cost || 0;
            }
        }

        setItems(updated);
    };

    const handleAddItem = () => {
        setItems([...items, { ...emptyItem }]);
    };

    const handleRemoveItem = (index) => {
        if (items.length === 1) return;
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateSubtotal = (item) => {
        return (parseInt(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + calculateSubtotal(item), 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validItems = items.filter((item) => item.productId && item.quantity > 0);

        if (!supplierId) {
            return;
        }

        if (validItems.length === 0) {
            return;
        }

        onSubmit({
            supplierId: parseInt(supplierId),
            items: validItems.map((item) => ({
                productId: parseInt(item.productId),
                quantity: parseInt(item.quantity),
                unitPrice: parseFloat(item.unitPrice)
            }))
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Buat Purchase Order</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" type="button">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Supplier <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={supplierId}
                            onChange={(e) => setSupplierId(e.target.value)}
                            className="input-field"
                            required
                        >
                            <option value="">-- Pilih Supplier --</option>
                            {suppliers.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Daftar Produk <span className="text-red-500">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Baris
                            </button>
                        </div>

                        <div className="space-y-2">
                            {items.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                                    <div className="col-span-4">
                                        <select
                                            value={item.productId}
                                            onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                                            className="input-field"
                                            required
                                        >
                                            <option value="">-- Produk --</option>
                                            {products.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} ({p.sku})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                            className="input-field"
                                            min="1"
                                            placeholder="Qty"
                                            required
                                        />
                                    </div>

                                    <div className="col-span-3">
                                        <input
                                            type="number"
                                            value={item.unitPrice}
                                            onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                                            className="input-field"
                                            min="0"
                                            step="0.01"
                                            placeholder="Harga"
                                            required
                                        />
                                    </div>

                                    <div className="col-span-2 text-sm text-gray-700 font-medium pb-2">
                                        {formatRupiah(calculateSubtotal(item))}
                                    </div>

                                    <div className="col-span-1 flex justify-end pb-2">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(index)}
                                            disabled={items.length === 1}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Total Amount</span>
                        <span className="text-lg font-bold text-blue-600">{formatRupiah(calculateTotal())}</span>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary disabled:opacity-50"
                        >
                            {loading ? 'Menyimpan...' : 'Simpan PO'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}