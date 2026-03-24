'use client'
import React, { useState } from "react"
import DataTable from "@/components/tables/DataTable"

export default function IncomeStatementPage() {
    const columns = [
        { label: "Compte", accessor: "account" },
        { label: "Libellé", accessor: "label" },
        { label: "Débit", accessor: "debit" },
        { label: "Crédit", accessor: "credit" },
        { label: "Solde", accessor: "balance" },
    ]

    const [data, setData] = useState([
        { account: "606", label: "Achats de marchandises", debit: 80000, credit: 0, balance: -80000 },
        { account: "607", label: "Services extérieurs", debit: 20000, credit: 0, balance: -20000 },
        { account: "701", label: "Ventes de produits", debit: 0, credit: 120000, balance: 120000 },
        { account: "702", label: "Prestations de services", debit: 0, credit: 30000, balance: 30000 },
    ])

    const totalDebit = data.reduce((acc, item) => acc + item.debit, 0)
    const totalCredit = data.reduce((acc, item) => acc + item.credit, 0)
    const netIncome = totalCredit + totalDebit // Débit négatif

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">Compte de résultat</h1>
                    <p className="text-gray-500 text-sm">
                        Résultat de l’exercice par compte
                    </p>
                </div>

                <div className="flex gap-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Exporter PDF
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                        Exporter Excel
                    </button>
                </div>
            </div>

            {/* DataTable */}
            <div className="bg-white border rounded-xl p-6 shadow-sm">
            {/*    <DataTable columns={columns} data={data} />*/}
            </div>

            {/* Totaux */}
            <div className="flex justify-end gap-6 text-gray-700 font-semibold">
                <div>Total Débit: {totalDebit}</div>
                <div>Total Crédit: {totalCredit}</div>
                <div>Résultat Net: {netIncome}</div>
            </div>

        </div>
    )
}