// app/email-success/page.tsx (SERVEUR - SANS "use client")
import { Suspense } from "react";
import ClientEmailSuccess from "./ClientEmailSuccess";

export default function EmailSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"/>
            </div>
        }>
            <ClientEmailSuccess />
        </Suspense>
    );
}