"use client"

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    UserRound, Mail, Lock, ShieldCheck, Zap, Award, CheckCircle2,
    AlertCircle, Eye, EyeOff, ArrowRight, Shield
} from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = useCallback((e:any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError("");
    }, [error]);

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError("Le nom est requis");
            return false;
        }
        if (!formData.email.includes("@") || !formData.email.includes(".")) {
            setError("Email invalide");
            return false;
        }
        if (formData.password.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!validateForm()) return;

        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Erreur lors de l'inscription");
                return;
            }

            setSuccess(true);
            setTimeout(() => router.push("/onboarding/company"), 2500);

        } catch (err:any) {
            setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
            console.error("Register error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50 flex items-center justify-center p-4 lg:p-5">
            <div className="max-w-lg w-full space-y-8">

                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-10 lg:p-10">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 via-emerald-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6">
                            <ShieldCheck className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-emerald-800 bg-clip-text text-transparent leading-tight mb-3">
                            ComptableAI
                        </h1>
                        <p className="text-xl text-gray-600 font-light max-w-sm mx-auto">
                            Créez votre compte en 30 secondes
                        </p>
                        <p className="text-emerald-600 font-semibold text-lg mt-1">
                            Édition Pro - Gratuit 30 jours
                        </p>
                    </div>

                    {/* Success */}
                    {success && (
                        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-2xl p-6 mb-8 shadow-lg animate-in slide-in-from-top-2">
                            <div className="flex items-center gap-4 text-emerald-800">
                                <div className="w-14 h-14 bg-emerald-100 rounded-2xl p-3 flex-shrink-0 animate-pulse">
                                    <CheckCircle2 className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-1">Compte créé avec succès !</h3>
                                    <p className="text-lg">Redirection vers la connexion dans 2s...</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-5 mb-8 shadow-lg animate-in slide-in-from-top-2">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-red-800 font-medium leading-relaxed text-lg">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <UserRound className="w-4 h-4 text-blue-600" />
                                Nom complet
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={loading}
                                maxLength={100}
                                className={`
                                    w-full px-5 py-4 pl-12 rounded-2xl border-2 font-semibold text-lg transition-all duration-300
                                    bg-white/60 backdrop-blur-sm shadow-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
                                    hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed
                                    ${error ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}
                                `}
                                placeholder="Jean Dupont"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-emerald-600" />
                                Email professionnel
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                                className={`
                                    w-full px-5 py-4 pl-12 pr-14 rounded-2xl border-2 font-semibold text-lg transition-all duration-300
                                    bg-white/60 backdrop-blur-sm shadow-lg focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500
                                    hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed
                                    ${error ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}
                                `}
                                placeholder="contact@entreprise.cm"
                                required
                            />
                            <div className="absolute right-4 top-[3.4rem] text-gray-400 pointer-events-none">
                                <Shield className="w-5 h-5" />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-purple-600" />
                                Mot de passe (8+ caractères)
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                    minLength={8}
                                    className={`
                                        w-full px-5 py-4 pl-12 pr-14 rounded-2xl border-2 font-semibold text-lg transition-all duration-300
                                        bg-white/60 backdrop-blur-sm shadow-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500
                                        hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed
                                        ${error ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}
                                    `}
                                    placeholder="••••••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-orange-600" />
                                Confirmer le mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className={`
                                        w-full px-5 py-4 pl-12 pr-14 rounded-2xl border-2 font-semibold text-lg transition-all duration-300
                                        bg-white/60 backdrop-blur-sm shadow-lg focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500
                                        hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed
                                        ${error ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}
                                    `}
                                    placeholder="••••••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                                    disabled={loading}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || success}
                            className={`
                                w-full group relative py-5 px-10 rounded-3xl font-black text-xl shadow-2xl
                                transition-all duration-500 overflow-hidden flex items-center justify-center gap-3
                                ${loading || success
                                ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed shadow-none text-gray-300'
                                : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white hover:shadow-3xl hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98]'
                            }
                            `}
                        >
                            {loading ? (
                                <>
                                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Création du compte...
                                </>
                            ) : success ? (
                                <>
                                    <CheckCircle2 className="w-6 h-6 animate-pulse" />
                                    Compte créé !
                                </>
                            ) : (
                                <>
                                    <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    Créer mon compte
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="pt-8 border-t border-gray-100/50 text-center space-y-2">
                        <p className="text-sm text-gray-600">
                            Déjà un compte ?{" "}
                            <Link
                                href="/"
                                className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-all font-medium"
                            >
                                Connectez-vous immédiatement
                            </Link>
                        </p>
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-100/50 rounded-2xl px-4 py-2">
                            <Award className="w-3 h-3" />
                            <span>30 jours gratuit • Édition Pro Entreprise 2026</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
