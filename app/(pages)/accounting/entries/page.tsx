"use client";

import React, { useState, useEffect, useCallback } from "react";
import DataTable from "@/components/tables/DataTable";
import Link from "next/link";
import { api } from "@/services/api";
import {
    FileText, Calendar, ShieldCheck, Zap, CreditCard, Filter,
    Download, Plus, Search, TrendingUp, Award, ShieldAlert
} from "lucide-react";
import {Entry, StatusType} from "../../../../types/types";

type StatusColor = 'gray' | 'orange' | 'emerald' | 'blue';
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
interface Column<T> {
    label: string;
    accessor: keyof T | string;
    className?: string;
    render?: (value: any, row: T) => React.ReactNode;
}
const columns: Column<Entry>[] = [
    {
        label: "Date",
        accessor: "date",
        className: "font-mono text-sm font-semibold w-28",
        render: (value?: string) =>
            value ? new Date(value).toLocaleDateString('fr-FR') : '-'
    },
    {
        label: "Compte",
        accessor: "account",
        className: "font-mono font-semibold w-32",
        render: (value?: string) =>
            value ? `6${value.padStart(4, '0')}` : '-'
    },
    {
        label: "Libellé",
        accessor: "label",
        className: "max-w-[250px] truncate"
    },
    {
        label: "Débit XAF",
        accessor: "debit",
        className: "text-right font-mono text-emerald-600 font-bold w-32",
        render: (value?: number | string) =>
            value ? Number(value).toLocaleString('fr-FR') : '-'
    },
    {
        label: "Crédit XAF",
        accessor: "credit",
        className: "text-right font-mono text-red-600 font-bold w-32",
        render: (value?: number | string) =>
            value ? Number(value).toLocaleString('fr-FR') : '-'
    },
    {
        label: "Statut",
        accessor: "status",
        className: "w-28",
        render: (value: StatusType) => {
            type StatusColor = 'gray' | 'orange' | 'emerald' | 'blue';  // ✅ Union des couleurs

            const statusMap: Record<StatusType, { label: string; color: StatusColor }> = {
                draft: { label: 'Brouillon', color: 'gray' },
                pending: { label: 'En attente', color: 'orange' },
                validated: { label: 'Validée', color: 'emerald' },
                paid: { label: 'Payée', color: 'blue' }
            };

            const colorClasses: Record<StatusColor, string> = {  // ✅ Record avec union
                gray: "bg-gray-100 text-gray-800",
                orange: "bg-orange-100 text-orange-800",
                emerald: "bg-emerald-100 text-emerald-800",
                blue: "bg-blue-100 text-blue-800",
            };

            const status = statusMap[value] ?? statusMap.draft;

            return (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${colorClasses[status.color]}`}>
            {status.label}
        </span>
            );
        }
    },
    {
        label: "",
        accessor: "actions",
        className: "w-24 text-right",
        render: (_: any, row: Entry) => (
            <div className="flex items-center gap-2">
                <Link href={`/accounting/entries/${row.id}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    ✏️
                </Link>
                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all">
                    ✅
                </button>
            </div>
        )
    }
];

export default function AccountingEntriesPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [stats, setStats] = useState({
        total_entries: 0,
        total_debit: 0,
        total_credit: 0,
        pending_count: 0
    });
    const [filters, setFilters] = useState({
        date_from: "",
        date_to: "",
        account: "",
        status: "",
        search: ""
    });

    // Fetch data
    useEffect(() => {
        fetchEntries();
    }, [filters]);

    const fetchEntries = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const res = await api.get(`accounting/entries?${params}`);
            setData(res.data.data || []);
            setStats(res.data.stats || stats);
        } catch (err:any) {
            setError("Erreur chargement écritures");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filters, stats]);

    const accounts = [
        { value: "", label: "Tous comptes" },
        { value: "5121", label: "Banque CC 5121" },
        { value: "531", label: "Caisse 531" },
        { value: "401", label: "Fournisseurs 401" },
        { value: "411", label: "Clients 411" },
        { value: "707", label: "Ventes 707" },
        { value: "607", label: "Achats 607" }
    ];

    const statuses = [
        { value: "", label: "Tous statuts" },
        { value: "draft", label: "Brouillon" },
        { value: "pending", label: "En attente" },
        { value: "validated", label: "Validée" },
        { value: "paid", label: "Payée" }
    ];

    const formatCurrency = (amount:number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8 bg-gradient-to-br from-slate-50/50 to-emerald-50/20">

            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-8 lg:p-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-gradient-to-br from-emerald-500 via-emerald-600 to-blue-600 rounded-3xl shadow-2xl">
                            <FileText className="w-9 h-9 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-emerald-800 bg-clip-text text-transparent mb-2">
                                Écritures Comptables
                            </h1>
                            <p className="text-xl text-gray-600 font-light">
                                OHADA • Gestion complète • XAF 2026
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        >
                            <Download className="w-4 h-4" />
                            Excel
                        </button>
                        <Link
                            href="/accounting/entries/new"
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600
                                       text-white font-bold rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] hover:-translate-y-1
                                       transition-all duration-300 backdrop-blur-sm"
                        >
                            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Nouvelle écriture
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 p-6 shadow-xl hover:shadow-2xl transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-emerald-100 rounded-2xl group-hover:bg-emerald-200 transition-colors">
                            <FileText className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="text-3xl font-black text-emerald-600">
                            {stats.total_entries?.toLocaleString() || 0}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Total écritures</p>
                </div>

                <div className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 p-6 shadow-xl hover:shadow-2xl transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition-colors">
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-3xl font-black text-blue-600">
                            {formatCurrency(stats.total_debit)}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Débit total</p>
                </div>

                <div className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 p-6 shadow-xl hover:shadow-2xl transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-red-100 rounded-2xl group-hover:bg-red-200 transition-colors">
                            <CreditCard className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="text-3xl font-black text-red-600">
                            {formatCurrency(stats.total_credit)}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Crédit total</p>
                </div>

                <div className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 p-6 shadow-xl hover:shadow-2xl transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-orange-100 rounded-2xl group-hover:bg-orange-200 transition-colors">
                            <ShieldCheck className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="text-3xl font-black text-orange-600">
                            {stats.pending_count || 0}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">En attente</p>
                </div>
            </div>

            {/* Filters Pro */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6 items-end">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher libellé, compte..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm font-medium"
                        />
                    </div>
                    <input
                        type="date"
                        value={filters.date_from}
                        onChange={(e) => setFilters(prev => ({ ...prev, date_from: e.target.value }))}
                        className="px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white shadow-sm"
                    />
                    <input
                        type="date"
                        value={filters.date_to}
                        onChange={(e) => setFilters(prev => ({ ...prev, date_to: e.target.value }))}
                        className="px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white shadow-sm"
                    />
                    <select
                        value={filters.account}
                        onChange={(e) => setFilters(prev => ({ ...prev, account: e.target.value }))}
                        className="px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white shadow-sm"
                    >
                        {accounts.map(a => (
                            <option key={a.value} value={a.value}>{a.label}</option>
                        ))}
                    </select>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 bg-white shadow-sm"
                    >
                        {statuses.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-gray-100/50 bg-gradient-to-r from-emerald-50 to-blue-50/50">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <ShieldCheck className="w-8 h-8 text-emerald-600" />
                            Liste des écritures OHADA
                        </h2>
                        <span className="text-sm text-gray-500 font-medium bg-white/60 px-4 py-2 rounded-xl">
                            {data.length} écritures • Maj temps réel
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 flex items-center justify-center">
                        <div className="animate-spin rounded-2xl h-16 w-16 border-b-2 border-emerald-600 mx-auto" />
                    </div>
                ) : error ? (
                    <div className="p-20 text-center py-20">
                        <ShieldAlert className="w-20 h-20 text-red-400 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{error}</h3>
                        <button
                            onClick={fetchEntries}
                            className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-semibold hover:bg-emerald-700 transition-all"
                        >
                            Réessayer
                        </button>
                    </div>
                ) : data.length === 0 ? (
                    <div className="p-20 text-center">
                        <FileText className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Aucune écriture</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Commencez par créer votre première écriture comptable
                        </p>
                        <Link
                            href="/accounting/entries/new"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600
                                       text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Créer première écriture
                        </Link>
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
                           // stickyHeader
                        />
                    </div>
                )}
            </div>

            {/* OHADA Footer */}
            <div className="bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5 backdrop-blur-sm border border-emerald-200/30 rounded-3xl p-8 text-center">
                <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/30">
                        <Award className="w-4 h-4" />
                        <span className="font-semibold text-emerald-800">OHADA Uniforme 2026</span>
                    </div>
                    <div className="text-xs text-gray-700">
                        Plan comptable XAF • Conservation 10 ans • Art. 123 OHADA
                    </div>
                </div>
            </div>
        </div>
    );
}
