"use client";

import React, {useState, useCallback, useRef, useEffect} from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import {
    UploadCloud, FileText, Zap, Shield, Clock, CheckCircle2,
    AlertCircle, X, Eye, Receipt, Smartphone
} from "lucide-react";
import {api} from "../../../../services/api";

type ProjectType =
// 💰 Finance / Compta
    | "sale"
    | "purchase"
    | "expense"
    | "revenue"
    | "tax"
    | "payroll"

    // 🤝 Métiers / Services
    | "service"
    | "custom"
    | "internal"
    | "r_d"
    | "marketing"
    | "event"
    | "training"

    // 🛠️ Technologie / IT
    | "website"
    | "app"
    | "api"
    | "maintenance"
    | "security"

    // 🧑‍💼 RH / Organisation
    | "recruitment"
    | "hr_policy"
    | "compliance"

    // 🏗️ Construction / Infra
    | "construction"
    | "infrastructure";

/*const projectTypeLabels: Record<ProjectType, string> = {
    sale: "Vente client",
    purchase: "Achat fournisseur",
    expense: "Dépense générale",
    revenue: "Revenu / recette",
    tax: "Projet fiscal / impôt",
    payroll: "Paie / salaires",

    service: "Service client / support",
    custom: "Projet personnalisé",
    internal: "Projet interne",
    r_d: "Recherche & développement",
    marketing: "Campagne marketing",
    event: "Événement / événementiel",
    training: "Formation / atelier",

    website: "Site web",
    app: "Application (mobile / web)",
    api: "Projet API / intégration",
    maintenance: "Maintenance / support technique",
    security: "Sécurité / audit",

    recruitment: "Recrutement",
    hr_policy: "Politique RH / réglementation",
    compliance: "Conformité / audit légal",

    construction: "Bâtiment / construction",
    infrastructure: "Infrastructure / réseau",
};*/
type ProjectCategory =
    | "finance"
    | "business"
    | "tech"
    | "hr"
    | "construction";

/*const projectCategories: Record<ProjectCategory, { label: string; types: ProjectType[] }> = {
    finance: {
        label: "Finance & Comptabilité",
        types: ["sale", "purchase", "expense", "revenue", "tax", "payroll"],
    },
    business: {
        label: "Métiers & Services",
        types: ["service", "custom", "internal", "r_d", "marketing", "event", "training"],
    },
    tech: {
        label: "Technologie & IT",
        types: ["website", "app", "api", "maintenance", "security"],
    },
    hr: {
        label: "RH & Organisation",
        types: ["recruitment", "hr_policy", "compliance"],
    },
    construction: {
        label: "Construction & Infra",
        types: ["construction", "infrastructure"],
    },
};*/
interface UploadDropzoneProps {
    onFileSelect: (file: File) => void;
}

