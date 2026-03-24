"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

export default function SettingPage() {

    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState({
        name: "",
        country: "",
        currency: "",
        email: ""
    });

    const [loading, setLoading] = useState(false);

    // charger les infos de l'entreprise
    useEffect(() => {
        fetchCompany();
    }, []);

    const fetchCompany = async () => {
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/company`
            );

            setFormData(res.data.company);

        } catch (err:any) {
            enqueueSnackbar(
                err.response?.data?.message || "Erreur chargement entreprise",
                { variant: "error" }
            );
        }
    };

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

            await axios.put(
                `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/company`,
                formData
            );

            enqueueSnackbar("Paramètres mis à jour", { variant: "success" });

        } catch (err:any) {

            enqueueSnackbar(
                err.response?.data?.message || "Erreur mise à jour",
                { variant: "error" }
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center pt-10">

            <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-xl">

                <h1 className="text-2xl font-bold mb-6">
                    Paramètres de l'entreprise
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="text-sm text-gray-500 block mb-1">
                            Nom de l'entreprise
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
                            Pays
                        </label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-500 block mb-1">
                            Devise
                        </label>
                        <input
                            type="text"
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-500 block mb-1">
                            Email de contact
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                    >
                        {loading ? "Mise à jour..." : "Enregistrer"}
                    </button>

                </form>

            </div>

        </div>
    );
}