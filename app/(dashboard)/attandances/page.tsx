'use client'
import dynamic from "next/dynamic";

const AttandanceList = dynamic(
    () => import('@/components/admin/AttandanceList').then(mod => mod.AttandanceList),
    { ssr: false }
)

export default function Attandances() {
    return (
        <>
            <AttandanceList />
        </>
    )
}
