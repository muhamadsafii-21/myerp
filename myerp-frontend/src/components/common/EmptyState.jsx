import { PackageOpen } from 'lucide-react';

export default function EmptyState({ icon: Icon = PackageOpen, title, description, action }) {
    return (
        <div className="card text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Icon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">{title}</h3>
            {description && (
                <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">{description}</p>
            )}
            {action}
        </div>
    );
}