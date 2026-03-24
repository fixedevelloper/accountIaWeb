'use client'
import React, { useState } from "react"
import DataTable from "@/components/tables/DataTable"
import Link from "next/link"

export default function BankingTransactionsPage() {
    const columns = [
        { label: "Date", accessor: "date" },
        { label: "Compte", accessor: "account" },
        { label: "Libellé", accessor: "label" },
        { label: "Type", accessor: "type" },
        { label: "Montant", accessor: "amount" },
        { label: "Statut", accessor: "status" },
    ]

    const [data, setData] = useState([
        {
            date: "12/03/2026",
            account: "Banque",
            label: "Paiement client ABC",
            type: "Crédit",
            amount: "50000",
            status: "Validée"
        },
        {
            date: "10/03/2026",
            account: "Banque",
            label: "Facture fournisseur MTN",
            type: "Débit",
            amount: "18000",
            status: "En attente"
        },
        {
            date: "08/03/2026",
            account: "Caisse",
            label: "Encaissement Espèces",
            type: "Crédit",
            amount: "12000",
            status: "Validée"
        }
    ])

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">Transactions bancaires</h1>
                    <p className="text-gray-500 text-sm">
                        Suivi et gestion des transactions par compte
                    </p>
                </div>

                <div className="flex gap-2">
                    <Link
                        href="/banking/transactions/add"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Ajouter une transaction
                    </Link>
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                        Importer CSV
                    </button>
                </div>
            </div>

            {/* Filtres */}
            <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-wrap gap-4">
                <input
                    type="date"
                    className="border rounded-lg p-2"
                    placeholder="Date début"
                />
                <input
                    type="date"
                    className="border rounded-lg p-2"
                    placeholder="Date fin"
                />
                <select className="border rounded-lg p-2">
                    <option>Tous les comptes</option>
                    <option>Banque</option>
                    <option>Caisse</option>
                </select>
                <select className="border rounded-lg p-2">
                    <option>Tous les types</option>
                    <option>Crédit</option>
                    <option>Débit</option>
                </select>
                <select className="border rounded-lg p-2">
                    <option>Tous les statuts</option>
                    <option>Validée</option>
                    <option>En attente</option>
                </select>
            </div>

            {/* DataTable */}
            <div className="bg-white border rounded-xl p-6 shadow-sm">
                {/*<DataTable columns={columns} data={data} />*/}
            </div>
        </div>
    )
}