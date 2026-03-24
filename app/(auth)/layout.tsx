"use client"

import React, { ReactNode } from "react"
import Link from "next/link"

type AuthLayoutProps = {
    children: ReactNode
    title?: string
}

export default function Layout({ children, title }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">

            {/* Formulaire Auth */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-lg">

                    {/* Children (login/register form) */}
                    {children}

                    {/* Footer */}
                    <div className="mt-6 text-center text-gray-400 text-sm">
                        © {new Date().getFullYear()} ComptableAI. Tous droits réservés.
                    </div>

                </div>
            </div>
        </div>
    )
}