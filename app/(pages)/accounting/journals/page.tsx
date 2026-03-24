"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/tables/DataTable";
import Link from "next/link";
import {
    FileText, Calendar, BookOpen, TrendingUp, CreditCard,
    ShieldCheck, Zap, Award, Download, Filter, Search
} from "lucide-react";
import {api} from "../../../../services/api";
import {StatusType} from "../../../../types/types";

interface Accounts {
    debit?: string;
    credit?: string;
}

interface Entry {
    date: string;
    id:number;
    piece_number?: string;
    journal?: string;
    label?: string;
    accounts?: Accounts;
    debit?: number | string;
    credit?: number | string;
    balance?: number | string;
}


interface Column<T> {
    label: string;
    accessor: keyof T | string;
    className?: string;
    render?: (value: any, row: T) => React.ReactNode;
}
export type StatusColor = 'gray' | 'orange' | 'emerald' | 'blue';
const statusMap: Record<StatusType, { label: string; color: StatusColor }> = {
    draft: { label: 'Brouillon', color: 'gray' },
    pending: { label: 'En attente', color: 'orange' },
    validated: { label: 'Validée', color: 'emerald' },
    paid: { label: 'Payée', color: 'blue' }
};

const colorClasses: Record<StatusColor, string> = {
    gray: "bg-gray-100 text-gray-800",
    orange: "bg-orange-100 text-orange-800",
    emerald: "bg-emerald-100 text-emerald-800",
    blue: "bg-blue-100 text-blue-800",
};

