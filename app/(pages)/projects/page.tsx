"use client";

import React, { useEffect, useState, useRef } from "react";
import { User, Cpu, Folder, Plus, X } from "lucide-react";
import { api } from "../../../services/api";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {MarkdownRenderer} from "../../../components/ui/MarkdownRenderer";
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

const projectTypeLabels: Record<ProjectType, string> = {
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
};
type ProjectCategory =
    | "finance"
    | "business"
    | "tech"
    | "hr"
    | "construction";

const projectCategories: Record<ProjectCategory, { label: string; types: ProjectType[] }> = {
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
};
interface Project {
    id: number;
    name: string;
    type: string;
    status: string;
}

interface Message {
    id?: number;
    user_id?: number;
    text: string;
    type: "user" | "ai";
    created_at?: string;
}

export default function ProjectDashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");
    const [newProjectType, setNewProjectType] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // Fetch projects
    const fetchProjects = async () => {
        try {
            const res = await api.get("/projects");
            setProjects(res.data);
            if (!selectedProject && res.data.length) {
                setSelectedProject(res.data[0]);
            }

        } catch (err) {
            console.error(err);
        }
    };

    // Add new project
    const addProject = async () => {
        if (!newProjectName.trim()) return;

        try {
            const res = await api.post("/projects", { name: newProjectName,type: newProjectType });
            const newProject = res.data;
            setProjects([...projects, newProject]);
            setSelectedProject(newProject);
            setShowAddModal(false);
            setNewProjectName("");
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch messages for selected project
    const fetchMessages = async (projectId: number) => {
        try {
            const res = await api.get(`/projects/${projectId}/messages`);
            console.log('Messages:', res.data.data);

            // ✅ FORCE Array
            setMessages(Array.isArray(res.data.data) ? res.data.data : []);
        } catch (err) {
            console.error(err);
            setMessages([]); // Reset safe
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchMessages(selectedProject.id);
        }
        console.log(messages)
    }, [selectedProject]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    // Send message
    const sendMessage = async () => {
        if (!input.trim() || !selectedProject) return;

        const text = input;
        const tempUserMsg = { text, type: 'user' as const }; // Local pendant loading

        setMessages((prev) => Array.isArray(prev) ? [...prev, tempUserMsg] : [tempUserMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await api.post(`/projects/${selectedProject.id}/messages`, { text });
            const { success, user_message, ai_message } = res.data || {};

            // ✅ REPLACE + ADD (safe)
            setMessages((prev) => {
                const safePrev = Array.isArray(prev) ? prev : [];
                const newMsgs: Message[] = [];

                // Remplace temp par vrai user_message
                const updated = safePrev.map(m =>
                    m.text === text && m.type === 'user' ? user_message : m
                );

                newMsgs.push(...updated);

                if (success && ai_message) {
                    newMsgs.push(ai_message);
                }

                return newMsgs;
            });

        } catch (err: any) {
            console.error(err);
            // Garde temp message si erreur
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen max-h-full bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
            {/* Sidebar (desktop) */}
            <div className="hidden md:flex md:w-80 lg:w-72 bg-white/80 backdrop-blur-xl border-r border-white/50 shadow-xl flex-col">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                    <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Mes projets
                    </h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="mt-4 flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
                    >
                        <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
                        Nouveau projet
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => setSelectedProject(project)}
                            className={`group flex items-center gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-blue-200 hover:bg-blue-50 hover:shadow-md backdrop-blur-sm
                        ${selectedProject?.id === project.id
                                ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200 shadow-md font-semibold text-blue-900"
                                : "hover:shadow-lg"
                            }`}
                        >
                            <div className={`w-2 h-8 sm:h-12 rounded-full transition-colors ${selectedProject?.id === project.id ? 'bg-gradient-to-b from-blue-500 to-purple-500' : 'bg-gray-300 group-hover:bg-blue-400'}`} />
                            <Folder
                                className={`w-5 sm:w-6 h-5 sm:h-6 transition-colors ${selectedProject?.id === project.id ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'}`}
                            />
                            <span className="text-sm sm:text-base font-medium truncate">
                        {project.name}
                    </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile header + toggle sidebar */}
            <div className="md:hidden flex-shrink-0 border-b border-gray-200 bg-white/80 backdrop-blur-xl p-4 flex items-center justify-between">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Ouvrir la liste des projets"
                >
                    <Folder className="w-5 h-5 text-gray-700" />
                </button>
                <h2 className="text-lg font-bold text-gray-800 truncate">
                    {selectedProject ? selectedProject.name : "Sélectionner projet"}
                </h2>
            </div>

            {/* Chat principal (desktop + mobile) */}
            <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-xl">
                {selectedProject ? (
                    <>
                        <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 border-b border-gray-200">
                            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <Folder className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    {selectedProject.name}
                                </h2>
                                <p className="text-sm sm:text-base text-gray-500">
                                    Discutez avec l’IA sur ce projet
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto mb-0 sm:mb-8 space-y-4 sm:space-y-6 px-2 sm:px-4 pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                            {Array.isArray(messages) &&
                            messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl max-w-4xl shadow-md
                ${msg.type === "user"
                                        ? "bg-blue-50 self-end border border-blue-100 ml-auto"
                                        : "bg-white self-start border border-gray-100"
                                    }`}
                                >
                                    <div
                                        className={`w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm flex-shrink-0
                ${msg.type === "user" ? "bg-blue-600" : "bg-emerald-600"}`}
                                    >
                                        {msg.type === "user" ? (
                                            <User className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                                        ) : (
                                            <Cpu className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        {msg.type === "user" ? (
                                            <p className="text-sm sm:text-base leading-relaxed text-gray-800 whitespace-pre-line">
                                                {msg.text}
                                            </p>
                                        ) : (
                                            <div className="text-gray-800 prose prose-sm max-w-none prose-p:leading-relaxed prose-strong:font-medium">
                                                <MarkdownRenderer content={msg.text} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex items-start gap-3 sm:gap-4 p-4">
                                    <div className="w-8 sm:w-12 h-8 sm:h-12 bg-emerald-500/90 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md animate-pulse">
                                        <Cpu className="w-4 sm:w-6 h-4 sm:h-6 text-white" />
                                    </div>
                                    <div className="bg-emerald-500/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 animate-pulse">
                                        <div className="h-3 sm:h-4 bg-emerald-300/50 rounded w-32 sm:w-64" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input zone (mobile / desktop) */}
                        <div className="p-3 sm:p-4 bg-white/80 backdrop-blur-xl rounded-t-xl sm:rounded-3xl border-t border-white/50 shadow-2xl">
                            <div className="flex gap-2 sm:gap-3 flex-col sm:flex-row">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    placeholder="Posez votre question à l’IA…"
                                    className="flex-1 bg-white/50 border border-gray-200/50 rounded-xl p-3 sm:p-4 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 transition-all placeholder-gray-500 text-base sm:text-lg"
                                    disabled={loading}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={loading || !input.trim()}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all font-semibold flex items-center gap-2 disabled:opacity-50 hover:scale-105"
                                >
                                    <Cpu className="w-4 sm:w-5 h-4 sm:h-5" />
                                    Envoyer
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center p-4">
                        <div className="text-center max-w-xs sm:max-w-md">
                            <Folder className="w-16 sm:w-24 h-16 sm:h-24 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-500 mb-2">
                                Aucun projet sélectionné
                            </h3>
                            <p className="text-sm sm:text-base text-gray-400 mb-6">
                                Créez ou sélectionnez un projet pour commencer à discuter avec l’IA.
                            </p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-2 px-4 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl sm:rounded-2xl hover:from-blue-600 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all text-sm sm:text-base font-semibold"
                            >
                                <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
                                Créer un projet
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Sidebar mobile modal */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="absolute inset-0 left-0 w-64 bg-white/95 backdrop-blur-xl shadow-xl flex flex-col">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800">Mes projets</h2>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-700" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    onClick={() => {
                                        setSelectedProject(project);
                                        setSidebarOpen(false);
                                    }}
                                    className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 border-transparent hover:border-blue-200 hover:bg-blue-50 hover:shadow-md backdrop-blur-sm
                                ${selectedProject?.id === project.id
                                        ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200 shadow-md font-semibold text-blue-900"
                                        : ""
                                    }`}
                                >
                                    <div className={`w-2 h-8 rounded-full ${selectedProject?.id === project.id ? 'bg-gradient-to-b from-blue-500 to-purple-500' : 'bg-gray-300'}`} />
                                    <Folder
                                        className={`w-5 h-5 ${selectedProject?.id === project.id ? 'text-blue-600' : 'text-gray-500'}`}
                                    />
                                    <span className="text-sm font-medium truncate">
                                {project.name}
                            </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal ajout projet (desktop + mobile) */}
            {showAddModal && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
                        onClick={() => setShowAddModal(false)}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl max-w-xs sm:max-w-md w-full border border-white/50 max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    Nouveau projet
                                </h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-xl sm:rounded-2xl transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                                        Type de projet
                                    </label>
                                    <select
                                        value={newProjectType}
                                        onChange={(e) => setNewProjectType(e.target.value as ProjectType)}
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
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                                        Nom du projet
                                    </label>
                                    <input
                                        type="text"
                                        value={newProjectName}
                                        onChange={(e) => setNewProjectName(e.target.value)}
                                        placeholder="Ex: Mon app e-commerce"
                                        className="w-full border border-gray-200 rounded-lg sm:rounded-2xl p-2 sm:p-4 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 transition-all text-sm sm:text-lg"
                                    />
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4">
                                    <button
                                        onClick={() => addProject()}
                                        disabled={!newProjectName.trim()}
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-2xl hover:from-blue-600 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all font-semibold disabled:opacity-50 flex-1"
                                    >
                                        Créer le projet
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setNewProjectName("");
                                            setNewProjectType("purchase");
                                        }}
                                        className="px-4 sm:px-8 py-2 sm:py-4 text-gray-600 border border-gray-200 rounded-lg sm:rounded-2xl hover:bg-gray-50 transition-all font-medium"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}