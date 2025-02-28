'use client';

import { AppSidebar, Header } from "@/components/dashboard";
import { LayoutWrapper } from "@/hoc/LayoutWrapper";
import { useUserStore } from "@/states/zustand/user";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {

    const jwt = useUserStore((state) => state.jwt);
    const router = useRouter();

    useEffect(() => {
        if (!jwt) {
            router.replace('/login');
        }
    }, [jwt])

    return (
        <LayoutWrapper>
            <main
                className="flex min-h-screen"
            >
                <AppSidebar />
                <section
                    className="w-full flex-1 flex flex-col bg-swamp-foreground "
                >
                    <Header />
                    <div
                        className="p-10 max-md:p-8 text-white"
                    >
                        {children}
                    </div>
                </section>
            </main>
        </LayoutWrapper>
    )
}
