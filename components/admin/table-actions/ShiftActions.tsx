'use client';

import { useDeleteShift, useUpdateShift } from "@/hooks/query-hooks/useAdmin";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { REQ_BODY_DATE_FORMAT, RES_TIME_FORMAT, TIME_FORMAT } from "@/constants/dayjs-format";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { DatePicker, Form, Modal, TimePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { EditIcon, Loader, Trash, XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";

function UpdateShift({ shift }: { shift: Shift }) {

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [date, setDate] = useState<Dayjs>(dayjs());
    const { mutate, isPending } = useUpdateShift();

    const [form] = Form.useForm()

    const onSubmit = (data: { name: string, date: Dayjs, times: [Dayjs, Dayjs] }) => {


        mutate({
            id: shift.id,
            name: shift.staffName,
            date: dayjs(data.date)?.format(REQ_BODY_DATE_FORMAT),
            startTime: dayjs(data.times[0])?.format(RES_TIME_FORMAT),
            endTime: dayjs(data.times[1])?.format(RES_TIME_FORMAT)
        }, {
            onSuccess: () => {
                toggleModal();
                toast({
                    title: 'Success',
                    description: 'Shift updated successfully!'
                })
            }
        })
    }

    const toggleModal = () => {
        setIsOpen(prev => !prev);
        form.setFieldsValue({
            staffName: shift.staffName,
            date: dayjs(shift.date),
            times: [dayjs(shift.startTime, RES_TIME_FORMAT), dayjs(shift.endTime, RES_TIME_FORMAT)]
        });
        setDate(dayjs(shift.date))
    }

    return (
        <>
            <Button
                variant="ghost"
                size='icon'
                className="!bg-transparent !text-swamp-light"
                onClick={toggleModal}
            >
                <EditIcon />
            </Button>
            <Modal
                open={isOpen}
                onCancel={toggleModal}
                footer={null}
                centered
                width={440}
                closeIcon={<XIcon className="!text-white" />}
                title={'Edit Shift'}
                className="border border-neutral-400 rounded-md"
                classNames={{
                    content: '!bg-swamp-foreground !text-white',
                    header: ' !bg-swamp-foreground !my-0 [&>.ant-modal-title]:!text-white',
                }}
            >
                <Form
                    form={form}
                    onFinish={onSubmit}
                    layout="vertical"
                    className=" [&>.ant-form-item>.ant-form-item-row>.ant-form-item-label>label]:!text-white pt-1 space-y-4"
                >
                    <p
                        className="text-sm text-white/50"
                    >
                        Edit shift assigned to &quot;{shift.staffName}&quot;
                    </p>
                    <Form.Item
                        name={'staffName'}
                        label={'Staff Name'}
                        required={false}
                        rules={[
                            {
                                required: true,
                                message: 'Staff is required!'
                            }
                        ]}
                    >
                        <Input
                            className="h-12 disabled:text-gray-100 "
                            disabled
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
                        Update
                    </Button>
                </Form>
            </Modal >
        </>
    )
}

function DeleteShift({ shift }: { shift: Shift }) {

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
    const { mutate, isPending } = useDeleteShift()

    const onDelete = () => {
        mutate(shift.id, {
            onSuccess: () => {
                setIsDialogOpen(false);
                toast({
                    title: 'Shift Deleted',
                    description: `Shift assigned to ${shift.staffName} has been deleted successfully!`,
                })
            },
            onError: (error) => {
                toast({
                    title: 'Error',
                    description: error.message ?? 'An error occurred while deleting the shift!',
                    variant: 'destructive'
                })
            }
        })
    }

    return (
        <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => setIsDialogOpen(open)}
        >
            <DialogTrigger
                asChild
            >
                <Button
                    variant="ghost"
                    size='icon'
                    className="!bg-transparent !text-red-500"
                >
                    <Trash />
                </Button>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-md bg-swamp-foreground text-white"
            >
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this shift which was assigned to {shift.staffName} ? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose
                        asChild
                    >
                        <Button
                            variant={'ghost'}
                            className="text-white"
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={onDelete}
                        variant="destructive"
                        disabled={isPending}
                    >
                        <Loader
                            className={cn('hidden', {
                                'block animate-spin': isPending
                            })}
                        />
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent >
        </Dialog >
    )

}

export const ShiftActions = {
    Update: UpdateShift,
    Delete: DeleteShift
}