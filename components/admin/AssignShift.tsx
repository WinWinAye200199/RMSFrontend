'use client'

import { Button } from "@/components/ui/button"
import { REQ_BODY_DATE_FORMAT, RES_TIME_FORMAT, TIME_FORMAT } from "@/constants/dayjs-format"
import { useAssignShift, useGetAllStaff } from "@/hooks/query-hooks/useAdmin"
import { toast } from "@/hooks/use-toast"
import { DatePicker, Form, Modal, Select, TimePicker } from "antd"
import dayjs, { Dayjs } from "dayjs"
import { Loader, Plus, XIcon } from "lucide-react"
import { useState } from "react"

export function AssignShift() {

    const [isOpen, setIsOpen] = useState(false);
    const [date, setDate] = useState<Dayjs>(dayjs());

    const { data } = useGetAllStaff();

    const staffOpts = data?.filter(it => it.active)?.map(staff => ({
        label: staff.name,
        value: staff.name
    }))

    const [form] = Form.useForm();

    const toggleModal = () => {
        setIsOpen(prev => !prev);
        form.resetFields();
    }

    const { mutate, isPending } = useAssignShift();

    const onAssignShift = (data: { name: string, date: Dayjs, times: [Dayjs, Dayjs] }) => {

        const payload = {
            name: data.name,
            date: dayjs(data.date).format(REQ_BODY_DATE_FORMAT),
            startTime: dayjs(data.times[0]).format(RES_TIME_FORMAT),
            endTime: dayjs(data.times[1]).format(RES_TIME_FORMAT),
        }

        mutate(payload, {
            onSuccess: () => {
                toggleModal();
                toast({
                    title: 'Success',
                    description: 'Shift assigned successfully!'
                })
            },
            onError: (err) => {
                toast({
                    title: 'Error',
                    description: err?.response?.data?.message ?? 'Failed to assign shift!',
                    variant: 'destructive',
                    style: {
                        zIndex: 9999999
                    }
                })
            }
        })
    }

    return (
        <>
            <Button
                onClick={toggleModal}
                variant={'outline'}
                className="h-10"
            >
                <Plus />
                New Shift
            </Button>
            <Modal
                open={isOpen}
                onCancel={toggleModal}
                footer={null}
                centered
                width={440}
                closeIcon={<XIcon className="!text-white" />}
                title={'Assign Shift'}
                className="border border-neutral-400 rounded-md"
                classNames={{
                    content: '!bg-swamp-foreground !text-white',
                    header: ' !bg-swamp-foreground !my-0 [&>.ant-modal-title]:!text-white',
                }}
            >
                <Form
                    form={form}
                    onFinish={onAssignShift}
                    layout="vertical"
                    initialValues={{
                        date: dayjs(),
                        times: [dayjs(), dayjs()]
                    }}
                    className=" [&>.ant-form-item>.ant-form-item-row>.ant-form-item-label>label]:!text-white pt-1 space-y-4"
                >
                    <p
                        className="text-sm text-white/50"
                    >
                        Assign a new shift to a staff member
                    </p>
                    <Form.Item
                        name={'name'}
                        label={'Staff Name'}
                        required={false}
                        rules={[
                            {
                                required: true,
                                message: 'Staff is required!'
                            }
                        ]}
                    >
                        <Select
                            options={staffOpts}
                            className="w-full h-12 placeholder:text-red-50 text-white focus-within:text-swamp hover:text-swamp [&>.ant-select-selector]:!bg-swamp-light/10 [&>.ant-select-selector]:text-white [&>.ant-select-selector]:!border-swamp-light/50 [&>.ant-select-selector]:hover:!border-swamp-light/90 [&>.ant-select-selector]:focus-within:!border-swamp-light/90 [&.ant-select-open>.ant-select-selector>.ant-select-selection-wrap>.ant-select-selection-item]:!text-white/70 [&.ant-select-open>.ant-select-selector>.ant-select-selection-wrap>.ant-select-selection-placeholder]:!text-swamp [&>.ant-select-selector>.ant-select-selection-wrap>.ant-select-selection-placeholder]:!text-swamp "
                            placeholder="Select Staff"
                        />
                    </Form.Item>
                    <Form.Item
                        name={'date'}
                        label={'Date'}
                        required={false}
                        rules={[
                            {
                                required: true,
                                message: 'Date is required!'
                            }
                        ]}
                    >
                        <DatePicker
                            className="w-full h-12 bg-swamp-light/10 border-swamp-light/50 text-white focus-within:text-swamp hover:text-swamp [&>.ant-picker-input-placeholder>input]:text-swamp"
                            disabledDate={(current) => {
                                return current && current < dayjs().startOf('day')
                            }}
                            onChange={(date) => setDate(date)}
                        />
                    </Form.Item>
                    <Form.Item
                        name={'times'}
                        label={'Start Time & End Time'}
                        required={false}
                        rules={[
                            {
                                required: true,
                                message: 'Shift start time and end time is required!'
                            }
                        ]}
                        className="relative"
                    >
                        <TimePicker.RangePicker
                            format={TIME_FORMAT}
                            showNow={false}
                            use12Hours
                            className="w-full h-12 bg-swamp-light/10 border-swamp-light/50 text-white focus-within:text-swamp hover:text-swamp [&>.ant-picker-input-placeholder>input]:text-swamp"
                            disabledTime={(current, type) => {
                                if (type === 'start') {
                                    return {
                                        disabledHours: () => {
                                            return Array.from({ length: 24 }, (_, i) => i).filter(it => it < dayjs().hour() && current.date() === dayjs(date).date())
                                        },
                                        disabledMinutes: () => {
                                            if (dayjs().hour() === current.hour()) {
                                                return Array.from({ length: 60 }, (_, i) => i).filter(it => it < dayjs().minute() && current.date() === dayjs(date).date())
                                            }
                                            return []
                                        }
                                    }
                                }
                                return {
                                    disabledHours: () => {
                                        return Array.from({ length: 24 }, (_, i) => i).filter(it => it < dayjs().hour() && current.date() === dayjs(date).date())
                                    },
                                    disabledMinutes: () => {
                                        if (dayjs().hour() === current.hour()) {
                                            return Array.from({ length: 60 }, (_, i) => i).filter(it => it < dayjs().minute() && current.date() === dayjs(date).date())
                                        }
                                        return []
                                    }
                                }
                            }}
                        />
                    </Form.Item>
                    <Button
                        type="submit"
                        size={"lg"}
                        className="text-white ml-auto flex !mt-10"
                        disabled={isPending}
                    >
                        {
                            isPending && (
                                <Loader
                                    className=" animate-spin "
                                />
                            )
                        }
                        Assign Shift
                    </Button>
                </Form>
            </Modal >
        </>
    )
}