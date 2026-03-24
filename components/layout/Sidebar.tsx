"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid"
import {
    HomeIcon,
    DocumentIcon,
    CalculatorIcon,
    BanknotesIcon,
    ChartBarIcon,
    Cog6ToothIcon
} from "@heroicons/react/24/outline"
import { ChevronDown, ChevronUp, LayoutDashboard, FileText, Users, Settings, Receipt, Calendar, BarChart3, Wallet } from "lucide-react";
import React from "react";

interface SubMenuItem {
    label: string;
    href: string;
}

interface MenuItem {
    label: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    hasSubMenu: boolean;
    subMenu?: SubMenuItem[];
}

export const menuItems: MenuItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: HomeIcon, hasSubMenu: false },
    {
        label: "Documents",
        href: "/documents",
        icon: DocumentIcon,
        hasSubMenu: true,
        subMenu: [
            { label: "Toutes les factures", href: "/documents" },
            { label: "Ajouter une facture", href: "/documents/upload" },
        ]
    },
    {
        label: "Comptabilité",
        href: "/accounting",
        icon: CalculatorIcon,
        hasSubMenu: true,
        subMenu: [
            { label: "Journaux", href: "/accounting/journals" },
            { label: "Écritures", href: "/accounting/entries" },
        ]
    },
    {
        label: "Banque",
        href: "/banking",
        icon: BanknotesIcon,
        hasSubMenu: true,
        subMenu: [
            { label: "Transactions", href: "/banking/transactions" },
            { label: "Rapprochement", href: "/banking/reconcile" },
        ]
    },
    {
        label: "Rapports",
        href: "/reports",
        icon: ChartBarIcon,
        hasSubMenu: true,
        subMenu: [
            { label: "Balance", href: "/reports/trial-balance" },
            { label: "Compte de résultat", href: "/reports/income-statement" },
            { label: "Bilan", href: "/reports/balance-sheet" },
        ]
    },
    {
        label: "Paramètres",
        href: "/settings",
        icon: Cog6ToothIcon,
        hasSubMenu: true,
        subMenu: [
            { label: "Utilisateurs", href: "/settings/users" },
            { label: "Rôles", href: "/settings/roles" },
        ]
    }
];




interface SidebarProps {
    open: boolean;
    toggleSidebar: () => void;
}

export default function Sidebar({ open, toggleSidebar }: SidebarProps) {
    const [activeSubMenu, setActiveSubMenu] = useState(null);


    const handleClickParent = (item:any) => {
        if (item.hasSubMenu) {
            setActiveSubMenu(activeSubMenu === item.label ? null : item.label);
        } else if (window.innerWidth < 1024) {
            toggleSidebar();
        }
    };

    return (
        <>
            {/* Mobile overlay */}
            <div
                className={`
                    lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40
                    transition-opacity duration-300
                    ${open ? "opacity-100 visible" : "opacity-0 invisible"}
                `}
                onClick={toggleSidebar}
            />

            {/* Sidebar */}
            <aside className={`
                fixed lg:static top-0 left-0 h-full w-72 bg-gradient-to-b from-white to-gray-50/70
                backdrop-blur-xl shadow-2xl border-r border-gray-200/50
                transform -translate-x-full lg:translate-x-0
                transition-all duration-500 ease-in-out z-50
                ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                lg:border-r-gray-100
            `}>

                {/* Header */}
                <div className="p-8 pb-6 border-b border-gray-100/50 bg-gradient-to-r from-blue-600/10 to-emerald-600/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl shadow-lg">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
                                ComptableAI
                            </h1>
                            <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">
                                Édition Pro
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-2 px-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)] scrollbar-thin scrollbar-thumb-gray-300">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = activeSubMenu === item.label;
                        const isOpen = activeSubMenu === item.label;

                        return (
                            <div key={item.label} className="space-y-1">
                                {/* Parent Menu Item */}
                                <div
                                    className={`
                                        group relative p-3 rounded-2xl cursor-pointer
                                        transition-all duration-300 hover:bg-white/60 hover:shadow-md
                                        hover:-translate-x-1 border border-transparent
                                        ${isActive
                                        ? "bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200 shadow-md translate-x-0"
                                        : "hover:border-gray-200/50"
                                    }
                                    `}
                                    onClick={() => handleClickParent(item)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className={`
                                                p-2 rounded-xl transition-all duration-200
                                                ${isActive
                                                ? "bg-gradient-to-br from-blue-500 to-emerald-500 shadow-lg text-white"
                                                : "bg-gray-100/50 group-hover:bg-blue-500/10 text-gray-700 group-hover:text-blue-600"
                                            }
                                            `}>
                                                <Icon className="w-5 h-5" />
                                            </div>

                                            {item.hasSubMenu ? (
                                                <span className="font-semibold text-gray-900 min-w-0 truncate pr-2">
                                                    {item.label}
                                                </span>
                                            ) : (
                                                <Link
                                                    href={item.href}
                                                    className="flex items-center gap-3 flex-1 font-semibold text-gray-900 min-w-0 truncate pr-2 hover:text-blue-600 transition-colors"
                                                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                                >
                                                    {item.label}
                                                </Link>
                                            )}
                                        </div>

                                        {item.hasSubMenu && (
                                            <div className={`
                                                w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300
                                                ${isActive
                                                ? "bg-blue-500 text-white shadow-lg rotate-180"
                                                : "bg-gray-100/50 text-gray-500 group-hover:bg-blue-500/20 group-hover:text-blue-600"
                                            }
                                            `}>
                                                {isOpen ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Active indicator */}
                                    {isActive && (
                                        <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-blue-500 to-emerald-500 rounded-r-full shadow-lg" />
                                    )}
                                </div>

                                {/* Submenu */}
                                {item.hasSubMenu && item?.subMenu && (
                                    <div className={`
                                        overflow-hidden ml-4 pl-12 border-l-4 
                                        ${isOpen
                                        ? "border-emerald-400 bg-emerald-50/80 backdrop-blur-sm max-h-96 opacity-100 pt-3 pb-1"
                                        : "border-transparent max-h-0 opacity-0"
                                    }
                                        transition-all duration-500 ease-out
                                    `}>
                                        {item?.subMenu.map((subItem) => (
                                            <Link
                                                key={subItem.label}
                                                href={subItem.href}
                                                className={`
                                                    block py-2.5 px-4 -ml-12 pl-12 rounded-xl text-sm font-medium
                                                    bg-white/60 backdrop-blur-sm border border-white/50
                                                    hover:bg-emerald-100 hover:border-emerald-200 hover:text-emerald-800
                                                    hover:shadow-md transition-all duration-200
                                                    ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
                                                `}
                                                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                            >
                                                <span className="truncate">{subItem.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 pt-4 border-t border-gray-100/50 bg-gradient-to-t from-white/50 to-transparent">
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200/50 hover:shadow-md transition-all">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Édition Pro</p>
                            <p className="font-semibold text-gray-900 truncate">Cameroon Edition</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
