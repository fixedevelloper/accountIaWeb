"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {
    Building2, MapPin, DollarSign, Mail, ShieldCheck, Zap,
    CheckCircle2, AlertCircle, ArrowRight, Award, Users
} from "lucide-react";

const countries = [
    { value: "CG", label: "Congo 🇨🇬", currency: "XAF" },
    { value: "CM", label: "Cameroun 🇨🇲", currency: "XAF" },
    { value: "CD", label: "RDC 🇨🇩", currency: "CDF" },
    { value: "GA", label: "Gabon 🇬🇦", currency: "XAF" },
    { value: "TD", label: "Tchad 🇹🇩", currency: "XAF" },
    { value: "SN", label: "Sénégal 🇸🇳", currency: "XOF" },
    { value: "CI", label: "Côte d'Ivoire 🇨🇮", currency: "XOF" },
    { value: "TG", label: "Togo 🇹🇬", currency: "XOF" }
];

export default function CreateCompany() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        country: "CM",
        currency: "XAF",
        email: "",
        address: "",
        city: "Douala",
        rccm: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Récupérer email depuis localStorage
    useEffect(() => {
        const storedEmail = localStorage.getItem("company_email");
        if (storedEmail && !formData.email) {
            setFormData(prev => ({ ...prev, email: storedEmail }));
        }
    }, []);

    // Redirection si entreprise existe déjà
    useEffect(() => {
        if (status === "authenticated" && session?.user?.company) {
            router.push("/dashboard");
        }
        console.log(formData.email)
    }, [session, status, router]);

    const handleChange = useCallback((e:any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    }, []);

    const handleCountryChange = useCallback((e:any) => {
        const value = e.target.value;
        const selectedCountry = countries.find(c => c.value === value);
        setFormData(prev => ({
            ...prev,
            country: value,
            currency: selectedCountry?.currency || "XAF"
        }));
        setError("");
    }, []);

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!formData.name.trim()) {
            setError("Le nom de l'entreprise est requis");
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/companies`,
                formData
            );

            localStorage.removeItem("company_email");
            setSuccess(true);

            setTimeout(() => {
                router.push("/");
            }, 2000);

        } catch (err:any) {
            const message = err.response?.data?.message ||
                "Erreur lors de la création de l'entreprise. RCCM requis au CFCE.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
                <div className="animate-spin rounded-xl h-12 w-12 border-b-2 border-emerald-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50 flex items-center justify-center p-4 lg:p-8">
            <div className="max-w-lg w-full space-y-8">

                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-10 lg:p-12">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-emerald-500 via-emerald-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6">
                            <Building2 className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-emerald-800 bg-clip-text text-transparent leading-tight mb-4">
                            Créer votre entreprise
                        </h1>
                        <p className="text-xl text-gray-600 font-light max-w-md mx-auto">
                            Configurez votre entreprise en 2 minutes - CFCE ready
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-emerald-600 font-semibold bg-emerald-100/50 px-4 py-2 rounded-2xl">
                            <Award className="w-4 h-4" />
                            Édition Pro • XAF 51 500 RCCM
                        </div>
                    </div>

                    {/* Success */}
                    {success && (
                        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-2xl p-8 mb-8 shadow-2xl animate-in slide-in-from-top-2">
                            <div className="flex items-center gap-4 text-emerald-800">
                                <div className="w-16 h-16 bg-emerald-100 rounded-3xl p-4 shadow-lg animate-bounce">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-2xl mb-2">Entreprise créée !</h3>
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
                                <div>
                                    <h4 className="font-bold text-lg text-red-900 mb-2">{error}</h4>
                                    <p className="text-red-800 text-sm">Vérifiez au CFCE Douala/Yaoundé pour RCCM</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Nom entreprise */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-emerald-600" />
                                Nom de l'entreprise
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={loading}
                                maxLength={100}
                                className={`
                                    w-full px-5 py-4 pl-12 rounded-2xl border-2 font-semibold text-lg transition-all
                                    bg-white/60 backdrop-blur-sm shadow-lg focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500
                                    hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed
                                    ${error ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}
                                `}
                                placeholder="Dupont SARL • RCCM Douala"
                                required
                            />
                        </div>

                        {/* Pays */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                Pays d'immatriculation
                            </label>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleCountryChange}
                                disabled={loading}
                                className={`
                                    w-full px-5 py-4 pl-12 pr-10 rounded-2xl border-2 font-semibold text-lg transition-all
                                    bg-white/60 backdrop-blur-sm shadow-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
                                    hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed
                                    ${error ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}
                                `}
                            >
                                {countries.map(country => (
                                    <option key={country.value} value={country.value}>
                                        {country.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Devise */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-purple-600" />
                                    Devise
                                </label>
                                <input
                                    type="text"
                                    name="currency"
                                    value={formData.currency}
                                    disabled
                                    className="w-full px-5 py-4 pl-12 rounded-2xl border-2 bg-emerald-50/80 border-emerald-200 font-bold text-lg text-emerald-800 shadow-inner cursor-not-allowed"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-orange-600" />
                                    Email contact
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={true}
                                    className={`
                                        w-full px-5 py-4 pl-12 rounded-2xl border-2 font-semibold text-lg transition-all
                                        bg-white/60 backdrop-blur-sm shadow-lg focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500
                                        hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed
                                        ${error ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}
                                    `}
                                    placeholder={formData.email}
                                />
                            </div>
                        </div>

                        {/* Champs Cameroun */}
                        {formData.country === "CM" && (
                            <div className="p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-100 space-y-4">
                                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                    CFCE Cameroun (72h)
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Ville</label>
                                        <select
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 bg-white"
                                        >
                                            <option>Douala</option>
                                            <option>Yaoundé</option>
                                            <option>Bafoussam</option>
                                            <option>Garoua</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Adresse</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 bg-white"
                                            placeholder="Bonanjo, Rue XYZ"
                                        />
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 bg-white/50 p-3 rounded-xl border">
                                    💡 Après création: RCCM 51 500 XAF au CFCE • Capital SARL ≥ 100 000 XAF
                                </div>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || success}
                            className={`
                                w-full group relative py-6 px-12 rounded-3xl font-black text-xl shadow-2xl
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
                                    Création en cours...
                                </>
                            ) : success ? (
                                <>
                                    <CheckCircle2 className="w-7 h-7 animate-pulse" />
                                    Entreprise créée !
                                </>
                            ) : (
                                <>
                                    <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    Créer mon entreprise
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="pt-8 border-t border-gray-100/50 text-center space-y-2">
                        <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 font-semibold bg-emerald-100/50 px-6 py-3 rounded-2xl">
                            <Users className="w-4 h-4" />
                            247 000+ entreprises camerounaises
                        </div>
                        <p className="text-xs text-gray-500">
                            Prochaines étapes: RCCM au CFCE • Immatriculation fiscale
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
