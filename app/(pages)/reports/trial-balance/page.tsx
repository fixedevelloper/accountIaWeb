'use client'
import React, { useState } from "react"
import DataTable from "@/components/tables/DataTable"

export default function TrialBalancePage() {
    const columns = [
        { label: "Compte", accessor: "account" },
        { label: "Libellé", accessor: "label" },
        { label: "Débit", accessor: "debit" },
        { label: "Crédit", accessor: "credit" },
        { label: "Solde", accessor: "balance" },
    ]

    const [data, setData] = useState([
        { account: "101", label: "Capital social", debit: 0, credit: 100000, balance: 100000 },
        { account: "401", label: "Fournisseurs", debit: 50000, credit: 0, balance: -50000 },
        { account: "512", label: "Banque", debit: 150000, credit: 50000, balance: 100000 },
        { account: "606", label: "Achats de marchandises", debit: 80000, credit: 0, balance: -80000 },
        { account: "707", label: "Ventes", debit: 0, credit: 120000, balance: 120000 },
    ])

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">Balance comptable</h1>
                    <p className="text-gray-500 text-sm">
                        Visualisez la balance comptable par compte
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
          {/*      <DataTable columns={columns} data={data} />*/}
            </div>

            {/* Totaux */}
            <div className="flex justify-end gap-6 text-gray-700 font-semibold">
                <div>Total Débit: {data.reduce((acc, item) => acc + item.debit, 0)}</div>
                <div>Total Crédit: {data.reduce((acc, item) => acc + item.credit, 0)}</div>
                <div>Solde Net: {data.reduce((acc, item) => acc + item.balance, 0)}</div>
            </div>

        </div>
    )
}