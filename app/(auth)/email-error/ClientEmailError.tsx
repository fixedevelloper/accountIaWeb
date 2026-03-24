"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    AlertCircle, Mail, ShieldAlert, RefreshCw, Zap, Clock,
    ArrowLeft, ShieldCheck, Award, FileText, Users, ArrowRight
} from "lucide-react";

export default function EmailErrorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const error = searchParams.get("error") || "unknown";
    const email = searchParams.get("email") || localStorage.getItem("unverified_email") || "";

    // Auto-redirect après 15 secondes
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/");
        }, 15000);
        return () => clearTimeout(timer);
    }, [router]);

    const formatEmail = (email:any) => {
        return email ? email.replace(/(.{2}).+@(.{3}).(.+)/, "$1***@$2***.$3") : "votre email";
    };

    const getErrorTitle = () => {
        switch (error) {
            case "expired":
                return "Lien expiré";
            case "invalid":
                return "Lien invalide";
            case "already_verified":
                return "Déjà vérifié";
            case "resend_failed":
                return "Échec renvoi";
            default:
                return "Erreur vérification";
        }
    };

    const getErrorMessage = () => {
        switch (error) {
            case "expired":
                return "Le lien de vérification a expiré (24h max). Demandez un nouveau lien.";
            case "invalid":
                return "Le lien n'est pas valide. Vérifiez l'URL ou demandez un nouveau lien.";
            case "already_verified":
                return "Cet email est déjà vérifié. Vous pouvez vous connecter directement.";
            case "resend_failed":
                return "Impossible d'envoyer le nouveau lien. Vérifiez votre adresse email.";
            default:
                return "Une erreur est survenue lors de la vérification. Essayez de renvoyer le lien.";
        }
    };

    const getActionText = () => {
        switch (error) {
            case "already_verified":
                return "Aller se connecter";
            case "expired":
            case "invalid":
            case "resend_failed":
                return "Renvoyer le lien";
            default:
                return "Nouvelle vérification";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50/30 to-slate-50/50 flex items-center justify-center p-4 lg:p-0">
            <div className="max-w-lg w-full space-y-8">

                {/* Main Error Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-12 lg:p-16 relative overflow-hidden">

                    {/* Error particles */}
                    <div className="absolute top-6 -right-20 w-40 h-40 bg-gradient-to-br from-red-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse-slow" />
                    <div className="absolute bottom-10 -left-20 w-32 h-32 bg-gradient-to-tr from-rose-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />

                    {/* Header */}
                    <div className="text-center mb-10 relative z-10">
                        <div className="mx-auto w-28 h-28 bg-gradient-to-br from-red-400 via-rose-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl mb-8 ring-4 ring-white/50">
                            <AlertCircle className="w-16 h-16 text-white drop-shadow-2xl" />
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 bg-clip-text text-transparent leading-tight mb-4">
                            Oops !
                        </h1>

                        <p className="text-2xl font-bold text-gray-800 mb-6">
                            {getErrorTitle()}
                        </p>

                        <div className="max-w-md mx-auto">
                            <p className="text-xl text-gray-700 font-light leading-relaxed mb-2">
                                {getErrorMessage()}
                            </p>
                            <p className="text-lg text-gray-600">
                                Temps restant: <span className="font-mono text-red-500 font-bold text-xl">15s</span>
                            </p>
                        </div>
                    </div>

                    {/* Email Display */}
                    {email && (
                        <div className="bg-gradient-to-r from-red-50/80 to-rose-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl p-6 mb-10 shadow-xl">
                            <div className="flex items-center justify-center gap-3">
                                <Mail className="w-8 h-8 text-red-500 flex-shrink-0" />
                                <span className="text-xl font-semibold text-gray-800 px-6 py-3 bg-white/60 rounded-xl shadow-sm min-w-0 truncate">
                                    {formatEmail(email)}
                                </span>
                                <ShieldAlert className="w-6 h-6 text-orange-500" />
                            </div>
                            <p className="text-center text-sm text-gray-600 mt-3">
                                Email associé à cette vérification
                            </p>
                        </div>
                    )}

                    {/* Solutions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 group hover:shadow-2xl transition-all">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <RefreshCw className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="font-bold text-lg text-gray-900 mb-2">Renvoyer</h4>
                            <p className="text-sm text-gray-600">Nouveau lien valide 24h</p>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 group hover:shadow-2xl transition-all">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="font-bold text-lg text-gray-900 mb-2">Vérifier spam</h4>
                            <p className="text-sm text-gray-600">Gmail/Outlook/Yahoo</p>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 group hover:shadow-2xl transition-all">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="font-bold text-lg text-gray-900 mb-2">24h validité</h4>
                            <p className="text-sm text-gray-600">Liens auto-expirés</p>
                        </div>
                    </div>

                    {/* Progress Timer */}
                    <div className="mb-10">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                            <Clock className="w-4 h-4 animate-spin-slow" />
                            <span>Redirection vers login dans</span>
                        </div>
                        <div className="w-full bg-gray-200/50 backdrop-blur-sm rounded-2xl h-3 shadow-inner overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 rounded-2xl shadow-lg animate-countdown transition-all duration-1000" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        <Link
                            href="/verify-email"
                            className="w-full group block py-5 px-10 bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 rounded-3xl font-bold text-lg text-white shadow-2xl hover:shadow-3xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-3 backdrop-blur-sm"
                        >
                            <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            {getActionText()}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </Link>

                        <Link
                            href="/login"
                            className="w-full py-4 px-8 bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-gray-200 text-gray-800 font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:bg-white hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Retour connexion
                        </Link>
                    </div>

                    {/* Support Stats */}
                    <div className="pt-10 border-t border-red-100/50 grid grid-cols-2 gap-6 text-sm">
                        <div className="flex items-center gap-2 text-emerald-700 font-semibold bg-emerald-100/60 p-4 rounded-xl backdrop-blur-sm">
                            <FileText className="w-4 h-4" />
                            <span>24/7 support</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-700 font-semibold bg-blue-100/60 p-4 rounded-xl backdrop-blur-sm">
                            <Users className="w-4 h-4" />
                            <span>247k utilisateurs</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-8 mt-8 border-t border-gray-100/50 text-center">
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-200/50 rounded-2xl backdrop-blur-sm text-emerald-700 font-semibold text-sm">
                            <Award className="w-4 h-4" />
                            Édition Pro • Entreprise 2026
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                            Problème persistant ? contact@comptable.ai • +237 6XX XXX XXX
                        </p>
                    </div>
                </div>

                {/* Custom CSS pour animations */}
                <style jsx>{`
                    @keyframes pulse-slow {
                        0%, 100% { opacity: 0.6; transform: scale(1); }
                        50% { opacity: 1; transform: scale(1.05); }
                    }
                    .animate-pulse-slow {
                        animation: pulse-slow 4s ease-in-out infinite;
                    }
                    @keyframes countdown {
                        0% { width: 100%; }
                        100% { width: 0%; }
                    }
                    .animate-countdown {
                        animation: countdown 15s linear forwards;
                    }
                    @keyframes spin-slow {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .animate-spin-slow {
                        animation: spin-slow 4s linear infinite;
                    }
                `}</style>
            </div>
        </div>
    );
}
