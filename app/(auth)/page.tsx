"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
    Mail, Lock, ShieldCheck, Zap, Award, Shield, UserRound,
    ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff
} from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState<"idle" | "verifying" | "company" | "success">("idle");

    const handleChange = useCallback((e:any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
        setStatus("idle");
    }, [formData]);

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        setStatus("idle");

        const result = await signIn("credentials", {
            redirect: false,
            email: formData.email,
            password: formData.password,
        });

        setLoading(false);

        if (result?.error === "EMAIL_NOT_VERIFIED") {
            localStorage.setItem("unverified_email", formData.email);
            setStatus("verifying");
            setTimeout(() => router.push("/verify-email"), 1500);
            return;
        }

        if (result?.error === "COMPANY_MISSING") {
            localStorage.setItem("company_email", formData.email);
            setStatus("company");
            setTimeout(() => router.push("/onboarding/company"), 1500);
            return;
        }

        if (!result?.ok) {
            setError(result?.error || "Identifiants incorrects");
            setStatus("idle");
            return;
        }

        setStatus("success");
        setTimeout(() => router.push("/dashboard"), 1000);
    };

    const formatEmail = (email:any) => {
        return email.replace(/(.{3}).+@(.{3}).(.+)/, "$1****@$2***.$3");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50 flex items-center justify-center p-4 lg:p-8">
            <div className="max-w-md w-full space-y-8">

                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-10 lg:p-12">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 via-emerald-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6">
                            <ShieldCheck className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-emerald-800 bg-clip-text text-transparent leading-tight mb-3">
                            ComptableAI
                        </h1>
                        <p className="text-xl text-gray-600 font-light max-w-sm mx-auto">
                            Accès sécurisé à votre tableau de bord
                        </p>
                    </div>

                    {/* Status Messages */}
                    {status === "verifying" && (
                        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border-2 border-blue-200 rounded-2xl p-6 mb-6 animate-in slide-in-from-top-2">
                            <div className="flex items-center gap-3 text-blue-800">
                                <div className="w-12 h-12 bg-blue-100 rounded-2xl p-3 flex-shrink-0">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Email en vérification</h3>
                                    <p className="text-sm">Redirection vers la validation {formatEmail(formData.email)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {status === "company" && (
                        <div className="bg-gradient-to-r from-orange-50 to-emerald-50 border-2 border-orange-200 rounded-2xl p-6 mb-6 animate-in slide-in-from-top-2">
                            <div className="flex items-center gap-3 text-orange-800">
                                <div className="w-12 h-12 bg-orange-100 rounded-2xl p-3 flex-shrink-0">
                                    <Award className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Configuration entreprise</h3>
                                    <p className="text-sm">Création de votre entreprise {formatEmail(formData.email)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-2xl p-6 mb-6 animate-in slide-in-from-top-2">
                            <div className="flex items-center gap-3 text-emerald-800">
                                <CheckCircle2 className="w-12 h-12 bg-emerald-100 rounded-2xl p-3 flex-shrink-0 animate-pulse" />
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Connexion réussie !</h3>
                                    <p className="text-sm">Redirection vers le tableau de bord...</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-5 mb-6 shadow-lg animate-in slide-in-from-top-2">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-red-800 font-medium leading-relaxed">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-blue-600" />
                                Email professionnel
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className={`
                                        w-full px-4 py-4 pl-12 pr-16 lg:pr-20 rounded-2xl border-2 font-semibold text-lg
                                        bg-white/60 backdrop-blur-sm shadow-lg transition-all duration-300
                                        focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none
                                        disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
                                        ${error ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}
                                    `}
                                    placeholder="votre@entreprise.cm"
                                    required
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Shield className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-emerald-600" />
                                Mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className={`
                                        w-full px-4 py-4 pl-12 pr-14 lg:pr-16 rounded-2xl border-2 font-semibold text-lg
                                        bg-white/60 backdrop-blur-sm shadow-lg transition-all duration-300
                                        focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none
                                        disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
                                        ${error ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}
                                    `}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                                    disabled={loading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || status !== "idle"}
                            className={`
                                w-full group relative py-5 px-8 rounded-3xl font-black text-xl shadow-2xl
                                transition-all duration-500 overflow-hidden flex items-center justify-center gap-3
                                ${loading || status !== "idle"
                                ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed shadow-none text-gray-300'
                                : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white hover:shadow-3xl hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98]'
                            }
                            `}
                        >
                            {loading ? (
                                <>
                                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Connexion en cours...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    Accéder au Dashboard
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="pt-8 border-t border-gray-100/50">
                        <p className="text-center text-sm text-gray-600">
                            Pas encore de compte ?{" "}
                            <Link
                                href="/register"
                                className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors font-medium"
                            >
                                Créer un compte gratuit
                            </Link>
                        </p>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Édition Pro • Cameroun 2026 • Sécurisé par NextAuth
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
