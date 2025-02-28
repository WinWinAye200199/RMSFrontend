'use client';
import dynamic from "next/dynamic";

const AttandanceList = dynamic(
    () => import('@/components/admin/AttandanceList').then(mod => mod.AttandanceList),
    { ssr: false }
)

const LeaveRequestList = dynamic(
    () => import('@/components/admin/LeaveRequestList').then(mod => mod.LeaveRequestList),
    { ssr: false }
)

const ShiftList = dynamic(
    () => import('@/components/admin/ShiftList').then(mod => mod.ShiftList),
    { ssr: false }
)

export default function DashboardPage() {

    return (
        <section
            className="space-y-8"
        >
            <AttandanceList
                isInDashboard
            />
            <LeaveRequestList
                isInDashboard
            />
            <ShiftList
                isInDashboard
            />
        </section>
    )
}
