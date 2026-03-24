"use client"
import {useEffect, useRef, useState} from "react"
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import {
    Menu, X, Search, Bell, ChevronDown, User, Settings, LogOut,
    Users, FileText, BarChart3, Calendar
} from "lucide-react";

interface HeaderProps {
    toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
    const { data: session, status } = useSession();
    const user = session?.user;
    const [openProfile, setOpenProfile] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [notifications, setNotifications] = useState(3);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenProfile(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Animate search on focus
    const handleSearchFocus = () => {
        setSearchQuery("");
    };

    return (
        <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100/50 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">

                    {/* Left: Mobile menu + Brand */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 text-gray-700 hover:text-gray-900 hover:shadow-md"
                            aria-label="Ouvrir menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-2 rounded-2xl shadow-lg">
                            <FileText className="w-5 h-5" />
                            <span className="font-bold text-sm tracking-tight">ComptableAI</span>
                        </div>
                    </div>

                    {/* Center: Search */}
                    <div className="flex-1 max-w-md mx-8 hidden md:flex">
                        <div className="relative w-full group">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={handleSearchFocus}
                                placeholder="Rechercher factures, clients, rapports..."
                                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl
                                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                         focus:bg-white transition-all duration-200 shadow-sm
                                         placeholder-gray-500 text-sm font-medium"
                            />
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 lg:gap-3 relative" ref={menuRef}>

                        {/* Notifications */}
                        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group">
                            <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                            {notifications > 0 && (
                                <span className="absolute -top-1 -right-1 block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow-lg ring-2 ring-white">
                                    {notifications}
                                </span>
                            )}
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="p-4 border-b border-gray-100">
                                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <Bell className="w-4 h-4" />
                                        Notifications
                                    </h4>
                                </div>
                                <div className="py-2 max-h-64 overflow-y-auto">
                                    <div className="p-4 text-sm border-b border-gray-50 hover:bg-gray-50">
                                        Nouvelle facture MTN Mobile Money détectée
                                    </div>
                                    <div className="p-4 text-sm text-gray-600 hover:bg-gray-50">
                                        Balance comptable équilibrée ✅
                                    </div>
                                </div>
                            </div>
                        </button>

                        {/* Profile Menu */}
                        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer relative group/profile"
                             onClick={() => setOpenProfile(!openProfile)}>

                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-11 h-11 overflow-hidden rounded-2xl border-2 border-gray-200/50 bg-gradient-to-br from-gray-100 to-gray-200 shadow-md ring-2 ring-transparent">
                                    {user?.image ? (
                                        <img
                                            src={user.image}
                                            alt="Profile"
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                                            <User className="w-6 h-6 text-white font-semibold" />
                                        </div>
                                    )}
                                </div>

                                {/* Online status */}
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full shadow-lg ring-2 ring-white/50 animate-pulse" />
                            </div>

                            {/* User Info */}
                            <div className="hidden lg:block min-w-0 flex-1 pr-4">
                                <div className="flex items-center gap-1.5 group-hover/profile:text-blue-600 transition-colors">
                                    <h3 className="text-sm font-bold text-gray-900 truncate max-w-[120px]">
                                        {status === "loading" ? "Chargement..." : user?.name || "Utilisateur"}
                                    </h3>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openProfile ? 'rotate-180' : ''}`} />
                                </div>
                                <p className="text-xs text-gray-500 truncate max-w-[120px]">
                                    {user?.email || "user@comptable.ai"}
                                </p>
                            </div>
                        </div>

                        {/* Profile Dropdown */}
                        {openProfile && (
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100/50 py-2
                                          animate-in slide-in-from-top-2 duration-200 z-50">

                                {/* Profile Section */}
                                <div className="px-5 py-4 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                                            <User className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-gray-900 text-sm">
                                                {user?.name || "Utilisateur"}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user?.email || "user@comptable.ai"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="py-1">
                                    <Link
                                        href="/settings/profile"
                                        className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50/50 hover:text-blue-700 rounded-xl mx-1 transition-all duration-200"
                                        onClick={() => setOpenProfile(false)}
                                    >
                                        <User className="w-4 h-4" />
                                        Mon profil
                                    </Link>

                                    <Link
                                        href="/settings/company"
                                        className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-emerald-50/50 hover:text-emerald-700 rounded-xl mx-1 transition-all duration-200"
                                        onClick={() => setOpenProfile(false)}
                                    >
                                        <Settings className="w-4 h-4" />
                                        Paramètres entreprise
                                    </Link>

                                    <Link
                                        href="/settings/clients"
                                        className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50/50 hover:text-purple-700 rounded-xl mx-1 transition-all duration-200"
                                        onClick={() => setOpenProfile(false)}
                                    >
                                        <Users className="w-4 h-4" />
                                        Gestion clients
                                    </Link>

                                    <div className="w-full h-px bg-gradient-to-r from-gray-200 to-transparent my-1 mx-5" />

                                    <button
                                        onClick={() => {
                                            setOpenProfile(false);
                                            signOut({ callbackUrl: "/" });
                                        }}
                                        className="flex items-center gap-3 w-full px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50/50 hover:text-red-700 rounded-xl mx-1 transition-all duration-200"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Déconnexion
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
