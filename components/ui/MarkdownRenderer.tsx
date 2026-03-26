// components/MarkdownRenderer.tsx
import React from "react";
import ReactMarkdown, { Options as ReactMarkdownOptions, Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// Type pour le `code` component (inline + className + props)
type CodeProps = React.PropsWithChildren<{
    inline?: boolean;
    className?: string;
}> &
    React.HTMLAttributes<HTMLElement>;

// Définition des composants Markdown stylés
const markdownComponents: Components = {
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
    code({ inline, className, children, ...props }: CodeProps) {
        const isInline = Boolean(inline);

        if (isInline) {
            return (
                <code
                    className={`bg-gray-100 text-sm px-1.5 py-0.5 rounded-md text-gray-800 ${className || ""}`}
                    {...props}
                >
                    {children}
                </code>
            );
        }

        return (
            <code
                className={`block bg-gray-50 text-sm p-3 rounded-lg overflow-x-auto border border-gray-200 text-gray-800 ${className || ""}`}
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
    a: ({ href, children, ...props }) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-700"
            {...props}
        >
            {children}
        </a>
    ),
};

// Props du composant
export type MarkdownRendererProps = {
    content: string;
    className?: string;
} & Omit<ReactMarkdownOptions, "children">;

// Composant exportable
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className, ...options }) => {
    return (
        <div className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
                {...options}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};