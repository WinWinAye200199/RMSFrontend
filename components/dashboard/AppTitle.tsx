'use client'
import { USER_ROLES } from "@/constants";
import { useUserStore } from "@/states/zustand/user";

export function AppTitle() {

    const jwt = useUserStore(state => state.jwt)

    const isAdmin = jwt?.role === USER_ROLES.ADMIN

    return (

        <h2
            className="font-semibold text-lg max-md:hidden"
        >
            {
                isAdmin ? 'Shift Manager' : null
            }

            {
                !isAdmin ? 'Staff' : null
            }
        </h2>
    )
}
