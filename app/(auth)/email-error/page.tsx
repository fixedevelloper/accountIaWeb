// app/email-error/page.tsx (SERVEUR - PAS "use client")
import { Suspense } from "react";
import ClientEmailError from "./ClientEmailError";

export default function EmailErrorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"/>
            </div>
        }>
            <ClientEmailError />
        </Suspense>
    );
}