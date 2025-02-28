'use client'
import dynamic from "next/dynamic";

const UserProfile = dynamic(
    () => import("@/components/common/UserProfile").then((mod) => mod.UserProfile),
    {
        ssr: false,
    }
);

export default function Settings() {
    return (
        <UserProfile />
    )
}
