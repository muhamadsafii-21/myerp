import { ArrowDown, ArrowUp } from 'lucide-react';
import { formatRupiah } from '../../utils/formatCurrency';

export default function RecentActivity({ activities }) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Aktivitas Terakhir</h2>

            {!activities || activities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Belum ada aktivitas.</p>
            ) : (
                <div className="space-y-3">
                    {activities.map((activity, index) => {
                        const isPurchase = activity.type === 'PO';
                        return (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <div className={`p-2 rounded-lg ${isPurchase ? 'bg-orange-100' : 'bg-green-100'}`}>
                                    {isPurchase ? (
                                        <ArrowDown className="w-4 h-4 text-orange-600" />
                                    ) : (
                                        <ArrowUp className="w-4 h-4 text-green-600" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                        {activity.reference}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {activity.partyName} •{' '}
                                        {new Date(activity.date).toLocaleDateString('id-ID')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-bold ${isPurchase ? 'text-orange-600' : 'text-green-600'}`}>
                                        {isPurchase ? '-' : '+'}
                                        {formatRupiah(activity.amount)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}