'use client'
import React, { useState } from "react"
import DataTable from "@/components/tables/DataTable"

export default function BalanceSheetPage() {
    const columns = [
        { label: "Compte", accessor: "account" },
        { label: "Libellé", accessor: "label" },
        { label: "Actif", accessor: "asset" },
        { label: "Passif", accessor: "liability" },
    ]

    const [data, setData] = useState([
        { account: "101", label: "Capital social", asset: 0, liability: 100000 },
        { account: "512", label: "Banque", asset: 100000, liability: 0 },
        { account: "401", label: "Fournisseurs", asset: 0, liability: 50000 },
        { account: "211", label: "Immobilisations", asset: 50000, liability: 0 },
    ])

    const totalAsset = data.reduce((acc, item) => acc + item.asset, 0)
    const totalLiability = data.reduce((acc, item) => acc + item.liability, 0)

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">Bilan comptable</h1>
                    <p className="text-gray-500 text-sm">
                        Actif et Passif par compte
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
{/*                <DataTable columns={columns} data={data} />*/}
            </div>

            {/* Totaux */}
            <div className="flex justify-end gap-6 text-gray-700 font-semibold">
                <div>Total Actif: {totalAsset}</div>
                <div>Total Passif: {totalLiability}</div>
            </div>

        </div>
    )
}