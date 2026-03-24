'use client'
import React, { useState, useEffect } from "react"
import DataTable from "@/components/tables/DataTable"
interface Transaction {
    id:  number;
    date: string;
    label: string;
    amount: number;
    matched: boolean;
}
interface TableRow {
    id: number;
    date: string;
    label: string;
    amount: number;
    matched: string;
    action: React.ReactNode;
}
export default function BankingReconcilePage() {
    const [bankTransactions, setBankTransactions] = useState([
        { id: 1, date: "12/03/2026", label: "Paiement client ABC", amount: 50000, matched: false },
        { id: 2, date: "10/03/2026", label: "Facture fournisseur MTN", amount: -18000, matched: false },
        { id: 3, date: "08/03/2026", label: "Encaissement espèces", amount: 12000, matched: true },
    ])

    const [ledgerEntries, setLedgerEntries] = useState([
        { id: 1, date: "12/03/2026", label: "Facture client ABC", amount: 50000, matched: true },
        { id: 2, date: "10/03/2026", label: "Facture MTN", amount: -18000, matched: false },
        { id: 3, date: "08/03/2026", label: "Encaissement espèces", amount: 12000, matched: true },
    ])

    // Colonne pour DataTable
    const columns = [
        { label: "Date", accessor: "date" },
        { label: "Libellé", accessor: "label" },
        { label: "Montant", accessor: "amount" },
        { label: "État", accessor: "matched" },
        { label: "Action", accessor: "action" },
    ]

    // Fonction pour matcher une transaction
    const toggleMatch = (id:number, type:string) => {
        if (type === "bank") {
            setBankTransactions(prev =>
                prev.map(tx => (tx.id === id ? { ...tx, matched: !tx.matched } : tx))
            )
        } else {
            setLedgerEntries(prev =>
                prev.map(tx => (tx.id === id ? { ...tx, matched: !tx.matched } : tx))
            )
        }
    }

    // Préparer les données pour DataTable


    const prepareData = (transactions: Transaction[], type: string): TableRow[] => // ou interface pour le return
        transactions.map((tx: Transaction) => ({
            id:tx.id,
            date: tx.date,
            label: tx.label,
            amount: tx.amount,
            matched: tx.matched ? "Matché" : "Non matché",
            action: (
                <button
                    className={`px-3 py-1 rounded-lg text-white ${
                        tx.matched ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"
                    }`}
                    onClick={() => toggleMatch(tx.id, type)}
                >
                    {tx.matched ? "Dématcher" : "Matcher"}
                </button>
            )
        }));

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">Rapprochement bancaire</h1>
                    <p className="text-gray-500 text-sm">
                        Comparez vos transactions bancaires avec vos écritures comptables
                    </p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Automatch toutes les transactions
                </button>
            </div>

            {/* Banque */}
            <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold">Transactions bancaires</h2>
                <DataTable columns={columns} data={prepareData(bankTransactions, "bank")} />
            </div>

            {/* Grand Livre */}
            <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold">Écritures comptables</h2>
                <DataTable columns={columns} data={prepareData(ledgerEntries, "ledger")} />
            </div>

        </div>
    )
}