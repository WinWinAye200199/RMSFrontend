'use client';

import { useClockInAssign, useClockOutAssign } from "@/hooks/query-hooks/useStaff";
import { toast } from "@/hooks/use-toast";
import { Modal } from "antd";
import dayjs from "dayjs";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

enum ClockType {
    ClockIn = 'Clock In',
    ClockOut = 'Clock Out'
}

export function AssignClockInClockOut({ shift, attandance }: { shift: Shift, attandance: Attandance | null }) {

    const [clockType, setClockType] = useState<ClockType>(ClockType.ClockIn);
    const [openModal, setOpenModal] = useState(false);

    const { mutate: clockInAssign, isPending: isClockInAssignPending } = useClockInAssign();
    const { mutate: clockOutAssign, isPending: isClockOutAssignPending } = useClockOutAssign();

    const onFinish = () => {
        if (clockType === ClockType.ClockIn) {
            clockInAssign(shift.id, {
                onSuccess: (result) => {
                    setOpenModal(false);
                    if (result?.success) {
                        toast({
                            title: 'Success',
                            description: result?.message ?? 'You have successfully clocked in!',
                        })
                    } else {
                        toast({
                            title: 'Error',
                            description: result?.message ?? 'Something went wrong!',
                            variant: 'destructive'
                        })
                    }
                },
            });
        } else {
            clockOutAssign(shift.id, {
                onSuccess: (result) => {
                    setOpenModal(false);
                    if (result?.success) {
                        toast({
                            title: 'Success',
                            description: result?.message ?? 'You have successfully clocked out!',
                        })
                    } else {
                        toast({
                            title: 'Error',
                            description: result?.message ?? 'Something went wrong!',
                            variant: 'destructive'
                        })
                    }
                }
            });
        }
    }

    const toggleModal = (type: ClockType) => {
        setClockType(type);
        setOpenModal(!openModal);
    }

    const isNotSameDay = !dayjs(shift.date).isSame(dayjs(), 'date');

    return (
        <>
            <div
                className="space-x-4"
            >
                {
                    isNotSameDay ? '-' : (
                        Object.values(ClockType).map((type) => {

                            if (attandance && attandance?.startTime !== "Not Clocked In" && type === ClockType.ClockIn) return null;
                            if (attandance && attandance?.endTime !== "Not Clocked Out" && type === ClockType.ClockOut) return '-';

                            return (
                                <Button
                                    key={type}
                                    onClick={() => toggleModal(type as ClockType)}
                                    className="text-white"
                                >
                                    {type}
                                </Button>
                            )
                        })
                    )
                }
            </div>
            <Modal
                open={openModal}
                onCancel={() => toggleModal(clockType)}
                footer={null}
                centered
                width={440}
                className="border border-neutral-400 rounded-md"
                classNames={{
                    content: '!bg-swamp-foreground !text-white',
                }}
            >
                <article
                    className="space-y-1 mb-6"
                >
                    <h2
                        className="text-lg font-semibold"
                    >
                        {
                            clockType === ClockType.ClockIn ? 'Clock In' : 'Clock Out'
                        }
                    </h2>
                    <p
                        className="text-sm text-neutral-300"
                    >
                        Are you sure you want to
                        {
                            clockType === ClockType.ClockIn ? ' Clock In' : ' Clock Out'
                        } ?
                    </p>
                </article>
                <div
                    className="flex justify-end gap-4"
                >
                    <Button
                        variant={'ghost'}
                        onClick={() => toggleModal(clockType)}
                        className="h-10 "
                        disabled={isClockInAssignPending || isClockOutAssignPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onFinish}
                        className="h-10 text-white "
                        disabled={isClockInAssignPending || isClockOutAssignPending}
                    >
                        {
                            (isClockInAssignPending || isClockOutAssignPending) && (
                                <Loader
                                    className=" animate-spin"
                                />
                            )
                        }
                        {clockType}
                    </Button>
                </div>
            </Modal>
        </>
    )
}
