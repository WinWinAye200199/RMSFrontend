'use client';

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX } from "react";

export function NavLink({ link }: { link: { icon: JSX.Element, label: string, href: string } }) {

    const { href, label, icon } = link;

    const pathname = usePathname();
    const isActive = pathname === href || (pathname !== "/" && pathname.includes(label.toLocaleLowerCase()));

    return (
        <Link
            key={href}
            href={href}
            className={cn("flex items-center text-swamp-foreground max-md:justify-center gap-3 p-4 duration-200 rounded-md", {
                'bg-swamp-light': isActive,
                'hover:bg-swamp-light/20': !isActive
            })}
        >
            {icon}
            <span
                className="font-semibold max-md:hidden "
            >
                {label}
            </span>
        </Link>

    )
}
