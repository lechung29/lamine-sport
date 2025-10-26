/** @format */
import "./TableShimmer.scss";

interface ITableShimmer {
    rows?: number;
}
const ShimmerTableRow = () => {
    return (
        <tr className="border-b border-gray-100">
            <td className="!p-4">
                <div className="shimmer h-4 !rounded w-2/3"></div>
            </td>
            <td className="!p-4 hidden md:table-cell">
                <div className="shimmer h-4 !rounded w-2/3"></div>
            </td>
            <td className="!p-4">
                <div className="shimmer h-6 !rounded w-3/4"></div>
            </td>
            <td className="!p-4">
                <div className="shimmer h-4 !rounded w-1/2"></div>
            </td>
            <td className="!p-4 hidden md:table-cell">
                <div className="shimmer h-4 !rounded w-4/5 !mx-auto"></div>
            </td>
        </tr>
    );
};

const ShimmerTableHeader = () => {
    return (
        <thead>
            <tr className="text-left bg-gray-50 !border-b !border-gray-200">
                <th className="!p-4">
                    <div className="shimmer-header h-4 !rounded w-3/4"></div>
                </th>
                <th className="!p-4 hidden md:table-cell">
                    <div className="shimmer-header h-4 !rounded w-3/4"></div>
                </th>
                <th className="!p-4">
                    <div className="shimmer-header h-4 !rounded w-3/4"></div>
                </th>
                <th className="!p-4">
                    <div className="shimmer-header h-4 !rounded w-3/4"></div>
                </th>
                <th className="!p-4 hidden md:table-cell">
                    <div className="shimmer-header h-4 !rounded w-full"></div>
                </th>
            </tr>
        </thead>
    );
};

const ShimmerTableBody = (rows: number) => {
    return (
        <tbody>
            {Array.from({ length: rows }).map((_, index) => (
                <ShimmerTableRow key={index} />
            ))}
        </tbody>
    );
};

const TableShimmer: React.FunctionComponent<ITableShimmer> = (props) => {
    const { rows = 5 } = props;
    return (
        <>
            {ShimmerTableHeader()}
            {ShimmerTableBody(rows)}
        </>
    );
};

export { TableShimmer };
