'use client';

import { AntdTable, FadeIn } from "@/components/common";
import { USER_ROLES } from "@/constants";
import { LEAVE_STATUS } from "@/constants/leave-status";
import { useGetAllLeaveRequest } from "@/hooks/query-hooks/useAdmin";
import { cn, ConvertibleFormat, convertToDayjs } from "@/lib/utils";
import { useUserStore } from "@/states/zustand/user";
import { DatePicker, Select } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { RequestLeave } from "../client";
import { LeaveActions } from "./table-actions/LeaveActions";


export function LeaveRequestList({ isInDashboard = false }: { isInDashboard?: boolean }) {

    const startDate = dayjs().subtract(1, 'month').startOf('day');
    const endDate = dayjs().endOf('day');

    const [dates, setDates] = useState<[Dayjs | null, Dayjs | null]>([startDate, endDate]);
    const [status, setStatus] = useState<keyof typeof LEAVE_STATUS>(LEAVE_STATUS.PENDING as keyof typeof LEAVE_STATUS);
    const [filteredData, setFilteredData] = useState<Leave[]>([]);

    const jwt = useUserStore(state => state.jwt);
    const isAdmin = jwt?.role === USER_ROLES.ADMIN
    const { data: leaves } = useGetAllLeaveRequest();

    useEffect(() => {
        if (leaves) {
            const data = leaves.filter((leave) => {
                const startDate = dayjs(leave.startDate);
                const endDate = dayjs(leave.endDate);
                if (isInDashboard) {
                    return leave.status === "PENDING";
                } {
                    return (startDate.isAfter(dates[0]!) || startDate.isSame(dates[0]!)) &&
                        (startDate.isBefore(dates[1]!) || startDate.isSame(dates[1]!)) ||
                        (endDate.isAfter(dates[0]!) || endDate.isSame(dates[0]!)) &&
                        (endDate.isBefore(dates[1]!) || endDate.isSame(dates[1]!));
                }
            }).filter((leave) => {
                return leave.status === status;
            })
            setFilteredData(data);
        }
    }, [status, dates, isInDashboard, leaves]);

    const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        if (dates) {
            setDates(dates);
        } else {
            setDates([startDate, endDate]);
        }
    }

    const columns: ColumnsType<Leave> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (value: string) => convertToDayjs(value, ConvertibleFormat.DATE)
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (value: string) => convertToDayjs(value, ConvertibleFormat.DATE)
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
            width: '20%',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (value: string) => (
                <p
                    className={cn({
                        'text-green-500': value === LEAVE_STATUS.APPROVED,
                        'text-red-500': value === LEAVE_STATUS.DENIED,
                        'text-yellow-500': value === LEAVE_STATUS.PENDING
                    })}
                >
                    {value}
                </p>
            )
        },
    ]

    if (isAdmin) {
        columns.push({
            title: 'Actions',
            key: 'actions',
            render: (value: string, record: Leave) => (
                <LeaveActions
                    leave={record}
                />
            )
        })
    }

    return (
        <FadeIn
            className="space-y-4 "
        >
            <section
                className="flex justify-between md:items-center max-md:flex-col gap-4"
            >
                <h2
                    className="text-xl font-semibold"
                >
                    {isInDashboard && 'Pending '} Leave Requests
                </h2>

                <div
                    className="flex gap-4"
                >
                    {
                        !isAdmin && (
                            <RequestLeave />
                        )
                    }

                    {
                        !isInDashboard && (
                            <Select
                                options={Object.keys(LEAVE_STATUS).map(status => ({ label: status, value: status }))}
                                value={status}
                                className="h-10"
                                onChange={(value) => setStatus(value as keyof typeof LEAVE_STATUS)}
                            />
                        )
                    }

                    {
                        !isInDashboard && (
                            <DatePicker.RangePicker
                                value={dates}
                                onChange={handleDateChange}
                                className="h-10"
                            />
                        )
                    }
                </div>
            </section>

            <AntdTable
                columns={columns}
                dataSource={filteredData}
                rowClassName="text-white"
            />
        </FadeIn>
    )
}
