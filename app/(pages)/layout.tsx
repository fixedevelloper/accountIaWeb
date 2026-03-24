'use client'
import React, {useState} from "react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";


export default function Layout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const [open, setOpen] = useState(false)

    const toggleSidebar = () => {
        setOpen(!open)
    }
    return (

        <div className="flex h-screen bg-gray-50">

            <Sidebar open={open} toggleSidebar={toggleSidebar} />

            <div className="flex flex-col flex-1">

                <Header toggleSidebar={toggleSidebar} />

                <main className="p-6 overflow-y-auto">
                    {children}
                </main>

            </div>

        </div>

    );
}
