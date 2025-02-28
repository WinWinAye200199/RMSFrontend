'use client';

import { ForkKnifeCrossed } from "lucide-react";
import dynamic from "next/dynamic";
import MenuLoader from "../common/MenuLoader";

const AdminMenu = dynamic(
    () => import('@/components/dashboard/AdminMenu').then(mod => mod.AdminMenu),
    { ssr: false, loading: () => <MenuLoader /> }
)

const StaffMenu = dynamic(
    () => import('@/components/dashboard/StaffMenu').then(mod => mod.StaffMenu),
    { ssr: false }
)

const AppTitle = dynamic(
    () => import('@/components/dashboard/AppTitle').then(mod => mod.AppTitle),
    { ssr: false }
)

export function AppSidebar() {
    return (
        <aside
            className="w-full min-w-[240px] max-md:min-w-10 max-w-max bg-neutral-300 text-swamp-background sticky top-0 self-start min-h-screen"
        >
            <div
                className="flex items-center justify-center gap-2 bg-swamp-foreground text-swamp-light p-6 duration-200 "
            >
                <ForkKnifeCrossed
                    size={32}
                />
                <AppTitle />
            </div>
            <nav
                className="flex flex-col gap-2 p-2"
            >
                <AdminMenu />
                <StaffMenu />
            </nav>
        </aside>
    )
}