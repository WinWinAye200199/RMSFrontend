'use client'

import dynamic from "next/dynamic";

const ShiftList = dynamic(
    () => import('@/components/admin/ShiftList').then(mod => mod.ShiftList),
    { ssr: false }
)

export default function Shifts() {
    return (
        <ShiftList />
    )
}
