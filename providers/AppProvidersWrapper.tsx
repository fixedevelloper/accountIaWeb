"use client";

import React, { ReactNode } from "react";
import { SnackbarProvider } from "notistack";
import { SessionProvider } from "next-auth/react";
import AxiosInterceptorProvider from "./AxiosInterceptorProvider";

export const AppProvidersWrapper = ({ children }: { children: ReactNode }) => {
    return (
        <SessionProvider>
            <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                autoHideDuration={4000}
            >
                <AxiosInterceptorProvider /> {/* ⚠️ Avant les children */}
                {children}
            </SnackbarProvider>
        </SessionProvider>
    );
};