'use client';

import { USER_ROLES } from "@/constants";
import { useUserStore } from "@/states/zustand/user";

export function useGetUserRole() {

    const jwt = useUserStore((state) => state.jwt);

    const userRole = jwt?.role;

    const isUser = userRole === USER_ROLES.USER
    const isAdmin = userRole === USER_ROLES.ADMIN

    return { isUser, isAdmin }
}
