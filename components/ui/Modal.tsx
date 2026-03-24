import React from "react"
import { XMarkIcon } from "@heroicons/react/24/solid"

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            ></div>

            {/* Modal content */}
            <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4 p-6 z-10">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>

                {/* Children */}
                {children}

            </div>
        </div>
    );
}