const UploadDropzone = ({ onFileSelect }: UploadDropzoneProps) => {
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {  // ✅ Typé
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {  // ✅ Typé
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files[0];
        if (file && isValidFile(file)) {
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {  // ✅ Typé
        const file = e.target.files?.[0];
        if (file && isValidFile(file)) {
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const isValidFile = (file: File): boolean => {  // ✅ Typé File + return boolean
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        const validExtensions = /\.(jpg|jpeg|png|pdf)$/i;
        return validTypes.includes(file.type) || validExtensions.test(file.name);
    };

    return (
        <div
            className={`
                relative group rounded-3xl p-12 lg:p-20 border-2 border-dashed border-white/30
                bg-gradient-to-br from-slate-50/80 via-blue-50/50 to-emerald-50/30
                backdrop-blur-xl shadow-xl hover:shadow-2xl hover:border-blue-400/60
                transition-all duration-500 cursor-pointer hover:-translate-y-1
                ${dragActive
                ? "border-blue-500 bg-blue-500/5 ring-4 ring-blue-500/20 scale-[1.02]"
                : "border-gray-200 hover:border-gray-400"
            }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                id="file-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                onChange={handleChange}
                ref={fileInputRef}  // ✅ Ajouté pour reset
            />

            <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center h-full cursor-pointer"
            >
                {/* Contenu inchangé */}
                <div className={`
                    w-20 h-20 lg:w-24 lg:h-24 p-5 rounded-3xl shadow-2xl backdrop-blur-sm border border-white/50
                    mb-6 mx-auto transition-all duration-500 group-hover:scale-110
                    ${dragActive
                    ? "bg-gradient-to-br from-blue-500 to-emerald-500 shadow-blue-500/25"
                    : "bg-white hover:bg-gradient-to-br from-blue-100 to-emerald-100"
                }
                `}>
                    <UploadCloud className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                </div>

                <h3 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-2">
                    Glissez votre facture
                </h3>

                <p className="text-lg font-semibold text-gray-700 mb-6 group-hover:text-blue-600 transition-colors">
                    ou cliquez pour sélectionner
                </p>

                <div className="flex flex-wrap gap-3 justify-center items-center text-xs">
                    <span className="px-4 py-2 bg-white/70 backdrop-blur-sm border rounded-2xl shadow-sm font-semibold text-emerald-700">
                        PDF • JPG • PNG
                    </span>
                    <span className="px-3 py-2 bg-emerald-100/80 border rounded-full shadow-sm text-emerald-700 font-semibold flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        IA 98,7%
                    </span>
                    <span className="px-3 py-2 bg-blue-100/80 border rounded-full shadow-sm text-blue-700 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        12s en moyenne
                    </span>
                </div>

                {dragActive && (
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 backdrop-blur-md rounded-3xl flex items-center justify-center">
                        <div className="text-white font-bold text-xl flex items-center gap-2 animate-bounce">
                            <CheckCircle2 className="w-8 h-8" />
                            Parfait ! Déposez maintenant
                        </div>
                    </div>
                )}
            </label>
        </div>
    );
};
const projectCategories = {
    factures: { label: '💼 Factures & Reçus', types: ['invoice', 'receipt', 'credit_note'] },
    services: { label: '🏢 Services', types: ['telecom', 'transport', 'restaurant', 'hotel'] },
    autres: { label: '📋 Autres', types: ['contract', 'bank_statement', 'ticket'] }
} as const;

const projectTypeLabels: Record<string, string> = {
    invoice: 'Facture fournisseur',
    receipt: 'Reçu / Ticket',
    credit_note: 'Avoir client',
    telecom: 'Facture télécom',
    transport: 'Transport/Logistique',
    restaurant: 'Restaurant',
    hotel: 'Hôtel',
    contract: 'Contrat',
    bank_statement: 'Relevé bancaire',
    ticket: 'Ticket/Preuve'
};

export default function UploadPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // États principaux
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    // État type document
    const [typeDocument, setTypeDocument] = useState<string>('invoice');

    // Étapes
    const steps = [
        { number: 1, title: 'Type de document', subtitle: 'Choisissez le type' },
        { number: 2, title: 'Votre fichier', subtitle: 'Glissez ou sélectionnez' },
        { number: 3, title: 'Analyse IA', subtitle: 'En cours...' }
    ];

    // Navigation
    const goToStep = (step: number) => {
        setCurrentStep(step);
        setError(null);
    };

    const goBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            if (currentStep === 2) {
                setFile(null);
                setPreview(null);
            }
        }
    };

    // Sélection type
    const selectDocumentType = (type: string) => {
        setTypeDocument(type);
        goToStep(2);
    };

    // Sélection fichier
    const handleFileSelect = useCallback((selectedFile: File) => {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setError(null);
    }, []);

    // Analyse IA
    const analyzeDocument = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);
        setProgress(10);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', typeDocument);

        // Simulation progression
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return prev;
                }
                return Math.min(prev + (Math.random() * 8 + 3), 90);
            });
        }, 500);

        try {
            // Appel API réel
     /*       const response = await fetch('/api/documents', {
                method: 'POST',
                body: formData,
            });*/
            const response = await api.post("/documents", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            clearInterval(progressInterval);
            setProgress(100);

            // Redirection
            setTimeout(() => {
                const docId = response.data.id || response.data.document_id;
                router.push(`/documents/${docId}`);
            }, 1500);

        } catch (err) {
            clearInterval(progressInterval);
            setError('Erreur d\'analyse. Formats: PDF, JPG, PNG (max 30MB)');
            console.error('Upload error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Utils
    const formatFileSize = (bytes: number): string => {
        if (!bytes) return '0 B';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / 1024 ** i).toFixed(1)} ${['B', 'KB', 'MB'][i]}`;
    };

    const getFileIcon = (type: string): string => {
        if (type.includes('pdf')) return '📄';
        if (type.includes('image')) return '🖼️';
        return '📎';
    };

    const getStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 to-emerald-800 bg-clip-text text-transparent mb-6">
                                Quel document analysez-vous ?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                Sélectionnez le type pour une précision optimale (98,7%)
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(projectCategories).map(([key, category]) => (
                                <div key={key} className="space-y-4">
                                    <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl font-semibold text-gray-800">
                                        {category.label}
                                    </div>
                                    <div className="grid gap-4">
                                        {category.types.map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => selectDocumentType(type)}
                                                className="group relative p-8 border-2 border-gray-200 rounded-3xl hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/20 bg-white/70 backdrop-blur-sm hover:-translate-y-2 transition-all duration-500 h-full overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                                <div className="relative z-10 flex flex-col items-center text-center">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
                                                        <span className="text-2xl">{getFileIcon(type)}</span>
                                                    </div>
                                                    <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-emerald-700">
                                                        {projectTypeLabels[type as keyof typeof projectTypeLabels]}
                                                    </h3>
                                                    <p className="text-sm text-emerald-600 font-semibold bg-emerald-100/80 px-4 py-2 rounded-full">
                                                        Optimisé IA
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-8">
                        {/* Header fichier */}
                        <div className="p-10 border-b border-gray-100 bg-gradient-to-r from-emerald-50/80 to-blue-50/80 backdrop-blur-xl rounded-t-3xl">
                            <div className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-6 flex-1">
                                    <div className="w-20 h-20 p-5 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl shadow-2xl flex-shrink-0">
                                        <span className="text-3xl">{getFileIcon(typeDocument)}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-gray-900">
                                            {projectTypeLabels[typeDocument as keyof typeof projectTypeLabels]}
                                        </h3>
                                        <p className="text-lg text-emerald-600 mt-2 font-semibold">
                                            Précision IA : 98,7% • Temps : ~12s
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={goBack}
                                    className="p-4 rounded-3xl text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-all shadow-lg"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Zone upload */}
                        <div className="py-16 px-8">
                            {!file ? (
                                <UploadDropzone onFileSelect={handleFileSelect} />
                            ) : (
                                <div className="max-w-4xl mx-auto">
                                    <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-gray-200 rounded-4xl overflow-hidden shadow-2xl border-8 border-white/60 mx-auto">
                                        {file.type === 'application/pdf' ? (
                                            <iframe src={preview!} className="w-full h-full border-0" />
                                        ) : (
                                            <img src={preview!} alt="Preview" className="w-full h-full object-contain" />
                                        )}
                                    </div>
                                    <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-3xl text-center">
                                        <h4 className="font-bold text-2xl text-gray-900 mb-2">{file.name}</h4>
                                        <p className="text-lg text-gray-600">
                                            {formatFileSize(file.size)} • {file.type.includes('pdf') ? 'PDF' : 'Image'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="p-12 border-t border-gray-100/50 bg-gradient-to-b from-white/70 backdrop-blur-xl">
                            <div className="flex gap-6 max-w-2xl mx-auto">
                                <button
                                    onClick={goBack}
                                    className="flex-1 h-16 px-8 border-2 border-gray-300 text-lg font-semibold rounded-3xl hover:bg-gray-50 hover:border-gray-400 hover:shadow-xl transition-all backdrop-blur-sm"
                                >
                                    ← Changer type
                                </button>
                                <button
                                    onClick={analyzeDocument}
                                    disabled={!file || loading}
                                    className="flex-1 h-16 px-8 bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 text-white text-lg font-bold rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                                >
                                    <Zap className="w-6 h-6" />
                                    Analyser avec IA →
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 3:
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-emerald-50/50 py-12 px-4 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center">
                    <div className="bg-white/80 backdrop-blur-xl rounded-4xl border border-white/60 shadow-2xl p-10 lg:p-16">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
                            <div className="flex items-center gap-6 flex-shrink-0">
                                <div className="p-6 lg:p-8 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-emerald-500 via-emerald-600 to-blue-600 rounded-4xl shadow-2xl flex items-center justify-center">
                                    <UploadCloud className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-emerald-800 bg-clip-text text-transparent leading-tight">
                                        Analyse IA {currentStep === 1 ? 'Smart' : currentStep === 2 ? 'Upload' : 'Live'}
                                    </h1>
                                    <p className="text-xl lg:text-2xl text-gray-600 mt-4 font-light">
                                        Étape {currentStep}/3 • {steps[currentStep - 1]?.subtitle}
                                    </p>
                                </div>
                            </div>
                            <a
                                href="/documents"
                                className="group inline-flex items-center gap-3 px-10 py-6 text-xl font-bold bg-white/90 border-2 border-gray-200 rounded-4xl shadow-xl hover:shadow-2xl hover:bg-white hover:-translate-y-1 transition-all duration-500 backdrop-blur-xl text-gray-900"
                            >
                                <FileText className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                Tous les documents
                            </a>
                        </div>
                    </div>
                </div>

                {/* Barre de progression */}
                <div className="flex items-center justify-center gap-6 max-w-4xl mx-auto mb-20 px-4">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex items-center gap-4 flex-1 max-w-xs">
                            <div className={`
                w-16 h-16 rounded-3xl flex items-center justify-center text-lg font-bold shadow-2xl
                transition-all duration-700 flex-shrink-0
                ${currentStep === step.number
                                ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-emerald-500/50 scale-110 ring-4 ring-emerald-200/50'
                                : currentStep > step.number
                                    ? 'bg-emerald-500/20 text-emerald-700 border-4 border-emerald-200/50'
                                    : 'bg-gray-200/70 text-gray-500 border-2 border-gray-200'
                            }
              `}>
                                {currentStep > step.number ? '✓' : step.number}
                            </div>
                            <div className="font-semibold text-gray-800">{step.title}</div>
                            {index < steps.length - 1 && (
                                <div className={`h-2 flex-1 rounded-3xl transition-all duration-700 ${
                                    currentStep > step.number
                                        ? 'bg-gradient-to-r from-emerald-500 to-blue-600 shadow-lg'
                                        : 'bg-gray-200/50'
                                }`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Contenu étape */}
                <div className="relative">
                    <div className="bg-white/80 backdrop-blur-xl rounded-4xl border border-white/60 shadow-3xl overflow-hidden max-h-[80vh] overflow-y-auto">
                        {getStepContent()}
                    </div>
                </div>

                {/* Messages d'erreur/succès */}
                {error && (
                    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4">
                        <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200/60 rounded-4xl p-10 shadow-2xl backdrop-blur-xl">
                            <div className="flex items-start gap-6">
                                <div className="w-20 h-20 bg-red-100 rounded-4xl p-5 flex-shrink-0 shadow-2xl">
                                    <AlertCircle className="w-10 h-10 text-red-500 mt-1" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-3xl font-black text-red-900 mb-4">Erreur</h3>
                                    <p className="text-xl text-red-800 leading-relaxed">{error}</p>
                                    <div className="mt-8 flex gap-4">
                                        <button
                                            onClick={analyzeDocument}
                                            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-8 rounded-3xl font-bold hover:from-red-600 hover:to-red-700 shadow-2xl hover:shadow-3xl transition-all"
                                        >
                                            Réessayer
                                        </button>
                                        <button
                                            onClick={() => {
                                                setFile(null);
                                                setPreview(null);
                                                setError(null);
                                                goToStep(2);
                                            }}
                                            className="px-8 py-4 border-2 border-gray-300 text-gray-800 rounded-3xl font-semibold hover:bg-gray-50 hover:shadow-xl transition-all"
                                        >
                                            Changer fichier
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


/*export default function UploadPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);  // ✅ Typé HTMLInputElement
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);  // ✅ Typé string | null
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState<number>(0);  // ✅ Typé number
    const [error, setError] = useState<string | null>(null);  // ✅ Typé string | null
    const [success, setSuccess] = useState<boolean>(false);  // ✅ Typé boolean
    const handleFileSelect = useCallback((selectedFile: File) => {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setError(null);
        setSuccess(false);
        setProgress(0);
    }, []);

    const analyzeDocument = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);
        setProgress(10);

        const formData = new FormData();
        formData.append("file", file);

        try {
            // Progression simulée IA
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + (Math.random() * 10 + 2);
                });
            }, 400);

            const response = await api.post("/documents", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            clearInterval(progressInterval);
            setProgress(100);
            setSuccess(true);

            // Redirection après succès
            setTimeout(() => {
                const docId = response.data.id || response.data.document_id;
                router.push(`/documents/${docId}`);
            }, 1200);

        } catch (error: unknown) {  // ✅ Typé unknown + gestion
            const errorMessage = "Erreur d'analyse IA. Formats supportés : PDF, JPG, PNG jusqu'à 10MB";
            setError(errorMessage);
            console.error("Upload error:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatFileSize = (bytes: number): string => {  // ✅ Typé number → string
        if (!bytes) return "0 B";
        const sizes = ["B", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
    };

    const getFileIcon = (fileType: string): string => {  // ✅ Typé string → string
        if (fileType.includes("pdf")) return "📄";
        if (fileType.includes("image")) return "🖼️";
        return "📎";
    };

    return (

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50 py-12 px-4 lg:px-8">
                <div className="max-w-4xl mx-auto space-y-10">

                    {/!* Header *!/}
                    <div className="text-center lg:text-left">
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-8 lg:p-12">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12">
                                <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
                                    <div className="p-4 lg:p-5 bg-gradient-to-br from-emerald-500 via-emerald-600 to-blue-600 rounded-3xl shadow-2xl">
                                        <UploadCloud className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-emerald-800 bg-clip-text text-transparent leading-tight">
                                            Analyse IA Facture
                                        </h1>
                                        <p className="text-lg lg:text-xl text-gray-600 mt-2 font-light">
                                            Glissez-déposez • <span className="font-semibold text-emerald-600">12s moyenne</span> • 98,7% précision
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href="/documents"
                                    className="group inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold
                                           bg-white border-2 border-gray-200 rounded-3xl shadow-lg hover:shadow-2xl
                                           hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-1
                                           transition-all duration-300 backdrop-blur-sm text-gray-800"
                                >
                                    <FileText className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform" />
                                    Voir tous les documents
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                            Type de projet
                        </label>
                        <select
                            value={typeDocument}
                            onChange={(e) => setTypeDocument(e.target.value)}
                            className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-lg"
                        >
                            {Object.values(projectCategories).map((category) => (
                                <optgroup key={category.label} label={category.label}>
                                    {category.types.map((type) => (
                                        <option key={type} value={type}>
                                            {projectTypeLabels[type]}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                    {/!* Main Upload Area *!/}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
                        {!file ? (
                            <UploadDropzone onFileSelect={handleFileSelect} />
                        ) : (
                            <>
                                {/!* File Selected Header *!/}
                                <div className="p-8 lg:p-10 border-b border-gray-100/50 bg-gradient-to-r from-emerald-50 to-blue-50/50">
                                    <div className="flex items-start lg:items-center justify-between gap-6 flex-wrap">
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="flex-shrink-0 w-14 h-14 p-3 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl shadow-lg">
                                                {getFileIcon(file.type)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-bold text-xl lg:text-2xl text-gray-900 truncate">{file.name}</h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                    <span>{formatFileSize(file.size)}</span>
                                                    <span className="flex items-center gap-1">
                                                    <Receipt className="w-4 h-4" />
                                                        {file.type.includes('pdf') ? 'PDF' : 'Image'}
                                                </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setFile(null);
                                                setPreview(null);
                                                if (fileInputRef.current) fileInputRef.current.value = "";
                                            }}
                                            className="p-3 rounded-2xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 shadow-sm"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/!* Preview *!/}
                                {preview && (
                                    <div className="p-8 lg:p-12">
                                        <div className="aspect-[4/3] lg:aspect-video bg-gradient-to-br from-slate-100 to-gray-200 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 mx-auto max-w-4xl">

                                            {file?.type === "application/pdf" ? (
                                                <iframe
                                                    src={URL.createObjectURL(file)}
                                                    className="w-full h-full border-0"
                                                />
                                            ) : (
                                                <img
                                                    src={preview}
                                                    alt="Aperçu"
                                                    className="w-full h-full object-contain"
                                                />
                                            )}

                                        </div>
                                    </div>
                                )}

                                {/!* Progress & Action *!/}
                                <div className="p-8 lg:p-12 border-t border-gray-100/50 bg-gradient-to-b from-white/50">
                                    <div className="max-w-2xl mx-auto space-y-6">

                                        {/!* Progress Bar *!/}
                                        {loading && (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>Analyse IA en cours</span>
                                                    <span className="font-mono font-semibold">{Math.round(progress)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-2xl h-3 shadow-inner overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 rounded-2xl shadow-lg transition-all duration-700 ease-out"
                                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                                    />
                                                </div>
                                                <div className="flex gap-4 text-xs text-gray-500 text-center">
                                                    <span>📤 Upload</span>
                                                    <span>🤖 IA OCR</span>
                                                    <span>💼 Extraction</span>
                                                </div>
                                            </div>
                                        )}

                                        {/!* Action Button *!/}
                                        <button
                                            onClick={analyzeDocument}
                                            disabled={loading || !file}
                                            className={`
                                            w-full group relative py-5 px-12 rounded-3xl font-bold text-lg shadow-2xl
                                            transition-all duration-500 overflow-hidden
                                            flex items-center justify-center gap-4 mx-auto max-w-md
                                            ${loading || !file
                                                ? 'bg-gray-300 cursor-not-allowed shadow-none text-gray-500'
                                                : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white hover:shadow-3xl hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98]'
                                            }
                                        `}
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-7 h-7 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span>Analyse en cours {Math.round(progress)}%</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                                                    <span>Analyser avec IA</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/!* Error State *!/}
                    {error && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200/50 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-red-100 rounded-3xl p-4 flex-shrink-0 mt-0.5 shadow-lg">
                                        <AlertCircle className="w-8 h-8 text-red-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-2xl text-red-900 mb-3">Erreur d'analyse</h3>
                                        <p className="text-lg text-red-800 leading-relaxed">{error}</p>
                                        <div className="mt-6 flex gap-3">
                                            <button
                                                onClick={analyzeDocument}
                                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-2xl font-semibold hover:from-red-600 hover:to-red-700 shadow-xl hover:shadow-2xl transition-all duration-300"
                                            >
                                                Réessayer
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setFile(null);
                                                    setPreview(null);
                                                    setError(null);
                                                }}
                                                className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300"
                                            >
                                                Changer fichier
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200/50 rounded-3xl p-8 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4 duration-700">
                                <div className="flex items-center gap-4 text-emerald-800">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-3xl p-4 shadow-lg animate-bounce">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-2xl mb-2">Analyse terminée !</h3>
                                        <p className="text-lg">Redirection vers votre document analysé...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

    );
}*/

