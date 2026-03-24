'use client'
import React, {useEffect, useState} from "react";
import DataTable from "../../../components/tables/DataTable";
import Link from "next/link"
import {api} from "../../../services/api";
import {DocumentExtraction, } from "../../../types/types";
import {useRouter} from "next/navigation";
import {BarChart3, Calendar, Clock, FileText, Shield} from "lucide-react";


export default function DocumentPage() {
    const [documents, setDocuments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const columns = [
        { label: "Fournisseur", accessor: "supplier" },
        { label: "Date", accessor: "date" },
        { label: "Montant", accessor: "amount" },
        { label: "Statut", accessor: "status" }
    ]

    useEffect(() => {
        async function fetchDocuments() {
            try {
                const res = await api.get<any>('documents')

                console.log(res.data.data)
                // 🔥 mapping backend → UI
                const mapped = res.data.data.map((item: any) => ({
                    id: item.id,
                    document_id: item.document_id,
                    supplier: item.supplier_name || "-",
                    date: item.invoice_date || "-",
                    amount: item.formatted_amount || "-",
                    status: item.is_valid ? "Analysé" : "À vérifier"
                }))

                setDocuments(mapped)

            } catch (err: any) {
                console.error('Erreur API :', err.response?.data || err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchDocuments()
    }, [])

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-6 lg:p-8">

            {/* Header Premium */}
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    {/* Left Content */}
                    <div className="flex items-start lg:items-center gap-4 flex-1">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl shadow-lg">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-emerald-800 bg-clip-text text-transparent leading-tight">
                                Documents Comptables
                            </h1>
                            <p className="text-lg text-gray-600 font-light mt-1 max-w-lg">
                                Gérez, analysez et ventilez vos factures avec l'IA -
                                <span className="font-semibold text-emerald-600"> 1 284 documents traités</span>
                            </p>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex flex-wrap gap-3 bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-2xl border border-emerald-100">
                        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-100 px-4 py-2 rounded-xl">
                            <Shield className="w-4 h-4" />
                            98,7% IA
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-100 px-4 py-2 rounded-xl">
                            <Clock className="w-4 h-4" />
                            Moy: 12s/doc
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-purple-700 bg-purple-100 px-4 py-2 rounded-xl">
                            <BarChart3 className="w-4 h-4" />
                            2,4M XAF ventilés
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 flex-1 lg:flex-none justify-end">
                        <button className="px-6 py-3 text-sm font-semibold text-gray-700 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md">
                            Filtres
                        </button>
                        <Link
                            href="/documents/upload"
                            className="group relative bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-[1.02] transform transition-all duration-300 flex items-center gap-2"
                        >
                            <FileText className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Nouveau document
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Filters */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl p-6 border border-white/50 shadow-lg">
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white px-4 py-2 rounded-xl border shadow-sm">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        Ce mois (23)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-xl border backdrop-blur-sm hover:bg-white transition-all">
                        Non ventilés (4)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-xl border backdrop-blur-sm hover:bg-white transition-all">
                        MTN Mobile Money (12)
                    </div>
                    <div className="flex-1" />
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Trier par:</span>
                        <select className="text-sm bg-white px-3 py-1.5 rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>Date récente</option>
                            <option>Montant</option>
                            <option>Fournisseur</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
                <div className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="flex flex-col items-center gap-4">
                                <div className="animate-spin rounded-2xl h-12 w-12 bg-gradient-to-r from-blue-500 to-emerald-500" />
                                <div>
                                    <p className="text-lg font-semibold text-gray-700">Chargement des documents...</p>
                                    <p className="text-sm text-gray-500 mt-1">Analyse IA en cours</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={documents}
                            onDetail={(doc:any) => router.push(`/documents/${doc.document_id}`)}
                            onEdit={(doc:any) => router.push(`/documents/${doc.id}/edit`)}
                            onDelete={(doc:any) => console.log("Delete", doc.id)}
                        loading={false}
                        pagination={true}
                        pageSize={5}
                        //className="shadow-lg"
                        //stickyHeader={true}
                        />
                    )}
                </div>
            </div>

            {/* Bottom Stats */}
            {!loading && documents.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-2xl border border-emerald-100 shadow-lg">
                    <div className="text-center p-6">
                        <div className="text-3xl font-black text-emerald-600 mb-1">{documents.length}</div>
                        <div className="text-sm font-semibold text-gray-700">Documents</div>
                    </div>
                    <div className="text-center p-6 border-l border-emerald-200">
                        <div className="text-3xl font-black text-blue-600 mb-1">
                            {documents.filter(d => d.total_amount).reduce((sum, d) => sum + (d.total_amount || 0), 0).toLocaleString('fr-FR')}
                        </div>
                        <div className="text-sm font-semibold text-gray-700">XAF Total</div>
                    </div>
                    <div className="text-center p-6 border-l border-emerald-200">
                        <div className="text-3xl font-black text-purple-600 mb-1">
                            {documents.filter(d => !d.journal_entries?.length).length}
                        </div>
                        <div className="text-sm font-semibold text-gray-700">À ventiler</div>
                    </div>
                    <div className="text-center p-6 border-l border-emerald-200">
                        <div className="text-3xl font-black text-orange-600 mb-1">98,7%</div>
                        <div className="text-sm font-semibold text-gray-700">Taux IA</div>
                    </div>
                </div>
            )}
        </div>

    )
}