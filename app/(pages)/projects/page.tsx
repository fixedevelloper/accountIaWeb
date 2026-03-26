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
            {/* Sidebar projets */}
            <div className="w-80 bg-white/80 backdrop-blur-xl border-r border-white/50 shadow-xl flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Mes projets
                    </h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Nouveau projet
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => setSelectedProject(project)}
                            className={`group flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-blue-200 hover:bg-blue-50 hover:shadow-md backdrop-blur-sm
                                ${selectedProject?.id === project.id
                                ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200 shadow-md font-semibold text-blue-900"
                                : "hover:shadow-lg"
                            }`}
                        >
                            <div className={`w-2 h-12 rounded-full transition-colors ${selectedProject?.id === project.id ? 'bg-gradient-to-b from-blue-500 to-purple-500' : 'bg-gray-300 group-hover:bg-blue-400'}`} />
                            <Folder className={`w-6 h-6 transition-colors ${selectedProject?.id === project.id ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'}`} />
                            <span className="font-medium">{project.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat */}
            <div className="flex-1 flex flex-col p-8 bg-white/60 backdrop-blur-xl">
                {selectedProject ? (
                    <>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <Folder className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    {selectedProject.name}
                                </h2>
                                <p className="text-gray-500">Discutez avec l'IA sur ce projet</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto mb-8 space-y-6 pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                            {Array.isArray(messages) && messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex items-start gap-4 p-4 sm:p-5 rounded-2xl max-w-4xl shadow-md
    ${msg.type === "user"
                                        ? "bg-blue-50 self-end border border-blue-100 ml-auto"
                                        : "bg-white self-start border border-gray-100"
                                    }`}
                                >
                                    {/* Avatar */}
                                    <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0
      ${msg.type === "user"
                                            ? "bg-blue-600"
                                            : "bg-emerald-600"
                                        }`}
                                    >
                                        {msg.type === "user" ? (
                                            <User className="w-5 h-5 text-white" />
                                        ) : (
                                            <Cpu className="w-5 h-5 text-white" />
                                        )}
                                    </div>

                                    {/* Message */}
                                    <div className="flex-1">
                                        {msg.type === "user" ? (
                                            // 🔵 USER – texte simple mais propre
                                            <p className="text-base leading-relaxed text-gray-800 whitespace-pre-line">
                                                {msg.text}
                                            </p>
                                        ) : (
                                            // 🟢 AI – Markdown stylé, clean
                                            <div
                                                className="prose prose-sm max-w-none text-gray-800 prose-p:leading-relaxed prose-strong:font-medium
          prose-headings:text-gray-900
          prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-700
          prose-blockquote:italic prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-3 prose-blockquote:ml-0
          prose-code:rounded-md prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm
          prose-pre:bg-gray-50 prose-pre:rounded-lg prose-pre:p-3 prose-pre:overflow-x-auto
          prose-table:border-collapse prose-th:border prose-th:bg-gray-50 prose-th:p-2 prose-td:border prose-td:p-2 prose-table:w-full prose-table:text-sm prose-th:text-left"
                                            >
                                               {/* <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        // Paragraph
                                                        p: ({ children }) => (
                                                            <p className="text-gray-700 leading-relaxed mb-3">{children}</p>
                                                        ),

                                                        // Headings
                                                        h1: ({ children }) => (
                                                            <h1 className="text-xl font-bold text-gray-900 mt-6 mb-3">{children}</h1>
                                                        ),
                                                        h2: ({ children }) => (
                                                            <h2 className="text-lg font-bold text-gray-800 mt-5 mb-2">{children}</h2>
                                                        ),
                                                        h3: ({ children }) => (
                                                            <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">{children}</h3>
                                                        ),

                                                        // Lists
                                                        ul: ({ children }) => (
                                                            <ul className="list-disc pl-5 space-y-1 text-gray-700">{children}</ul>
                                                        ),
                                                        ol: ({ children }) => (
                                                            <ol className="list-decimal pl-5 space-y-1 text-gray-700">{children}</ol>
                                                        ),
                                                        li: ({ children }) => (
                                                            <li className="leading-relaxed">{children}</li>
                                                        ),

                                                        // Code blocks
                                                        code: ({ inline, className, children, ...props }: CodeProps) => {
                                                            // TypeScript sait maintenant que `inline` peut exister
                                                            const isInline = Boolean(inline); // ou laisse comme `inline`
                                                            if (isInline) {
                                                                return (
                                                                    <code
                                                                        className="bg-gray-100 text-sm px-1.5 py-0.5 rounded-md text-gray-800"
                                                                        {...props}
                                                                    >
                                                                        {children}
                                                                    </code>
                                                                );
                                                            }
                                                            return (
                                                                <code
                                                                    className="block bg-gray-50 text-sm p-3 rounded-lg overflow-x-auto border border-gray-200 text-gray-800"
                                                                    {...props}
                                                                >
                                                                    {children}
                                                                </code>
                                                            );
                                                        },

                                                        // Tables
                                                        table: ({ children }) => (
                                                            <table className="w-full border-collapse border border-gray-200 text-sm my-4">{children}</table>
                                                        ),
                                                        th: ({ children }) => (
                                                            <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left text-gray-800 font-semibold">
                                                                {children}
                                                            </th>
                                                        ),
                                                        td: ({ children }) => (
                                                            <td className="border border-gray-200 px-3 py-2 text-gray-700">{children}</td>
                                                        ),

                                                        // Blockquote
                                                        blockquote: ({ children }) => (
                                                            <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-600 my-3">
                                                                {children}
                                                            </blockquote>
                                                        ),

                                                        // Links
                                                        a: ({ href, children }) => (
                                                            <a
                                                                href={href}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 underline hover:text-blue-700"
                                                            >
                                                                {children}
                                                            </a>
                                                        ),
                                                    }}
                                                >
                                                    {msg.text}
                                                </ReactMarkdown>*/}
                                                <MarkdownRenderer
                                                    content={msg.text}
                                                    className="text-gray-800 prose prose-sm max-w-none prose prose-sm max-w-none text-gray-800 prose-p:leading-relaxed prose-strong:font-medium
          prose-headings:text-gray-900
          prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-700
          prose-blockquote:italic prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-3 prose-blockquote:ml-0
          prose-code:rounded-md prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm
          prose-pre:bg-gray-50 prose-pre:rounded-lg prose-pre:p-3 prose-pre:overflow-x-auto
          prose-table:border-collapse prose-th:border prose-th:bg-gray-50 prose-th:p-2 prose-td:border prose-td:p-2 prose-table:w-full prose-table:text-sm prose-th:text-left"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex items-start gap-4 p-6">
                                    <div className="w-12 h-12 bg-emerald-500/90 rounded-2xl flex items-center justify-center shadow-md animate-pulse">
                                        <Cpu className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="bg-emerald-500/10 rounded-2xl p-4 animate-pulse">
                                        <div className="h-4 bg-emerald-300/50 rounded w-64"/>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="flex gap-3 p-4 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Posez votre question à l'IA..."
                                className="flex-1 bg-white/50 border-2 border-gray-200/50 rounded-2xl p-4 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 transition-all duration-200 placeholder-gray-500 text-lg"
                                disabled={loading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-200 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                            >
                                <Cpu className="w-5 h-5" />
                                Envoyer
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <Folder className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-gray-500 mb-2">Aucun projet sélectionné</h3>
                            <p className="text-gray-400 mb-8 max-w-md">
                                Cliquez sur un projet à gauche ou créez-en un nouveau pour commencer à discuter avec l'IA.
                            </p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-200 font-semibold mx-auto"
                            >
                                <Plus className="w-5 h-5" />
                                Créer mon premier projet
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Ajout Projet */}
            {showAddModal && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-md w-full border border-white/50 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    Nouveau projet
                                </h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-2xl transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Type de project</label>
                                    <select
                                        value={newProjectType}
                                        onChange={(e) => setNewProjectType(e.target.value as ProjectType)}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
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
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du projet</label>
                                    <input
                                        id="new-project-name"
                                        type="text"
                                        value={newProjectName}
                                        onChange={(e) => setNewProjectName(e.target.value)}
                                        placeholder="Ex: Mon app e-commerce"
                                        className="w-full border-2 border-gray-200 rounded-2xl p-4 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 transition-all text-lg"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={addProject}
                                        disabled={!newProjectName.trim()}
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-2xl hover:from-blue-600 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all font-semibold disabled:opacity-50"
                                    >
                                        Créer le projet
                                    </button>
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="px-8 py-4 text-gray-600 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all font-medium"
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