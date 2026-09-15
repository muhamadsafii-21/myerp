export default function TableSkeleton({ rows = 5, columns = 5 }) {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
                <thead className="bg-gray-50">
                    <tr>
                        {Array.from({ length: columns }).map((_, i) => (
                            <th key={i} className="px-4 py-3">
                                <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {Array.from({ length: rows }).map((_, i) => (
                        <tr key={i}>
                            {Array.from({ length: columns }).map((_, j) => (
                                <td key={j} className="px-4 py-3">
                                    <div
                                        className="h-3 bg-gray-100 rounded animate-pulse"
                                        style={{ width: `${40 + Math.random() * 40}%` }}
                                    ></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}