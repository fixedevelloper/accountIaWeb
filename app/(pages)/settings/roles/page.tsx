'use client'
import React, { useState } from "react"
import DataTable from "@/components/tables/DataTable"
import Modal from "@/components/ui/Modal"

// ✅ Interfaces typées
interface Role {
    id: number
    role: string
    permissions: string[]
}

interface RoleFormData {
    id: number | null
    role: string
    permissions: string[]
}

interface Column {
    label: string
    accessor: string
}

export default function RolesPage() {
    const columns: Column[] = [  // ✅ Typé
        { label: "Rôle", accessor: "role" },
        { label: "Permissions", accessor: "permissions" },
        { label: "Actions", accessor: "actions" },
    ]

    const [roles, setRoles] = useState<Role[]>([  // ✅ Typé Role[]
        { id: 1, role: "Comptable", permissions: ["Lire factures", "Créer écritures"] },
        { id: 2, role: "Auditeur", permissions: ["Lire rapports", "Vérifier écritures"] },
        { id: 3, role: "Administrateur", permissions: ["Tout"] },
    ])

    const [showModal, setShowModal] = useState<boolean>(false)  // ✅ Typé boolean
    const [editingRole, setEditingRole] = useState<Role | null>(null)  // ✅ Typé Role | null

    const openModal = (role: Role | null = null): void => {  // ✅ Typé
        setEditingRole(role)
        setShowModal(true)
    }

    const closeModal = (): void => {  // ✅ Typé
        setEditingRole(null)
        setShowModal(false)
    }

    const handleSave = (roleData: RoleFormData): void => {  // ✅ Typé RoleFormData
        if (roleData.id !== null) {
            setRoles(roles.map(r => r.id === roleData.id ? roleData as Role : r))
        } else {
            setRoles([...roles, { ...roleData, id: Date.now() } as Role])
        }
        closeModal()
    }

    const handleDelete = (id: number): void => {  // ✅ Typé
        if (confirm("Voulez-vous vraiment supprimer ce rôle ?")) {
            setRoles(roles.filter(r => r.id !== id))
        }
    }

    // ✅ data typé selon DataTable
    const data = roles.map(role => ({
        ...role,
        permissions: role.permissions.join(", "),
        actions: (
            <div className="flex gap-2">
                <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-sm"
                    onClick={() => openModal(role)}
                >
                    Modifier
                </button>
                <button
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
                    onClick={() => handleDelete(role.id)}
                >
                    Supprimer
                </button>
            </div>
        )
    }))

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">Rôles</h1>
                    <p className="text-gray-500 text-sm">
                        Gestion des rôles et permissions
                    </p>
                </div>

                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    onClick={() => openModal()}
                >
                    Ajouter un rôle
                </button>
            </div>

            {/* DataTable */}
            <div className="bg-white border rounded-xl p-6 shadow-sm">
                <DataTable columns={columns} data={data} />
            </div>

            {/* Modal */}
            {showModal && (
                <Modal onClose={closeModal}>
                    <RoleForm
                        role={editingRole}
                        onSave={handleSave}
                        onCancel={closeModal}
                    />
                </Modal>
            )}

        </div>
    )
}

// ✅ RoleForm avec props typées
interface RoleFormProps {
    role: Role | null
    onSave: (data: RoleFormData) => void
    onCancel: () => void
}

function RoleForm({ role, onSave, onCancel }: RoleFormProps) {
    const [formData, setFormData] = useState<RoleFormData>({
        role: role?.role || "",
        permissions: role?.permissions || [],
        id: role?.id || null
    })

    const allPermissions: string[] = [  // ✅ Typé
        "Lire factures",
        "Créer écritures",
        "Lire rapports",
        "Vérifier écritures",
        "Tout"
    ]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {  // ✅ Typé
        const { value, checked } = e.target
        setFormData({
            ...formData,
            permissions: checked
                ? [...formData.permissions, value as string]  // ✅ Cast string
                : formData.permissions.filter(p => p !== value)
        })
    }

    const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {  // ✅ Séparé
        setFormData({ ...formData, role: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {  // ✅ Typé
        e.preventDefault()
        onSave(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold">{role ? "Modifier le rôle" : "Ajouter un rôle"}</h2>

            <div>
                <label className="text-sm text-gray-500">Nom du rôle</label>
                <input
                    name="role"
                    type="text"  // ✅ Ajouté type
                    value={formData.role}
                    onChange={handleRoleChange}
                    className="border rounded-lg p-2 w-full"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm text-gray-500">Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                    {allPermissions.map(p => (
                        <label key={p} className="flex items-center gap-2 text-gray-600">
                            <input
                                type="checkbox"
                                value={p}
                                checked={formData.permissions.includes(p)}
                                onChange={handleChange}
                                className="accent-blue-600"
                            />
                            {p}
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onCancel} className="border px-4 py-2 rounded-lg">
                    Annuler
                </button>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    Enregistrer
                </button>
            </div>
        </form>
    )
}