export const columns: Column<Entry>[] = [
    {
        label: "Date",
        accessor: "date",
        className: "font-mono text-sm font-semibold",
        render: (value?: string) =>
            value ? new Date(value).toLocaleDateString('fr-FR') : "-"
    },
    {
        label: "N° Pièce",
        accessor: "piece_number",
        className: "font-mono text-xs"
    },
    {
        label: "Journal",
        accessor: "journal",
        className: "font-medium"
    },
    {
        label: "Libellé",
        accessor: "label",
        className: "max-w-[200px]"
    },
    {
        label: "Comptes",
        accessor: "accounts",
        render: (value?: Accounts) =>
            value ? `${value.debit ?? "-"} / ${value.credit ?? "-"}` : "-"
    },
    {
        label: "Débit",
        accessor: "debit",
        className: "text-right font-mono text-emerald-600 font-bold",
        render: (value?: number | string) =>
            value ? Number(value).toLocaleString('fr-FR') + " XAF" : "-"
    },
    {
        label: "Crédit",
        accessor: "credit",
        className: "text-right font-mono text-red-600 font-bold",
        render: (value?: number | string) =>
            value ? Number(value).toLocaleString('fr-FR') + " XAF" : "-"
    },
    {
        label: "Solde",
        accessor: "balance",
        className: "text-right font-mono font-bold",
        render: (value?: number | string) => {
            const num = Number(value ?? 0);
            const formatted = num.toLocaleString('fr-FR') + " XAF";
            return num >= 0
                ? <span className="text-emerald-600">{formatted}</span>
                : <span className="text-red-600">{formatted}</span>;
        }
    },
    {
        label: "Statut",
        accessor: "status",
        className: "w-28",
        render: (value: StatusType) => {
            const status = statusMap[value] ?? statusMap.draft;
            return (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${colorClasses[status.color]}`}>
                    {status.label}
                </span>
            );
        }
    },
    {
        label: "Actions",
        accessor: "actions",
        className: "w-24 text-right",
        render: (_: any, row: Entry) => (
            <div className="flex items-center gap-2">
                <Link
                    href={`/accounting/entries/${row.id}/edit`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                    ✏️
                </Link>
                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all">
                    ✅
                </button>
            </div>
        )
    }
];

export default function AccountingPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [stats, setStats] = useState({
        total_entries: 0,
        total_debit: 0,
        total_credit: 0,
        current_month: 0
    });
    const [filters, setFilters] = useState({
        date_from: "",
        date_to: "",
        journal: "",
        search: ""
    });

    // Fetch data côté client
    useEffect(() => {
        fetchAccountingData();
    }, [filters]);

    const fetchAccountingData = async () => {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams();
            if (filters.date_from) params.append("date_from", filters.date_from);
            if (filters.date_to) params.append("date_to", filters.date_to);
            if (filters.journal) params.append("journal", filters.journal);
            if (filters.search) params.append("search", filters.search);

            const res = await api.get(`accounting/entries?${params}`);
            setData(res.data.data || []);
            setStats(res.data.stats || stats);
        } catch (err) {
            setError("Erreur chargement écritures comptables");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const journals = [
        { value: "", label: "Tous journaux" },
        { value: "ACH", label: "Achats" },
        { value: "VEN", label: "Ventes" },
        { value: "BAN", label: "Banque" },
        { value: "OD", label: "Opérations Diverses" },
        { value: "SAL", label: "Salaires" }
    ];

    const formatCurrency = (amount:number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    const exportExcel = () => {
        // Logique export Excel
        console.log("Export Excel déclenché");
    };

    return (
        <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8 bg-gradient-to-br from-slate-50/50 to-emerald-50/20">

            {/* Header Premium */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-8 lg:p-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-6 flex-1">
                        <div className="p-4 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-xl">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-emerald-800 bg-clip-text text-transparent mb-2">
                                Journal Comptable
                            </h1>
                            <p className="text-xl text-gray-600 font-light">
                                OHADA • Temps réel • XAF 2026
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                        <button
                            onClick={exportExcel}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        >
                            <Download className="w-4 h-4" />
                            Excel
                        </button>
                        <Link href="/accounting/new-entry" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all">
                            Nouvelle écriture
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 p-6 shadow-xl hover:shadow-2xl transition-all group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <FileText className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="text-2xl font-black text-emerald-600">
                            {stats.total_entries?.toLocaleString()}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Écritures totales</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 p-6 shadow-xl hover:shadow-2xl transition-all group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-2xl font-black text-blue-600">
                            {formatCurrency(stats.total_debit)}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Débit total</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 p-6 shadow-xl hover:shadow-2xl transition-all group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-red-100 rounded-xl">
                            <CreditCard className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="text-2xl font-black text-red-600">
                            {formatCurrency(stats.total_credit)}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Crédit total</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 p-6 shadow-xl hover:shadow-2xl transition-all group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-purple-100 rounded-xl">
                            <Calendar className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="text-2xl font-black text-purple-600">
                            {stats.current_month}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Ce mois</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher libellé, compte..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50"
                        />
                    </div>
                    <input
                        type="date"
                        value={filters.date_from}
                        onChange={(e) => setFilters(prev => ({ ...prev, date_from: e.target.value }))}
                        className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/50"
                    />
                    <input
                        type="date"
                        value={filters.date_to}
                        onChange={(e) => setFilters(prev => ({ ...prev, date_to: e.target.value }))}
                        className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/50"
                    />
                    <select
                        value={filters.journal}
                        onChange={(e) => setFilters(prev => ({ ...prev, journal: e.target.value }))}
                        className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50"
                    >
                        {journals.map(j => (
                            <option key={j.value} value={j.value}>{j.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
                <div className="p-6 lg:p-8 border-b border-gray-100/50 bg-gradient-to-r from-emerald-50 to-blue-50/50">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <ShieldCheck className="w-7 h-7 text-emerald-600" />
                            Écritures comptables OHADA
                        </h2>
                        <span className="text-sm text-gray-500 font-medium">
                            {data.length} écritures • Tri date ↓
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 flex items-center justify-center">
                        <div className="animate-spin rounded-xl h-12 w-12 border-b-2 border-emerald-600" />
                    </div>
                ) : error ? (
                    <div className="p-20 text-center text-red-600">
                        {error}
                    </div>
                ) : data.length === 0 ? (
                    <div className="p-20 text-center">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-xl text-gray-500">Aucune écriture comptable</p>
                        <p className="text-gray-400 mt-2">Commencez par uploader vos factures</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <DataTable
                            columns={columns}
                            data={data}
                            loading={loading}
                            pagination
                            pageSize={25}
                            //className="min-w-full"
                        />
                    </div>
                )}
            </div>

            {/* Footer OHADA */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-sm border border-emerald-200/50 rounded-2xl p-6 text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                        <Award className="w-4 h-4" />
                        OHADA 2026 • XAF • RCCM Ready
                    </div>
                    <div className="w-px h-6 bg-emerald-200 hidden sm:block" />
                    <div className="text-xs text-gray-600">
                        Journal légal • Conservation 10 ans • Art. R123-22 [web:82]
                    </div>
                </div>
            </div>
        </div>
    );
}
