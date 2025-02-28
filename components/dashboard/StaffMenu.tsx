'use client'

import { USER_ROLES } from "@/constants";
import { useUserStore } from "@/states/zustand/user";
import { Calendar, ClockIcon, DollarSign, Settings, UserCheck2Icon } from "lucide-react";
import { NavLink } from "./NavLink";

const Navigation_Links = [
    {
        icon: <UserCheck2Icon />,
        label: 'Attendances',
        href: '/attandances'
    },
    {
        icon: <ClockIcon />,
        label: 'Shifts',
        href: '/shifts'
    },
    {
        icon: <Calendar />,
        label: 'Leaves',
        href: '/leaves'
    },
    {
        icon: <DollarSign />,
        label: 'Payroll',
        href: '/payroll'
    },
    {
        icon: <Settings />,
        label: 'Settings',
        href: '/settings'
    },
]

export function StaffMenu() {

    const jwt = useUserStore((state) => state.jwt);

    return jwt &&
        jwt?.role === USER_ROLES.USER && (
            <>
                {
                    Navigation_Links.map((link) => (
                        <NavLink
                            key={link.href}
                            link={link}
                        />
                    ))
                }
            </>
        )
}
