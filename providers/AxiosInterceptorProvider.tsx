"use client";

import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useSnackbar } from "notistack";
import { api } from "../services/api";

const AxiosInterceptorProvider = () => {
    const { data: session } = useSession();
    const { enqueueSnackbar } = useSnackbar();

    const interceptorSet = useRef(false);
    const tokenRef = useRef<string | null>(null);

    // 🔄 Met à jour le token dès que la session change
    useEffect(() => {
        tokenRef.current = session?.user.token ?? null;
        console.log("🔐 Token updated:", tokenRef.current);
    }, [session]);

    useEffect(() => {
        if (interceptorSet.current) return;
        interceptorSet.current = true;

        // ✅ REQUEST
        api.interceptors.request.use(
            (config) => {
                const token = tokenRef.current;
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // ✅ RESPONSE
        api.interceptors.response.use(
            (response) => response,
            (error) => {
                const status = error.response?.status;
                const message =
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Erreur serveur";

                enqueueSnackbar(message, { variant: "error" });

                console.groupCollapsed(
                    `❌ [API ERROR] ${status ?? ""} ${error.config?.url}`
                );
                console.error("Response:", error.response?.data);
                console.groupEnd();

                // 🔒 Token expiré ou non autorisé
                if (status === 401) {
                    enqueueSnackbar("Session expirée, veuillez vous reconnecter.", { variant: "warning" });
                    signOut({ callbackUrl: "/" });
                }

                // 📧 Email non vérifié
                if (status === 403 && message === "email_not_verified") {
                    enqueueSnackbar("Veuillez vérifier votre email pour continuer.", { variant: "warning" });
                    window.location.href = "/auth/verify-email";
                }

                if (status === 403 && message === "company_missing") {
                    enqueueSnackbar("Créez votre entreprise pour continuer.", { variant: "info" });
                    window.location.href = "/onboarding/company";
                }

                return Promise.reject(error);
            }
        );
    }, [enqueueSnackbar]);

    return null;
};

export default AxiosInterceptorProvider;
