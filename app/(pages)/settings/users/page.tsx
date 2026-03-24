'use client'
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import DataTable from "@/components/tables/DataTable"
import Modal from "@/components/ui/Modal"

// ✅ Interfaces (user?: UserFormData au lieu de User)
interface User {
    id: number;
    name: string;
    email: string;
    role: "Comptable" | "Auditeur" | "Administrateur";
    status: "Actif" | "Inactif";
}

interface UserFormData {
    id?: number | null;
    name: string;
    email: string;
    role: User["role"];
    status: User["status"];
}

interface Column {
    label: string;
    accessor: string;
}

interface UserFormProps {
    user?: UserFormData | null;  // ✅ | null accepté
    onSave: (userData: UserFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

// ✅ Fetchers SWRMutation CORRIGÉS
const createUserFetcher = async (_url: string, { arg }: { arg: UserFormData }) => {
    const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg)
    });
    if (!res.ok) throw new Error('Erreur création');
    return res.json();
};

const updateUserFetcher = async (_url: string, { arg }: { arg: UserFormData }) => {
    const res = await fetch(`/api/users/${arg.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg)
    });
    if (!res.ok) throw new Error('Erreur mise à jour');
    return res.json();
};

const deleteUserFetcher = async (_url: string, { arg }: { arg: number }) => {
    const res = await fetch(`/api/users/${arg}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erreur suppression');
};

export default function UsersPage() {
    const router = useRouter();

    const { data: users = [], error, isLoading, mutate } = useSWR<User[]>('/api/users', fetcher);

    // ✅ useSWRMutation CORRIGÉS - URL fixe, arg dans trigger
    const { trigger: createUser, isMutating: creating } = useSWRMutation('/api/users', createUserFetcher);
    const { trigger: updateUser, isMutating: updating } = useSWRMutation('/api/users', updateUserFetcher);
    const { trigger: deleteUser, isMutating: deleting } = useSWRMutation('/api/users', deleteUserFetcher);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<UserFormData | null>(null);

    const columns: Column[] = [
        { label: "Nom", accessor: "name" },
        { label: "Email", accessor: "email" },
        { label: "Rôle", accessor: "role" },
        { label: "Statut", accessor: "status" },
        { label: "Actions", accessor: "actions" },
    ];

    const openModal = (user: UserFormData | null = null): void => {
        setEditingUser(user);
        setShowModal(true);
    };

    const closeModal = (): void => {
        setEditingUser(null);
        setShowModal(false);
    };

    // ✅ handleSave CORRIGÉ
    const handleSave = async (userData: UserFormData): Promise<void> => {
        try {
            if (userData.id !== undefined && userData.id !== null) {
                await updateUser(userData);  // ✅ Seulement les données
            } else {
                await createUser(userData);  // ✅ Seulement les données
            }
            await mutate();
            closeModal();
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
            alert('Erreur lors de la sauvegarde');
        }
    };

    // ✅ handleDelete CORRIGÉ
    const handleDelete = async (id: number): Promise<void> => {
        if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
            try {
                await deleteUser(id);  // ✅ Seulement l'ID
                await mutate();
            } catch (error) {
                console.error('Erreur suppression:', error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    const data = users.map(user => ({
        ...user,
        actions: (
            <div className="flex gap-2">
                <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-sm"
                    onClick={() => openModal(user)}
                    disabled={deleting}
                >
                    Modifier
                </button>
                <button
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
                    onClick={() => handleDelete(user.id)}
                    disabled={deleting}
                >
                    Supprimer
                </button>
            </div>
        )
    }));

    if (error) return <div className="p-8 text-center text-red-600">Erreur chargement utilisateurs</div>;
    if (isLoading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header - reste identique */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">Utilisateurs</h1>
                    <p className="text-gray-500 text-sm">
                        Gestion des utilisateurs du cabinet ({users.length})
                    </p>
                </div>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    onClick={() => openModal()}
                    disabled={creating}
                >
                    Ajouter un utilisateur
                </button>
            </div>

            <div className="bg-white border rounded-xl p-6 shadow-sm">
                <DataTable columns={columns} data={data} />
            </div>

            {showModal && (
                <Modal onClose={closeModal}>
                    <UserForm
                        user={editingUser}
                        onSave={handleSave}
                        onCancel={closeModal}
                        isLoading={creating || updating}
                    />
                </Modal>
            )}
        </div>
    )
}

// ✅ UserForm reste identique
function UserForm({ user, onSave, onCancel, isLoading = false }: UserFormProps) {
    const [formData, setFormData] = useState<UserFormData>({
        name: user?.name || "",
        email: user?.email || "",
        role: user?.role || "Comptable",
        status: user?.status || "Actif",
        id: user?.id || null
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value } as UserFormData);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        await onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold">{user ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</h2>

            <div>
                <label className="text-sm text-gray-500">Nom</label>
                <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                    required
                    disabled={isLoading}
                />
            </div>

            <div>
                <label className="text-sm text-gray-500">Email</label>
                <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                    required
                    disabled={isLoading}
                />
            </div>

            <div>
                <label className="text-sm text-gray-500">Rôle</label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                    disabled={isLoading}
                >
                    <option value="Comptable">Comptable</option>
                    <option value="Auditeur">Auditeur</option>
                    <option value="Administrateur">Administrateur</option>
                </select>
            </div>

            <div>
                <label className="text-sm text-gray-500">Statut</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                    disabled={isLoading}
                >
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="border px-4 py-2 rounded-lg disabled:opacity-50"
                    disabled={isLoading}
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? "Sauvegarde..." : "Enregistrer"}
                </button>
            </div>
        </form>
    );
}

// ✅ API Fetchers
async function createFetcher(url: string, { arg }: { arg: { userData: UserFormData } }) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg.userData)
    });
    if (!res.ok) throw new Error('Erreur création');
    return res.json();
}

async function updateFetcher(url: string, { arg }: { arg: { userData: UserFormData } }) {
    const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg.userData)
    });
    if (!res.ok) throw new Error('Erreur mise à jour');
    return res.json();
}

async function deleteFetcher(url: string) {
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erreur suppression');
}