import React, { useMemo } from "react";

export type OperationDetail = {
    id?: string;
    productName: string;
    date: string | Date;
    pieces: number;
    ratePerPiece: number;
    total?: number;
};

type Props = {
    open: boolean;
    onClose: () => void;
    workerName?: string;
    // only the two operations you want shown need to be passed in;
    // component will show the first two items if more are provided
    operations?: OperationDetail[];
};

const fmtCurrency = (n: number) =>
    n.toLocaleString(undefined, { style: "currency", currency: "INR", maximumFractionDigits: 2 });

const fmtDate = (d?: string | Date) => {
    if (!d) return "-";
    const dt = typeof d === "string" ? new Date(d) : d;
    return dt.toLocaleDateString();
};

export const WorkerOperationDetailDialog: React.FC<Props> = ({ open, onClose, workerName, operations = [] }) => {
    const opsToShow = useMemo(() => operations.slice(0, 2), [operations]);

    const grandTotal = useMemo(() => {
        return opsToShow.reduce((sum, op) => {
            const tot = typeof op.total === "number" ? op.total : op.pieces * op.ratePerPiece;
            return sum + tot;
        }, 0);
    }, [opsToShow]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Worker operation details"
        >
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />
            <div className="relative z-10 w-full max-w-2xl rounded-md bg-white p-6 shadow-lg dark:bg-slate-800">
                <header className="mb-4 flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">
                            Operation details {workerName ? `– ${workerName}` : ""}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Showing up to two operation entries for the selected worker
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="ml-4 rounded p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        ✕
                    </button>
                </header>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] table-auto">
                        <thead>
                            <tr className="text-left text-sm text-slate-600 dark:text-slate-300">
                                <th className="px-3 py-2">Product</th>
                                <th className="px-3 py-2">Date</th>
                                <th className="px-3 py-2 text-right">Pieces</th>
                                <th className="px-3 py-2 text-right">Rate / piece</th>
                                <th className="px-3 py-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {opsToShow.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-3 py-6 text-center text-sm text-slate-500">
                                        No operations to display
                                    </td>
                                </tr>
                            ) : (
                                opsToShow.map((op, i) => {
                                    const total = typeof op.total === "number" ? op.total : op.pieces * op.ratePerPiece;
                                    return (
                                        <tr key={op.id ?? i} className="border-t">
                                            <td className="px-3 py-3 align-top">{op.productName}</td>
                                            <td className="px-3 py-3 align-top">{fmtDate(op.date)}</td>
                                            <td className="px-3 py-3 align-top text-right">{op.pieces}</td>
                                            <td className="px-3 py-3 align-top text-right">{fmtCurrency(op.ratePerPiece)}</td>
                                            <td className="px-3 py-3 align-top text-right">{fmtCurrency(total)}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                        {opsToShow.length > 0 && (
                            <tfoot>
                                <tr className="border-t">
                                    <td colSpan={4} className="px-3 py-3 text-right font-semibold">
                                        Grand total
                                    </td>
                                    <td className="px-3 py-3 text-right font-semibold">{fmtCurrency(grandTotal)}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-md bg-slate-100 px-4 py-2 text-sm text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkerOperationDetailDialog;