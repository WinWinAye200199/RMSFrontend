'use client'
import dynamic from "next/dynamic";

const Payroll = dynamic(
    () => import('@/components/admin/Payroll').then(mod => mod.Payroll),
    { ssr: false }
)

export default function PayrollPage() {
    return (
        <>
            <Payroll />
        </>
    )
}
