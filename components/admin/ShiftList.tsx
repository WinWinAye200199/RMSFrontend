'use client';

import { USER_ROLES } from "@/constants";
import { REQ_BODY_DATE_FORMAT } from "@/constants/dayjs-format";
import { useGetAllAttendance, useGetAllShifts } from "@/hooks/query-hooks/useAdmin";
import { ConvertibleFormat, convertToDayjs } from "@/lib/utils";
import { useUserStore } from "@/states/zustand/user";
import { DatePicker } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { AssignClockInClockOut } from "../client";
import { AntdTable, FadeIn } from "../common";
import { AssignShift } from "./AssignShift";
import { ShiftActions } from "./table-actions/ShiftActions";

export function ShiftList({ isInDashboard = false }: { isInDashboard?: boolean }) {

    const jwt = useUserStore(state => state.jwt);
    const isAdmin = jwt?.role === USER_ROLES.ADMIN
    const [dates, setDates] = useState<[Dayjs | null, Dayjs | null]>([dayjs().subtract(1, 'month').startOf('day'), dayjs().endOf('day')]);

    const { data } = useGetAllShifts();
    const { data: attandances } = useGetAllAttendance();

    const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        if (dates) {
            setDates(dates);
        } else {
            setDates([dayjs().startOf('day'), dayjs().endOf('day')]);
        }
    };

    const renderData = data && data?.length > 0 && data?.filter(shift => {
        const date = dayjs(shift.date).startOf('day');
        if (isInDashboard) {
            return date.isSame(dayjs(), 'day');
        } else {
            return (date.isAfter(dates[0]?.startOf('day') || dayjs().startOf('day')) && date.isBefore(dates[1]?.endOf('day') || dayjs().endOf('day'))) || date.isSame(dates[0], 'day') || date.isSame(dates[1], 'day');
        }
    }) || [];

    const attandanceDataByDay = attandances?.find(it => dayjs(it.date).isSame(dayjs().format(REQ_BODY_DATE_FORMAT)));

    const renderActions = (shift: Shift) => {
        return isAdmin ? (
            (shift?.active &&
                !shift?.finish &&
                (dayjs(shift.date).isAfter(dayjs(), 'date') || dayjs(shift.date).isSame(dayjs(), 'date'))
            ) ? (
                <>
                    <ShiftActions.Update
                        shift={shift}
                    />
                    <ShiftActions.Delete
                        shift={shift}
                    />
                </>
            ) : <p>-</p>
        ) : (
            <AssignClockInClockOut
                shift={shift}
                attandance={attandanceDataByDay || null}
            />
        )
    }

    const columns: ColumnsType<Shift> = [
        {
            title: "Staff Name",
            dataIndex: "staffName",
            key: "staffName"
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (value: string) => convertToDayjs(value, ConvertibleFormat.DATE)
        },
        {
            title: "Start Time",
            dataIndex: "startTime",
            key: "startTime",
            render: (value: string) => convertToDayjs(value, ConvertibleFormat.TIME)
        },
        {
            title: "End Time",
            dataIndex: "endTime",
            key: "endTime",
            render: (value: string) => convertToDayjs(value, ConvertibleFormat.TIME)
        },
        {
            title: "Manager Name",
            dataIndex: "managerName",
            key: "managerName"
        },
        {
            title: "Actions",
            key: "actions",
            render: (value: string, shift: Shift) => renderActions(shift),
            align: 'center',
        }
    ]


    return (
        <FadeIn
            className="space-y-4"
        >
            <div
                className="flex md:items-center justify-between max-md:flex-col gap-4"
            >
                <h2
                    className="text-xl font-semibold"
                >
                    {isInDashboard && 'Today '}Shift List
                </h2>

                {
                    !isInDashboard && (
                        <div
                            className="flex items-center gap-4 max-sm:justify-between"
                        >
                            <DatePicker.RangePicker
                                value={dates}
                                onChange={handleDateChange}
                                className="h-10"
                                inputReadOnly
                                allowClear={false}
                            />
                            {
                                isAdmin && (
                                    <AssignShift />
                                )
                            }
                        </div>
                    )
                }
            </div>

            <AntdTable
                columns={columns}
                dataSource={renderData}
                rowClassName={(record) => record.active ? "text-white" : " !bg-gray-500 text-white/50"}
            />
        </FadeIn>
    )
}
