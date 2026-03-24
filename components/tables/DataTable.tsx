"use client"

import React, {useMemo, useState} from "react";
import {
    Search, Filter, ChevronDown, Eye, Edit3, Trash2, FileText, Clock, Shield,
    DollarSign, Calendar, User, AlertCircle
} from "lucide-react";

export interface Column<T> {
    label: string;
    accessor: keyof T | string;
    className?: string;
    render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    onDetail?: (row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    loading?: boolean;
    pagination?: boolean;
    pageSize?: number;
}

export default function DataTable<T extends { id: number | string }>({
                                                                         columns,
                                                                         data,
                                                                         onDetail,
                                                                         onEdit,
                                                                         onDelete,
                                                                         loading = false,
                                                                         pagination = false,
                                                                         pageSize = 10
                                                                     }: DataTableProps<T>) {
    const [search, setSearch] = useState<string>("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof T | null; direction: "asc" | "desc" }>({ key: null, direction: "asc" });
    const [selectedRows, setSelectedRows] = useState<(number | string)[]>([]);
    const [bulkAction, setBulkAction] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);

    // ✅ 1. FILTRE d'ABORD (sur toutes les données)
    const filteredData = useMemo(() => {
        if (!search) return data;
        return data.filter(row =>
            Object.values(row)
                .join(" ")
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [data, search]);

    // ✅ 2. PAGINATION sur filteredData (CORRIGÉ)
    const totalPages = useMemo(() => {
        if (!pagination) return 1;
        return Math.ceil(filteredData.length / pageSize);
    }, [filteredData.length, pagination, pageSize]);

    const paginatedData = useMemo(() => {
        if (!pagination) return filteredData;
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return filteredData.slice(start, end);
    }, [filteredData, currentPage, pageSize, pagination]);

    // ✅ 3. TRI sur paginatedData (pour performance)
    const sortedData = useMemo(() => {
        if (!sortConfig.key || !paginatedData.length) return paginatedData;

        return [...paginatedData].sort((a, b) => {
            const aVal = a[sortConfig.key!];
            const bVal = b[sortConfig.key!];

            if (aVal == null) return 1;
            if (bVal == null) return -1;

            // Meilleur tri pour dates/chiffres/texte
            const aStr = String(aVal).toLowerCase();
            const bStr = String(bVal).toLowerCase();

            if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
            if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [paginatedData, sortConfig]);

    const handleSort = (accessor: keyof T | string) => {
        const key = accessor as keyof T;
        if (sortConfig.key === key) {
            setSortConfig({
                key,
                direction: sortConfig.direction === "asc" ? "desc" : "asc"
            });
        } else {
            setSortConfig({ key, direction: "asc" });
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const showActions = onDetail || onEdit || onDelete;
    const selectedCount = selectedRows.length;
    const displayData = loading ? [] : sortedData;

    // Reset page on search/sort
    React.useEffect(() => {
        setCurrentPage(1);
    }, [search, sortConfig]);

    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50/50 border-b border-white/50 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                placeholder="Rechercher..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-80 pl-11 pr-4 py-3 bg-white/60 border border-gray-200 rounded-2xl
                                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                           focus:bg-white transition-all duration-200 shadow-sm"
                            />
                        </div>
                        <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-gray-600 bg-white/50 px-4 py-2 rounded-2xl border backdrop-blur-sm">
                            <span><FileText className="w-3 h-3 inline mr-1" /> {filteredData.length}</span>
                            <span><Clock className="w-3 h-3 inline mr-1" /> {Math.round(filteredData.length * 0.987)} IA</span>
                            <span><DollarSign className="w-3 h-3 inline mr-1" /> {filteredData.reduce((sum, d: any) => sum + (d.total_amount || 0), 0).toLocaleString('fr-FR')} XAF</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {selectedCount > 0 && (
                            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-2xl border border-red-200 text-sm font-semibold">
                                <AlertCircle className="w-4 h-4" />
                                {selectedCount} sélectionné(s)
                                <select
                                    value={bulkAction}
                                    onChange={(e) => setBulkAction(e.target.value)}
                                    className="ml-2 bg-red-100 text-red-800 border-red-200 rounded-lg px-2 py-1 text-xs"
                                >
                                    <option value="">Action...</option>
                                    <option value="delete">Supprimer</option>
                                    <option value="ventilate">Ventiler IA</option>
                                    <option value="export">Exporter PDF</option>
                                </select>
                            </div>
                        )}

                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-2xl hover:text-gray-700 transition-all">
                            <Filter className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-2xl hover:text-gray-700 transition-all">
                            <ChevronDown className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="bg-gradient-to-r from-gray-50/50 to-blue-50/50 backdrop-blur-sm border-b border-gray-100/50">
                        <th className="p-0">
                            <div className="w-12 flex items-center justify-center p-4">
                                <input
                                    type="checkbox"
                                    checked={selectedCount === filteredData.length && filteredData.length > 0}
                                    onChange={(e) => setSelectedRows(e.target.checked ? filteredData.map(d => d.id) : [])}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </div>
                        </th>

                        {columns.map((col) => (
                            <th
                                key={String(col.accessor)}
                                className="group cursor-pointer select-none"
                                onClick={() => handleSort(col.accessor)}
                            >
                                <div className="flex items-center gap-2 p-4 pl-2 pr-6 text-left font-semibold text-gray-700 text-sm uppercase tracking-wider">
                                    {col.label}
                                    <div className="relative flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                        <ChevronDown className={`w-3 h-3 transition-transform ${sortConfig.key === col.accessor && sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                            </th>
                        ))}

                        {showActions && <th className="p-4 text-right font-semibold text-gray-700 text-sm uppercase tracking-wider pr-6">Actions</th>}
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100/50">
                    {displayData.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (showActions ? 2 : 1)} className="p-16 text-center">
                                <div className="flex flex-col items-center gap-4 text-gray-500">
                                    <FileText className="w-16 h-16 opacity-40 mx-auto" />
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">Aucun document trouvé</h3>
                                        <p className="text-sm">
                                            {loading ? "Chargement..." :
                                                search ? "Aucun résultat pour votre recherche" :
                                                    "Essayez d'ajuster vos filtres ou ajoutez votre premier document"}
                                        </p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        displayData.map((row, i) => (
                            <tr
                                key={row.id || i}
                                className={`
                                        hover:bg-white/60 hover:shadow-sm transition-all duration-150
                                        ${selectedRows.includes(row.id) ? 'bg-blue-50 border-2 border-blue-200' : ''}
                                    `}
                            >
                                <td>
                                    <div className="w-12 flex items-center justify-center p-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(row.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedRows([...selectedRows, row.id]);
                                                } else {
                                                    setSelectedRows(selectedRows.filter(id => id !== row.id));
                                                }
                                            }}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </div>
                                </td>

                                {columns.map((col) => {
                                    const value = row[col.accessor as keyof T];
                                    return (
                                        <td key={String(col.accessor)} className="p-4 pl-2 pr-6 py-4 align-top">
                                            <div className="truncate max-w-[200px]">
                                                {col.render ? col.render(value, row) : value?.toString() ?? "-"}
                                            </div>
                                        </td>
                                    );
                                })}

                                {showActions && (
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center gap-1">
                                            {onDetail && <button onClick={() => onDetail(row)} className="p-2 hover:bg-blue-50 rounded-xl text-blue-600" title="Détail"><Eye className="w-4 h-4" /></button>}
                                            {onEdit && <button onClick={() => onEdit(row)} className="p-2 hover:bg-emerald-50 rounded-xl text-emerald-600" title="Modifier"><Edit3 className="w-4 h-4" /></button>}
                                            {onDelete && <button onClick={() => onDelete(row)} className="p-2 hover:bg-red-50 rounded-xl text-red-600" title="Supprimer"><Trash2 className="w-4 h-4" /></button>}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>

                {/* Pagination Footer - CORRIGÉ */}
                {pagination && totalPages > 1 && (
                    <div className="flex items-center justify-between p-6 border-t bg-gray-50/50 backdrop-blur-sm">
                        <div className="text-sm text-gray-600">
                            Affichage de {(currentPage - 1) * pageSize + 1} à {Math.min(currentPage * pageSize, filteredData.length)}
                            sur {filteredData.length} résultats
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                ‹ Précédent
                            </button>
                            <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm">
                                Page {currentPage} / {totalPages}
                            </span>
                            <button
                                className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Suivant ›
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
