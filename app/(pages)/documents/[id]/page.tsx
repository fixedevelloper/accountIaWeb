"use client";

import {useEffect, useState, useRef, ChangeEvent, FormEvent} from "react";  // ✅ useRef ajouté
import {useParams, useRouter} from "next/navigation";
import {api} from "../../../../services/api";
import { Trash2, Plus, Save, ArrowLeft, FileText } from "lucide-react";
import {Document,DocumentExtraction, JournalEntry, JournalEntryLine} from "../../../../types/types";

// ✅ Types
type EntryLine = {
    account_id: number | null;
    account_label: string;
    debit: number;
    credit: number;
};

type FormType = {
    due_date: string;
    supplier_name: string;
    invoice_number: string;
    invoice_date: string;
    total_amount: string;
    currency: string;
    tva: number;
    invoice_type: "purchase" | "sale" | "expense";
    amount_ht: number;
};

export default function DocumentEditPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const saveBtnRef = useRef<HTMLButtonElement>(null);  // ✅ useRef pour bouton Save

    const [loading, setLoading] = useState(true);
    const [document, setDocument] = useState<Document | null>(null);
    const [extraction, setExtraction] = useState<DocumentExtraction | null>(null);
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [lines, setLines] = useState<EntryLine[]>([]);


    const [formInitialized, setFormInitialized] = useState(false);
    const [isDirty, setIsDirty] = useState(false); // 👈 détecte modif user


    const [form, setForm] = useState<FormType>({
        supplier_name: "",
        invoice_number: "",
        invoice_date: "",
        due_date: "",
        total_amount: "",
        currency: "XAF",
        tva: 19.25,
        invoice_type: "purchase",
        amount_ht: 0,
    });

    // ================= FETCH =================

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const res = await api.get<Document>(`/documents/${id}`);
                const doc = res.data;

                setDocument(doc);
                setEntries(doc.journal_entries || []);

                const ext = doc.latest_extraction || doc.extractions?.[0] || null;
                setExtraction(ext);

                if (doc.journal_entries?.length) {
                    const entry = doc.journal_entries[0];
                    setLines(entry.lines.map((l: JournalEntryLine) => ({
                        account_id: l.account_id,
                        account_label: `${l.account.code} - ${l.account.name}`,
                        debit: l.debit,
                        credit: l.credit,
                    })));
                }

            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);
    useEffect(() => {
        if (!id) return;

        let cancelled = false;
        let attempts = 0;
        const MAX = 60;

        const poll = async () => {
            if (cancelled || attempts >= MAX) return;

            try {
                attempts++;

                const res = await api.get(`/documents/${id}`);
                const doc = res.data;

                console.log("Polling...", attempts, doc.status);

                if (!['pending', 'processing','uploaded'].includes(doc.status)) {
                    setDocument(doc);

                    const ext = doc.latest_extraction || doc.extractions?.[0] || null;
                    setExtraction(ext);
                    if (doc.journal_entries?.length) {
                        const entry = doc.journal_entries[0];
                        const mapped: EntryLine[] = entry.lines.map((l:JournalEntryLine) => ({  // ✅ Typé
                            account_id: l.account_id,
                            account_label: `${l.account.code} - ${l.account.name}`,
                            debit: l.debit,
                            credit: l.credit,
                        }));
                        setLines(mapped);
                    }


                    return; // ✅ STOP propre
                }

            } catch (e) {
                console.error("Polling error", e);

                if (attempts > 10) return; // stop après erreurs
            }

            // ✅ relance manuelle (meilleur que setInterval)
            setTimeout(poll, 3000);
        };

        poll();

        return () => {
            cancelled = true;
        };
    }, [id]);
    useEffect(() => {
        if (!extraction || formInitialized || isDirty) return;

        setForm({
            due_date: extraction.invoice_date || "",
            supplier_name: extraction.supplier_name || "",
            invoice_number: extraction.invoice_number || "",
            invoice_date: extraction.invoice_date || "",
            total_amount: String(extraction.total_amount || ""),
            currency: extraction.currency || "XAF",
            tva: 19.25,
            invoice_type: "purchase",
            amount_ht: extraction.amount_ht || 0,
        });

        setFormInitialized(true);

    }, [extraction, formInitialized, isDirty]);
    useEffect(() => {
        setFormInitialized(false);
        setIsDirty(false);
    }, [id]);

    // ================= FORM HANDLERS =================
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {  // ✅ Typé
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "tva" || name === "amount_ht" ? Number(value) || 0 : value,
        }));
    };
    const isProcessing = document && ['processing', 'uploaded'].includes(document.status);
    // Ajoutez ce useEffect pour sync form ↔ extraction
