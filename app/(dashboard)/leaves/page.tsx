'use client';

import dynamic from "next/dynamic";

const LeaveRequestList = dynamic(
    () => import('@/components/admin/LeaveRequestList').then(mod => mod.LeaveRequestList),
    { ssr: false }
);

export default function Leaves() {
    return (
        <LeaveRequestList />
    )
}
