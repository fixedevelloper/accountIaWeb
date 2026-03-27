import {Message} from "../../types/types";
import {MarkdownRenderer} from "./MarkdownRenderer";
import React from "react";
import {Cpu, FileText, Send, User} from "lucide-react";


export const MiniChatUserOnly = ({
                                     messages,
                                     input,
                                     setInput,
                                     sendMessage,
                                     loading,
                                 }: {
    messages: Message[];
    input: string;
    setInput: (value: string) => void;
    sendMessage: () => void;
    loading: boolean;
}) => {
    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-semibold text-gray-800">
                    Chat IA Comptable
                </h2>
            </div>

            {/* TOUS les messages (user + ai) */}
            <div className="p-4 bg-gray-50/40 max-h-80 h-80 overflow-y-auto space-y-3">
                {Array.isArray(messages) && messages.length > 0 ? (
                    messages.map((msg, i) => (
                        <div
                            key={msg.id || i}
                            className={`flex items-start gap-3 p-3 rounded-xl shadow-sm border ${
                                msg.type === "user"
                                    ? "bg-white border-gray-100 ml-auto max-w-[85%]"
                                    : "bg-emerald-50/80 border-emerald-200"
                            }`}
                        >
                            {/* Avatar */}
                            <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center ${
                                msg.type === "user"
                                    ? "bg-blue-600"
                                    : "bg-emerald-500/90"
                            }`}>
                                {msg.type === "user" ? (
                                    <User className="w-4 h-4 text-white" />
                                ) : (
                                    <Cpu className="w-4 h-4 text-white" />
                                )}
                            </div>

                            {/* Contenu message */}
                            <div className={`flex-1 text-sm leading-relaxed ${msg.type === "ai" ? "text-gray-800" : "text-gray-700"}`}>
                                <MarkdownRenderer content={msg.text} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Commencez la conversation avec l'IA comptable</p>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="flex items-start gap-3 p-4">
                        <div className="w-8 h-8 bg-emerald-500/90 rounded-full flex items-center justify-center shadow-md animate-pulse flex-shrink-0">
                            <Cpu className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-emerald-500/10 rounded-xl p-3 animate-pulse flex-1">
                            <div className="h-4 bg-emerald-300/50 rounded w-3/4 mb-1" />
                            <div className="h-3 bg-emerald-300/30 rounded w-1/2" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-white/50 shadow-2xl">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
                        placeholder="Ex: 'Action 1' pour enregistrer les écritures…"
                        className="flex-1 bg-white/70 border border-gray-200/50 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 transition-all placeholder-gray-500 text-sm"
                        disabled={loading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[100px] hover:scale-[1.02]"
                    >
                        <Send className="w-4 h-4" />
                        Envoyer
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                    Actions : 1️⃣ Écritures 2️⃣ Fournisseur 3️⃣ Statut 4️⃣ TVA 5️⃣ Export
                </p>
            </div>
        </div>
    );
};