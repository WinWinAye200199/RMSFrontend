'use client'

import { useGetAllStaff } from "@/hooks/query-hooks/useAdmin";
import { Select } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { AntdTable, FadeIn } from "../common";
import { Input } from "../ui/input";
import { StaffActions } from "./table-actions/StaffActions";

export function StaffList() {

    const [keyword, setKeyword] = useState<string>("");
    const [staffStatus, setStaffStatus] = useState<boolean>(true);
    const [filteredData, setFilteredData] = useState<Staff[]>([]);

    const { data } = useGetAllStaff();

    useEffect(() => {
        if (data) {
            const filteredData = data.filter((staff) => {
                return staff.active === staffStatus
            })

            if (keyword && keyword.trim().length > 0) {
                const keywordFilteredData = filteredData.filter((staff) => {
                    return staff.name.toLowerCase().includes(keyword.toLowerCase()) ||
                        staff.jobRole.toLowerCase().includes(keyword.toLowerCase())
                })

                setFilteredData(keywordFilteredData);
                return;
            }

            setFilteredData(filteredData);
        }
    }, [data, keyword, staffStatus]);

    // const staff_data_filtered = data && data?.filter((staff) => {
    //     return staff.name.toLowerCase().includes(keyword.toLowerCase()) ||
    //         staff.jobRole.toLowerCase().includes(keyword.toLowerCase())
    // }) || [];

    const renderActions = (staff: Staff) => {
        return (
            <>
                <StaffActions.Detail
                    staff={staff}
                />
                {
                    staff.active && (
                        <>
                            <StaffActions.Update
                                staff={staff}
                            />
                            <StaffActions.Delete
                                staff={staff}
                            />
                        </>
                    )
                }
            </>
        )
    }

    const columns: ColumnsType<Staff> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Job Role',
            dataIndex: 'jobRole',
            key: 'jobRole',
        },
        {
            title: 'Basic Salary',
            dataIndex: 'basicSalary',
            key: 'basicSalary',
            render: (value: number) => (value ?? 0) + " $",
            align: 'right'
        },
        {
            title: 'Next Shift',
            dataIndex: 'nextShift',
            key: 'nextShift',
            render: (value: string) => value ?? "-",
            align: 'center'
        },
        {
            title: 'Total Working Hours',
            dataIndex: 'totalHoursWorked',
            key: 'totalHoursWorked',
            render: (value: number) => (value ?? 0) + " hrs",
            align: 'right'
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (text: string, record: Staff) => renderActions(record),
            align: 'center'
        }
    ]

    return (
        <FadeIn
            className="space-y-4"
        >
            <section
                className="flex justify-between sm:items-center max-sm:flex-col gap-4"
            >
                <h2
                    className="text-xl font-semibold"
                >
                    Staff List
                </h2>


                <div
                    className="flex items-center gap-4"
                >
                    <Select
                        options={[
                            { label: "Present", value: true },
                            { label: "Resigned", value: false }
                        ]}
                        value={staffStatus}
                        className="h-9"
                        onChange={(value) => setStaffStatus(value)}
                    />
                    <Input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Search Staff"
                        className=" max-w-72 w-full border-swamp-light"
                    />
                </div>
            </section >

            <AntdTable
                columns={columns}
                dataSource={filteredData}
                rowClassName={(record) => record.active ? "text-white" : " !bg-gray-600 text-white/50"}
            />
        </FadeIn >
    )
}
