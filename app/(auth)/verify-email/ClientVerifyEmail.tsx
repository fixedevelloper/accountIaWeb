"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    Mail, CheckCircle2, AlertCircle, RefreshCw, Eye, ShieldCheck,
    Zap, ArrowRight, Clock, Award
} from "lucide-react";
import {api} from "../../../services/api";

export default function VerifyEmail() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [editing, setEditing] = useState(false);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const userId = searchParams.get("id");
    const hash = searchParams.get("hash");

    // Récupérer email depuis localStorage
    useEffect(() => {
        const storedEmail = localStorage.getItem("unverified_email");
        if (storedEmail && !email) {
            setEmail(storedEmail);
        }
    }, [email]);

    // Vérification automatique du lien
    useEffect(() => {
        if (userId && hash) {
            verifyEmail(userId, hash);
        }
    }, [userId, hash]);

    const verifyEmail = useCallback(async (id:string, hash:string) => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, hash }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Lien invalide ou expiré');
            }

            setVerified(true);
            setSuccess("Email vérifié avec succès ! Redirection...");
            localStorage.removeItem("unverified_email");

            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);

        } catch (err:any) {
            setError(err.message || "Erreur de vérification");
            console.error("Verify email error:", err);
        } finally {
            setLoading(false);
        }
    }, [router]);

    const handleResend = useCallback(async () => {
        if (!email) {
            setError("Aucun email à vérifier");
            return;
        }

        try {
            setResendLoading(true);
            setError("");

            await api.post("/auth/resend-verification", { email });
            setSuccess("Nouveau lien envoyé ! Vérifiez votre boîte de réception.");

            setTimeout(() => setSuccess(""), 5000);
        } catch (err:any) {
            setError(err.response?.data?.message || "Erreur lors de l'envoi");
        } finally {
            setResendLoading(false);
        }
    }, [email]);

    const handleChangeEmail = () => {
        setEditing(true);
        setError("");
        setSuccess("");
    };

    const handleSaveEmail = async () => {
        if (!newEmail || !newEmail.includes("@")) {
            setError("Email invalide");
            return;
        }

        try {
            setUpdateLoading(true);
            setError("");

            await api.post("/auth/update-email", {
                email,
                new_email: newEmail
            });

            setSuccess("Email mis à jour ! Nouveau lien envoyé.");
            setEditing(false);

            setTimeout(() => {
                signOut({ callbackUrl: "/" });
            }, 2000);

        } catch (err:any) {
            setError(err.response?.data?.message || "Erreur mise à jour email");
        } finally {
            setUpdateLoading(false);
        }
    };

    const formatEmail = (email:string) => {
        return email.replace(/(.{2}).+@(.{3}).(.+)/, "$1***@$2***.$3");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50 flex items-center justify-center p-4 lg:p-8">
            <div className="max-w-md w-full space-y-8">

                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-10 lg:p-12 text-center">

                    {/* Header */}
                    <div className="mb-10">
                        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-emerald-500 via-emerald-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6">
                            <Mail className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-emerald-800 bg-clip-text text-transparent leading-tight mb-4">
                            Vérification Email
                        </h1>
                        <p className="text-xl text-gray-600 font-light max-w-sm mx-auto">
                            Confirmez votre email pour accéder à ComptableAI
                        </p>
                    </div>

                    {/* Verified Success */}
                    {verified && (
                        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-2xl p-8 mb-8 shadow-2xl animate-in slide-in-from-top-2">
                            <div className="flex flex-col items-center gap-4 text-emerald-800">
                                <div className="w-20 h-20 bg-emerald-100 rounded-3xl p-5 shadow-xl animate-bounce">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-2xl mb-2">Email vérifié !</h3>
                                    <p className="text-lg">Redirection vers votre dashboard...</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-6 mb-8 shadow-xl animate-in slide-in-from-top-2">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                                <div className="text-left">
                                    <h4 className="font-bold text-lg text-red-900 mb-2">{error}</h4>
                                    <p className="text-red-800 text-sm">Le lien peut être expiré (24h max)</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success message */}
                    {success && (
                        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-2xl p-6 mb-8 shadow-lg animate-in slide-in-from-top-2">
                            <div className="flex items-center gap-3 text-emerald-800">
                                <CheckCircle2 className="w-6 h-6 animate-pulse" />
                                <p className="font-medium">{success}</p>
                            </div>
                        </div>
                    )}

                    {/* Email Display / Edit */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 border border-gray-200 rounded-2xl p-6 mb-8 backdrop-blur-sm">
                        {editing ? (
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    disabled={updateLoading}
                                    placeholder="nouveau@entreprise.cm"
                                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSaveEmail}
                                        disabled={updateLoading || !newEmail}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {updateLoading ? (
                                            <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
                                        ) : (
                                            "Enregistrer"
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditing(false);
                                            setNewEmail("");
                                            setError("");
                                        }}
                                        className="px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all font-medium"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-3 p-4">
                                <Mail className="w-6 h-6 text-blue-500 flex-shrink-0" />
                                <span className="text-lg font-semibold text-gray-800 min-w-0 truncate max-w-[250px] sm:max-w-none">
                                    {email || "Aucun email"}
                                </span>
                                <button
                                    onClick={handleChangeEmail}
                                    disabled={loading || verified}
                                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium hover:underline text-sm disabled:opacity-50"
                                >
                                    Modifier
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        <button
                            onClick={handleResend}
                            disabled={resendLoading || loading || verified}
                            className={`
                                w-full group py-5 px-8 rounded-3xl font-bold text-lg shadow-2xl
                                transition-all duration-500 flex items-center justify-center gap-3
                                ${resendLoading || loading || verified
                                ? 'bg-gray-300 cursor-not-allowed shadow-none text-gray-500'
                                : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white hover:shadow-3xl hover:scale-[1.02] hover:-translate-y-1'
                            }
                            `}
                        >
                            {resendLoading ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    Envoi en cours...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Renvoyer le lien (24h)
                                    <Clock className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            disabled={loading}
                            className="w-full py-4 px-8 bg-gradient-to-r from-slate-100 to-gray-100 border border-gray-200 text-gray-800 font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:bg-gray-50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
                        >
                            <ArrowRight className="w-5 h-5 inline mr-2 rotate-180" />
                            Me connecter après vérification
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="pt-8 border-t border-gray-100/50 text-center space-y-2">
                        <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 font-semibold bg-emerald-100/50 px-4 py-2 rounded-xl">
                            <Award className="w-4 h-4" />
                            Édition Pro • OHADA 2026
                        </div>
                        <p className="text-xs text-gray-500">
                            Vérifiez spam • Gmail/Outlook/Yahoo • 24h validité
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
