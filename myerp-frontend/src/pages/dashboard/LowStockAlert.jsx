import { AlertTriangle } from 'lucide-react';

export default function LowStockAlert({ products }) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-bold text-gray-800">Stok Menipis</h2>
            </div>

            {!products || products.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Semua stok aman. 👍</p>
            ) : (
                <div className="space-y-3">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg"
                        >
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">{product.name}</p>
                                <p className="text-xs text-gray-500 font-mono">{product.sku}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-red-600">
                                    {product.stock} / {product.stockMinimum}
                                </p>
                                <p className="text-xs text-gray-500">stok / min</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}