'use client'
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import type { Session } from "next-auth";  // ✅ Ajouté pour typage session

import {
    TrendingUp, TrendingDown, Activity, DollarSign, FileText, Users,
    Calendar, Receipt, BarChart3, Shield, Clock, Award
} from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    change: string;  // ✅ Changé en string pour "+18,4%"
    trend: 'up' | 'down';
    color: 'green' | 'blue';  // ✅ Union stricte
    icon: React.ComponentType<{ className?: string }>;  // ✅ Typage Lucide correct
}

interface Activity {
    title: string;
    description: string;
    time: string;
    color: string;
}

const StatsCard = ({ title, value, change, trend, color, icon: Icon }: StatsCardProps) => (
    <div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 h-full">
        <div className="flex items-start justify-between mb-6">
            <div className={`p-3 rounded-2xl shadow-lg ${color === 'green' ? 'bg-gradient-to-br from-emerald-400 to-green-500' : 'bg-gradient-to-br from-blue-500 to-indigo-500'}`}>
                <Icon className="w-6 h-6 text-white drop-shadow-md" />
            </div>
            <div className={`w-3 h-3 rounded-full ${trend === 'up' ? 'bg-emerald-400 animate-pulse shadow-lg' : 'bg-red-400 animate-pulse shadow-lg'}`} />
        </div>

        <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">{title}</p>
            <p className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {value}
                <span className="text-lg font-normal text-gray-500 ml-1">XAF</span>
            </p>
            <p className={`text-sm font-semibold flex items-center gap-1 ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                {change}
                <span>{trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}</span>
            </p>
        </div>
    </div>
);

interface RecentActivityProps {
    activities: Activity[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Activité récente
            </h3>
            <button className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors">Voir tout →</button>
        </div>

        <div className="space-y-4">
            {activities.map((activity, index) => (
                <div key={index} className="group flex items-start gap-4 p-4 hover:bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl transition-all duration-200 cursor-pointer">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${activity.color}`}>
                        <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                            <h4 className="font-semibold text-gray-900 text-sm truncate">{activity.title}</h4>
                            <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{activity.time}</span>
                        </div>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [mounted, setMounted] = useState(false);  // ✅ Typé par défaut

    useEffect(() => {
        setMounted(true);

        if (status === "authenticated" && !session?.user.company) {
            // router.push("/onboarding/company");
        }
    }, [session, status, router]);  // ✅ router ajouté aux deps

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"/>
            </div>
        );
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"/>
                    <p className="text-xl font-semibold text-gray-700">Chargement du tableau de bord...</p>
                </div>
            </div>
        );
    }

    // ✅ Données typées selon StatsCardProps
    const stats: StatsCardProps[] = [
        { title: "Revenus", value: "12 845 000", change: "+18,4%", trend: "up" as const, color: "green", icon: DollarSign },
        { title: "Dépenses", value: "8 230 000", change: "+7,2%", trend: "up" as const, color: "blue", icon: Receipt },
        { title: "Profit net", value: "4 615 000", change: "+42,1%", trend: "up" as const, color: "green", icon: TrendingUp },
        { title: "TVA due", value: "892 000", change: "-12,5%", trend: "down" as const, color: "blue", icon: Shield }
    ];

    const recentActivities: Activity[] = [  // ✅ Typé explicitement
        { title: "Facture MTN Mobile Money #F2026-045", description: "Facture fournisseur extraite par IA", time: "Il y a 2h", color: "bg-emerald-400" },
        { title: "Nouveau client Orange Cameroun", description: "Client ajouté manuellement", time: "Il y a 4h", color: "bg-blue-500" },
        { title: "Balance comptable équilibrée", description: "Tous comptes vérifiés automatiquement", time: "Il y a 6h", color: "bg-green-500" },
        { title: "Paiement reçu Ecobank", description: "Virement client confirmé", time: "Il y a 1j", color: "bg-purple-400" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50 p-6 lg:p-8 relative">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8 lg:mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-emerald-800 bg-clip-text text-transparent mb-3 leading-tight">
                                Tableau de bord
                            </h1>
                            <p className="text-xl text-gray-600 font-light max-w-2xl">
                                Suivi en temps réel de votre activité comptable - Édition Entreprise 2026
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-sm text-emerald-600 font-semibold bg-emerald-100 px-4 py-2 rounded-2xl">
                                <Award className="w-4 h-4" />
                                Pro Edition
                            </div>
                            <div className="text-xs text-gray-500">
                                23 Mars 2026
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-6 lg:gap-8 mb-10">
                    {stats.map((stat, index) => (
                        <StatsCard key={stat.title} {...stat} />
                    ))}
                </div>

                {/* Charts & Activities */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">

                    {/* Recent Activity */}
                    <div className="xl:col-span-2">
                        <RecentActivity activities={recentActivities} />
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 h-full flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Clients actifs</h3>
                                    <p className="text-purple-100 text-sm opacity-90">Ce mois</p>
                                </div>
                            </div>
                            <div className="text-4xl font-black mb-2">247</div>
                            <div className="text-sm opacity-90">+12 vs mois précédent</div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 h-full flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Factures</h3>
                                    <p className="text-orange-100 text-sm opacity-90">Traitées IA</p>
                                </div>
                            </div>
                            <div className="text-4xl font-black mb-2">1 284</div>
                            <div className="text-sm opacity-90">Taux succès 98,7%</div>
                        </div>
                    </div>
                </div>

            </div>
            {/* Bottom gradient decoration - déplacé dans le bon conteneur */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-100 to-transparent pointer-events-none" />
        </div>
    );
}