/*    useEffect(() => {
        if (extraction && !Object.keys(form).some(Boolean)) {
            setDocument(document);
            setEntries(document?.journal_entries || []);

            const ext = document?.latest_extraction || document?.extractions?.[0] || null;
            setExtraction(ext);

            if (ext) {
                setForm({
                    due_date: "",
                    supplier_name: ext.supplier_name || "",
                    invoice_number: ext.invoice_number || "",
                    invoice_date: ext.invoice_date || "",
                    total_amount: String(ext.total_amount || ""),
                    currency: ext.currency || "XAF",
                    tva: 19.25,
                    invoice_type: "purchase" as const,
                    amount_ht: ext.amount_ht || 0
                });
            }

            if (document?.journal_entries?.length) {
                const entry = document.journal_entries[0];
                const mapped: EntryLine[] = entry.lines.map((l:JournalEntryLine) => ({  // ✅ Typé
                    account_id: l.account_id,
                    account_label: `${l.account.code} - ${l.account.name}`,
                    debit: l.debit,
                    credit: l.credit,
                }));
                setLines(mapped);
            }
        }
    }, [extraction,document]);*/
    const addLine = (): void => {
        setLines([...lines, { account_id: null, account_label: "", debit: 0, credit: 0 }]);
    };

    const removeLine = (index: number): void => {
        setLines(lines.filter((_, i) => i !== index));
    };

    const updateLine = <K extends keyof EntryLine>(
        index: number,
        field: K,
        value: EntryLine[K]
    ): void => {
        const updated = [...lines];
        updated[index][field] = value;
        setLines(updated);
    };

    // ✅ Totals typés correctement
    const totalDebit: number = lines.reduce((sum: number, l: EntryLine) => sum + (l.debit || 0), 0);
    const totalCredit: number = lines.reduce((sum: number, l: EntryLine) => sum + (l.credit || 0), 0);
    const balance: number = totalDebit - totalCredit;

    // ================= SAVE CORRIGÉ avec useRef ✅
    const handleSave = async (): Promise<void> => {
        if (!extraction) return;

        try {
            await api.put(`/extractions/${extraction.id}`, {
                supplier_name: form.supplier_name,
                invoice_number: form.invoice_number,
                invoice_date: form.invoice_date,
                total_amount: Number(form.total_amount) || 0,
                currency: form.currency,
            });

            if (entries.length > 0) {
                await api.put(`/journal-entries/${entries[0].id}`, {
                    lines: lines
                });
            }

            // ✅ useRef au lieu de document.getElementById
            if (saveBtnRef.current) {
                const btn = saveBtnRef.current;
                const originalText = btn.innerHTML;

                btn.innerHTML = '<div className="flex items-center gap-2"><Trash2 className="animate-spin h-4 w-4" /> Enregistré !</div>';
                btn.disabled = true;

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 2000);
            }

        } catch (e) {
            console.error(e);
            alert("Erreur lors de la sauvegarde");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"/>
            </div>
        );
    }

    if (!document) {
        return <div>Document non trouvé</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push("/documents")}
                            className="p-2 hover:bg-white/50 rounded-xl transition-all duration-200"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Édition Document
                            </h1>
                            <p className="text-gray-500">
                                {extraction?.supplier_name || "Nouveau document"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* DOCUMENT PREVIEW */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                                Aperçu Document
                            </h2>
                        </div>
                        <div className="p-2 flex items-center justify-center h-[500px]">
                            {document.file_path ? (
                                document.file_path.endsWith(".pdf") ? (
                                    <iframe
                                        src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${document.file_path}`}
                                        className="w-full h-full rounded-xl shadow-inner"
                                    />
                                ) : (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${document.file_path}`}
                                        className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
                                        alt="Document"
                                    />
                                )
                            ) : (
                                <div className="text-center text-gray-400 py-12">
                                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                                    <p>Aucun document chargé</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* FORM & VENTILATION */}
                    {isProcessing ? (
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200/50 rounded-2xl shadow-sm">
                            <div className="flex items-center justify-center gap-3 text-blue-800">
                                <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                                <div>
                                    <div className="font-semibold text-lg">Analyse IA en cours</div>
                                    <div className="text-sm opacity-75">Patience, cela prend ~12s</div>
                                </div>
                            </div>
                        </div>
                    ):( <div className="lg:col-span-1 space-y-6">

                        {/* DOCUMENT INFO */}
                        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6">
                            <h2 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                📄 Données Document
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Champs form - reste identique mais avec handleChange typé */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de facture</label>
                                    <select
                                        name="invoice_type"
                                        value={form.invoice_type}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    >
                                        <option value="purchase">Achat fournisseur</option>
                                        <option value="sale">Vente client</option>
                                        <option value="expense">Dépense diverse</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fournisseur
                                    </label>
                                    <input
                                        name="supplier_name"
                                        value={form.supplier_name}
                                        onChange={handleChange}
                                        placeholder="Nom fournisseur"
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Numero de facture
                                    </label>
                                    <input
                                        name="invoice_number"
                                        value={form.invoice_number}
                                        onChange={handleChange}
                                        placeholder="FACT-2026-001"
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label>Date Émission</label>
                                    <input className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                           type="date" name="invoice_date" value={form.invoice_date} onChange={handleChange} />
                                </div>
                                <div>
                                    <label>Date Échéance</label>
                                    <input
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        type="date" name="due_date" value={form.due_date} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* FINANCIAL INFO */}
                        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl shadow-xl border border-white/50 p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">💰 Montants</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">HT</label>
                                    <input
                                        name="amount_ht"
                                        type="number"
                                        value={form.amount_ht}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">TVA %</label>
                                    <input
                                        name="tva"
                                        type="number"
                                        step="0.01"
                                        value={form.tva}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">TTC</label>
                                    <input
                                        disabled
                                        value={(form.amount_ht * (1 + form.tva / 100)).toLocaleString('fr-FR')}
                                        className="w-full p-3 border-2 border-emerald-200 bg-emerald-50 rounded-xl font-semibold text-lg text-emerald-800"
                                    />
                                </div>
                            </div>
                            <div className="mt-3 text-sm text-gray-600">
                                Devise: <span className="font-semibold text-blue-600">{form.currency}</span>
                            </div>
                        </div>

                        {/* JOURNAL ENTRIES - handlers typés */}
                        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50">
                            {/* Table reste identique mais updateLine typé */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    {/* thead identique */}
                                    <tbody>
                                    {lines.map((line, i) => (
                                        <tr key={i} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <input
                                                    value={line.account_label}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateLine(i, "account_label", e.target.value)}  // ✅ Typé
                                                    placeholder="611 - Achats fournitures"
                                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="p-4 text-right">
                                                <input
                                                    type="number"
                                                    value={line.debit}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateLine(i, "debit", Number(e.target.value) || 0)}  // ✅ Typé
                                                    className="w-24 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 text-right"
                                                />
                                            </td>
                                            <td className="p-4 text-right">
                                                <input
                                                    type="number"
                                                    value={line.credit}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateLine(i, "credit", Number(e.target.value) || 0)}  // ✅ Typé
                                                    className="w-24 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 text-right"
                                                />
                                            </td>
                                            <td className="p-4">
                                                <button onClick={() => removeLine(i)} className="...">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ACTION BUTTONS avec useRef ✅ */}
                        <div className="flex gap-3 pt-4">
                            <button
                                ref={saveBtnRef}  // ✅ useRef connecté
                                onClick={handleSave}
                                disabled={!extraction}
                                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="h-5 w-5" />
                                Enregistrer
                            </button>
                            <button
                                onClick={() => router.push("/documents")}
                                className="px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                            >
                                <ArrowLeft className="h-5 w-5 inline mr-2" />
                                Retour
                            </button>
                        </div>
                    </div>)}

                </div>
            </div>
        </div>
    );
}