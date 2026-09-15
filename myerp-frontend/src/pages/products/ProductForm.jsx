import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const emptyForm = {
    name: '',
    description: '',
    unit: 'PCS',
    stock: 0,
    stockMinimum: 0,
    cost: 0,
    price: 0
};

export default function ProductForm({ isOpen, onClose, onSubmit, initialData, loading }) {
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || '',
                description: initialData.description || '',
                unit: initialData.unit || 'PCS',
                stock: initialData.stock || 0,
                stockMinimum: initialData.stockMinimum || 0,
                cost: initialData.cost || 0,
                price: initialData.price || 0
            });
        } else {
            setForm(emptyForm);
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            name: form.name,
            description: form.description,
            unit: form.unit,
            stock: parseInt(form.stock) || 0,
            stockMinimum: parseInt(form.stockMinimum) || 0,
            cost: parseFloat(form.cost) || 0,
            price: parseFloat(form.price) || 0
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">
                        {initialData ? 'Edit Produk' : 'Tambah Produk'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        type="button"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Produk <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Contoh: Keyboard Mechanical"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deskripsi
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="input-field"
                            rows="2"
                            placeholder="Deskripsi produk (opsional)"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Unit
                            </label>
                            <select
                                name="unit"
                                value={form.unit}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="PCS">PCS</option>
                                <option value="BOX">BOX</option>
                                <option value="UNIT">UNIT</option>
                                <option value="KG">KG</option>
                                <option value="LITER">LITER</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stok Minimum
                            </label>
                            <input
                                type="number"
                                name="stockMinimum"
                                value={form.stockMinimum}
                                onChange={handleChange}
                                className="input-field"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Harga Beli
                            </label>
                            <input
                                type="number"
                                name="cost"
                                value={form.cost}
                                onChange={handleChange}
                                className="input-field"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Harga Jual
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                className="input-field"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stok Awal
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={form.stock}
                                onChange={handleChange}
                                className="input-field"
                                min="0"
                                disabled={!!initialData}
                            />
                            {initialData && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Stok tidak bisa diubah. Gunakan modul Purchase Order.
                                </p>
                            )}
                        </div>
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
                            {loading ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}