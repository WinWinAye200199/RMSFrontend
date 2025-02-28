import dayjs from "dayjs";
import { RES_TIME_FORMAT } from "./dayjs-format";

enum ConvertibleFormat {
    DATE = 'DD MMM, YYYY',
    TIME = 'hh:mm A'
}

const convertToDayjs = (value: string, format: ConvertibleFormat) => format === ConvertibleFormat.DATE ?
    dayjs(value).format(format) :
    dayjs(value, RES_TIME_FORMAT).format(format);

export const leaveTableColumns = [
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
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    }
]

export const attandanceTableColumns = [
    {
        title: 'Name',
        dataIndex: "name",
        key: "name",
    },
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
        render: (value: string) => convertToDayjs(value, ConvertibleFormat.TIME)
    },
    {
        title: 'End Time',
        dataIndex: "endTime",
        key: "endTime",
        render: (value: string) => convertToDayjs(value, ConvertibleFormat.TIME)
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
    },
]

export const shiftTableColumns = [
    {
        title: "Staff Name",
        dataIndex: "staffName",
        key: "staffName"
    },
    {
        title: "Date",
        dataIndex: "date",
        key: "date",
        render: (date: string) => convertToDayjs(date, ConvertibleFormat.DATE)
    },
    {
        title: "Start Time",
        dataIndex: "startTime",
        key: "startTime",
        render: (time: string) => convertToDayjs(time, ConvertibleFormat.TIME)
    },
    {
        title: "End Time",
        dataIndex: "endTime",
        key: "endTime",
        render: (time: string) => convertToDayjs(time, ConvertibleFormat.TIME)
    },
    {
        title: "Manager Name",
        dataIndex: "managerName",
        key: "managerName"
    },
]

export const payrollTableColumns = [
    {
        title: 'User ID',
        dataIndex: 'userId',
        key: 'userId'
    },
    {
        title: 'Name',
        dataIndex: 'username',
        key: 'username'
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
        title: 'Total Salary',
        dataIndex: 'totalPayment',
        key: 'totalPayment',
        render: (value: string) => value + " $"
    }
]