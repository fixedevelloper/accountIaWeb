"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    CheckCircle2, ShieldCheck, Zap, Award, Mail, Clock,
    ArrowRight, Users, Building2, FileText
} from "lucide-react";

export default function EmailSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const email = searchParams.get("email") || localStorage.getItem("unverified_email") || "";
    const action = searchParams.get("action") || "verification"; // verification, resend, update

    // Auto-redirect après 8 secondes
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/");
        }, 8000);
        return () => clearTimeout(timer);
    }, [router]);

    const formatEmail = (email:any) => {
        return email.replace(/(.{2}).+@(.{3}).(.+)/, "$1***@$2***.$3");
    };

    const getSuccessMessage = () => {
        switch (action) {
            case "resend":
                return "Nouveau lien de vérification envoyé !";
            case "update":
                return "Email mis à jour avec succès !";
            default:
                return "Email vérifié avec succès !";
        }
    };

    const getSubMessage = () => {
        switch (action) {
            case "resend":
                return "Vérifiez votre boîte de réception (y compris spam)";
            case "update":
                return "Un nouveau lien a été envoyé à votre nouvelle adresse";
            default:
                return "Vous pouvez maintenant vous connecter à ComptableAI";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50/30 to-slate-50/50 flex items-center justify-center p-4 lg:p-0">
            <div className="max-w-lg w-full space-y-8 text-center">

                {/* Main Celebration Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-12 lg:p-16 overflow-hidden relative">

                    {/* Floating particles */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-xl animate-float" />
                    <div className="absolute bottom-8 left-8 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-emerald-400/20 rounded-full blur-xl animate-float delay-1000" />

                    {/* Header */}
                    <div className="mb-10 relative z-10">
                        <div className="mx-auto w-28 h-28 bg-gradient-to-br from-emerald-400 via-emerald-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl mb-8 ring-4 ring-white/50">
                            <CheckCircle2 className="w-16 h-16 text-white drop-shadow-2xl animate-bounce" />
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-emerald-600 via-emerald-700 to-blue-600 bg-clip-text text-transparent leading-tight mb-4">
                            Parfait !
                        </h1>

                        <p className="text-2xl font-bold text-gray-800 mb-2">
                            {getSuccessMessage()}
                        </p>

                        <p className="text-xl text-gray-600 font-light max-w-md mx-auto leading-relaxed">
                            {getSubMessage()}
                        </p>
                    </div>

                    {/* Email Display */}
                    {email && (
                        <div className="bg-gradient-to-r from-emerald-50/80 to-blue-50/80 backdrop-blur-sm border border-emerald-200 rounded-2xl p-6 mb-10 shadow-xl">
                            <div className="flex items-center justify-center gap-3">
                                <Mail className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                                <span className="text-xl font-semibold text-gray-800 px-4 py-2 bg-white/60 rounded-xl shadow-sm min-w-0 truncate">
                                    {formatEmail(email)}
                                </span>
                                <ShieldCheck className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>
                    )}

                    {/* Stats & Timer */}
                    <div className="grid grid-cols-3 gap-6 mb-12">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                            <div className="text-2xl font-black text-emerald-600 mb-1">✅</div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold">Vérifié</p>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                            <div className="text-2xl font-black text-blue-600 mb-1">🚀</div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold">Dashboard</p>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                            <div className="text-2xl font-black text-purple-600 mb-1">⚡</div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold">IA Ready</p>
                        </div>
                    </div>

                    {/* Progress Timer */}
                    <div className="mb-10">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                            <Clock className="w-4 h-4 animate-spin-slow" />
                            <span>Redirection automatique dans</span>
                        </div>
                        <div className="w-full bg-gray-200/50 backdrop-blur-sm rounded-2xl h-2 shadow-inner overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 rounded-2xl shadow-lg animate-countdown transition-all duration-1000" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        <Link
                            href="/login"
                            className="w-full group block py-6 px-10 bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 rounded-3xl font-black text-xl text-white shadow-2xl hover:shadow-3xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-3 backdrop-blur-sm"
                        >
                            <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            Aller se connecter
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </Link>

                        <Link
                            href="/dashboard"
                            className="w-full py-5 px-8 bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-gray-200 text-gray-800 font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:bg-white hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            Accéder directement au Dashboard
                            <Building2 className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Pro Stats */}
                    <div className="pt-10 border-t border-emerald-100/50 grid grid-cols-2 gap-6 text-sm">
                        <div className="flex items-center gap-2 text-emerald-700 font-semibold bg-emerald-100/60 p-4 rounded-xl backdrop-blur-sm">
                            <FileText className="w-4 h-4" />
                            <span>247k+ factures IA</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-700 font-semibold bg-blue-100/60 p-4 rounded-xl backdrop-blur-sm">
                            <Users className="w-4 h-4" />
                            <span>12k+ entreprises CM</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-8 mt-8 border-t border-gray-100/50 text-center">
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-200/50 rounded-2xl backdrop-blur-sm text-emerald-700 font-semibold text-sm">
                            <Award className="w-4 h-4" />
                            Édition Pro • Entreprise 2026
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                            Spam? Renvoyez le lien • Support 24/7 • contact@comptable.ai
                        </p>
                    </div>
                </div>

                {/* Custom CSS pour animations */}
                <style jsx>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                    @keyframes countdown {
                        0% { width: 100%; }
                        100% { width: 0%; }
                    }
                    .animate-countdown {
                        animation: countdown 8s linear forwards;
                    }
                    @keyframes spin-slow {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .animate-spin-slow {
                        animation: spin-slow 3s linear infinite;
                    }
                `}</style>
            </div>
        </div>
    );
}
