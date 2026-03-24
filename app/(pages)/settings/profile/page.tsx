"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

export default function ProfilePage() {

    const { data: session, update } = useSession();
    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState({
        name: session?.user?.name || "",
        phone: session?.user?.phone || ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e:any) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        setLoading(true);

        try {

            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/profile`,
                formData
            );

            enqueueSnackbar("Profil mis à jour", { variant: "success" });

            // mettre à jour la session NextAuth
            await update({
                ...session,
                user: {
                    ...session?.user,
                    name: formData.name,
                    phone: formData.phone
                }
            });

        } catch (err:any) {

            enqueueSnackbar(
                err.response?.data?.message || "Erreur lors de la mise à jour",
                { variant: "error" }
            );

        } finally {
            setLoading(false);
        }
    };

    if (!session) return <p>Chargement...</p>;

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-10">

            <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-lg">

                <h1 className="text-2xl font-bold mb-6">
                    Mon Profil
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="text-sm text-gray-500 block mb-1">
                            Nom
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-500 block mb-1">
                            Téléphone
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-500 block mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={session.user.email || ""}
                            disabled
                            className="w-full border rounded-lg p-2 bg-gray-100"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                    >
                        {loading ? "Mise à jour..." : "Mettre à jour"}
                    </button>

                </form>

            </div>

        </div>
    );
}