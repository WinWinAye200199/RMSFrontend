'use client';

import { useGetAllAttendance } from "@/hooks/query-hooks/useAdmin";
import { useGetUserRole } from "@/hooks/useGetUserRole";
import { cn, ConvertibleFormat, convertToDayjs } from "@/lib/utils";
import { DatePicker } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { AntdTable, FadeIn } from "../common";

const attandance_data = [
    {
        "id": 1,
        "name": "Win Win Aye",
        "date": "2025-02-05",
        "startTime": "23:43",
        "endTime": "21:46:32",
        "duration": 10,
        "status": "Present"
    }
]

export function AttandanceList({ isInDashboard = false }: { isInDashboard?: boolean }) {

    const [dates, setDates] = useState<[Dayjs | null, Dayjs | null]>([dayjs().subtract(1, 'month').startOf('day'), dayjs().endOf('day')]);

    const { isAdmin } = useGetUserRole();

    const { data } = useGetAllAttendance();

    const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        if (dates) {
            setDates(dates);
        } else {
            setDates([dayjs().startOf('day'), dayjs().endOf('day')]);
        }
    };

    const renderData = data && data?.filter((attandance) => {
        const date = dayjs(attandance.date);
        if (isInDashboard) {
            return date.isSame(dayjs(), 'day');
        } else {
            return (date.isAfter(dates[0]?.startOf('day') || dayjs().startOf('day')) && date.isBefore(dates[1]?.endOf('day') || dayjs().endOf('day'))) || date.isSame(dates[0], 'day') || date.isSame(dates[1], 'day');
        }
    }) || [];

    const columns: ColumnsType<Attandance> = [
        {
            title: 'Date',
            dataIndex: "date",
            key: "date",
            render: (value: string) => convertToDayjs(value, ConvertibleFormat.DATE)
        },
        {
            title: 'Start Time',
            dataIndex: "startTime",
            key: "startTime",
            render: (value: string) => value === "Not Clocked In" ? "Not Clocked In" : convertToDayjs(value, ConvertibleFormat.TIME)
        },
        {
            title: 'End Time',
            dataIndex: "endTime",
            key: "endTime",
            render: (value: string) => value === "Not Clocked Out" ? "Not Clocked Out" : convertToDayjs(value, ConvertibleFormat.TIME)
        },
        {
            title: 'Duration',
            dataIndex: "duration",
            key: "duration",
            render: (value: number) => value.toFixed(2) + ' Hrs'
        },
        {
            title: 'Status',
            dataIndex: "status",
            key: "status",
            render: (value: string) => (
                <p
                    className={cn({
                        'text-green-500': value === 'Present',
                        'text-red-500': value === 'Absent',
                        'text-yellow-500': value === 'Late',
                    })}
                >
                    {value?.toUpperCase() ?? '-'}
                </p>
            )
        },
    ]

    if (isAdmin) {
        columns.unshift({
            title: 'Name',
            dataIndex: "name",
            key: "name",
        })
    }


    return (
        <FadeIn
            className="space-y-4"
        >
            <section
                className="flex justify-between md:items-center max-md:flex-col gap-4 "
            >
                <h2
                    className="text-xl font-semibold"
                >
                    {isInDashboard && 'Today '} Attandance List
                </h2>

                <div
                    className="flex items-center gap-4"
                >
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
                dataSource={renderData}
                rowClassName={cn('text-white')}
            />
        </FadeIn>
    )
}
