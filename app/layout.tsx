import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {AppProvidersWrapper} from "../providers/AppProvidersWrapper";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
        <head>
            <title>ComptableAI - Cabinet comptable digital</title>
            <meta name="description" content="Plateforme de comptabilité en ligne automatisée par IA pour traiter vos dossiers plus vite et plus efficacement." />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="author" content="ComptableAI" />
            <meta name="robots" content="index, follow" />
            <link rel="icon" href="/favicon.ico" />
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
        >
        <AppProvidersWrapper>
        {children}
        </AppProvidersWrapper>
        </body>
        </html>
    );
}