'use client';

import { USER_ROLES } from "@/constants";
import { LayoutWrapper } from "@/hoc/LayoutWrapper";
import { useUserStore } from "@/states/zustand/user";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {

    const jwt = useUserStore((state) => state.jwt);
    const router = useRouter()

    useEffect(() => {
        if (jwt) {
            if (jwt?.role === USER_ROLES.USER) {
                return router.replace('/attandances')
            }
            router.replace('/');
        }
    }, [jwt])

    return (
        <LayoutWrapper>
            <main className="min-h-screen bg-swamp-foreground text-white flex flex-col md:flex-row-reverse">
                <div
                    className="relative h-[100vh] w-full md:max-w-[50vw] max-md:h-[30vh] max-md:w-full md:sticky top-0"
                >
                    <Image
                        src={'/images/auth_image.jpg'}
                        alt="Auth Image"
                        fill
                        sizes="100%"
                        className="size-full object-cover object-center"
                    />
                </div>

                <section
                    className="w-full flex flex-1 justify-center items-center p-10"
                >
                    {children}
                </section>
            </main>
        </LayoutWrapper>
    )
}
