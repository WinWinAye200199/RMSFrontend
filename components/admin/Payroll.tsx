'use client'

import { USER_ROLES } from "@/constants"
import { REQ_BODY_DATE_FORMAT } from "@/constants/dayjs-format"
import { useGetAllPayroll } from "@/hooks/query-hooks/useAdmin"
import { cn, ConvertibleFormat, convertToDayjs } from "@/lib/utils"
import { useUserStore } from "@/states/zustand/user"
import { DatePicker } from "antd"
import { ColumnType } from "antd/es/table"
import dayjs, { Dayjs } from "dayjs"
import { useState } from "react"
import { AntdTable, FadeIn } from "../common"

export function Payroll() {

    const [dates, setDates] = useState([dayjs().subtract(1, 'month').format(REQ_BODY_DATE_FORMAT), dayjs().format(REQ_BODY_DATE_FORMAT)])

    const { data } = useGetAllPayroll(dates[0], dates[1]);
    const jwt = useUserStore(state => state.jwt)
    const isAdmin = jwt?.role === USER_ROLES.ADMIN

    const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        if (dates !== null && dates[0] !== null && dates[1] !== null) {
            setDates([dates[0].format(REQ_BODY_DATE_FORMAT), dates[1].format(REQ_BODY_DATE_FORMAT)]);
        } else {
            setDates([dayjs().subtract(1, 'month').format(REQ_BODY_DATE_FORMAT), dayjs().format(REQ_BODY_DATE_FORMAT)]);
        }
    }

    const columns: ColumnType<Payroll>[] = [
        {
            title: "Staff Name ",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Start Date",
            dataIndex: "startDate",
            key: "startDate",
            render: (value: string) => convertToDayjs(value, ConvertibleFormat.DATE)
        },
        {
            title: "End Date",
            dataIndex: "endDate",
            key: "endDate",
            render: (value: string) => convertToDayjs(value, ConvertibleFormat.DATE)
        },
        {
            title: "Total Payment",
            dataIndex: "totalPayment",
            key: "totalPayment",
            render: (value: string) => value + ' $',
            align: 'right'
        }
    ]

    return (
        <FadeIn
            className="space-y-4"
        >
            <div
                className="flex justify-between md:item-center max-md:flex-col gap-4"
            >
                <h2
                    className="text-xl font-semibold"
                >
                    Payroll
                </h2>
                <DatePicker.RangePicker
                    defaultValue={[dayjs(dates[0]), dayjs(dates[1])]}
                    onChange={(dates) => handleDateChange(dates)}
                    value={[dayjs(dates[0]), dayjs(dates[1])]}
                    className="h-10"
                />
            </div>

            {
                isAdmin ? (
                    <AntdTable
                        columns={columns}
                        dataSource={(data ?? []) as Payroll[]}
                        rowKey="userId"
                        rowClassName={cn('text-white')}
                    />
                ) : (
                    <>
                        <section
                            className="grid grid-cols-2 gap-4"
                        >
                            <DataItem
                                label="Start Date"
                                value={dates[0]}
                            />
                            <DataItem
                                label="End Date"
                                value={dates[1]}
                            />
                            <DataItem
                                label="Total Worked Hours "
                                value={data && data?.totalWorkedHours || 0 + ' hour(s)'}
                            />
                            <DataItem
                                label="Total Earning"
                                value={data && data?.totalSalary || 0 + ' $'}
                            />
                        </section>
                    </>
                )
            }

        </FadeIn>
    )
}


const DataItem = (
    { label, value }:
        {
            label: string,
            value: string | number
        }) => {
    return (
        <div
            className="border border-swamp-light/50 p-6 rounded bg-swamp-light/10 space-y-2 text-center"
        >
            <h3
                className="text-neutral-300"
            >
                {label}
            </h3>
            <p
                className="text-lg font-semibold text-swamp-light"
            >
                {value}
            </p>
        </div>
    )
}