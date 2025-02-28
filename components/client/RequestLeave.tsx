'use client';

import { REQ_BODY_DATE_FORMAT } from "@/constants/dayjs-format";
import { useRequestLeave } from "@/hooks/query-hooks/useStaff";
import { toast } from "@/hooks/use-toast";
import { DatePicker, Form, Input, Modal } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Loader, XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export function RequestLeave() {

    const [openModal, setOpenModal] = useState(false)
    const [form] = Form.useForm();

    const { mutate, isPending } = useRequestLeave();

    const onFinish = (values: {
        period: Dayjs[],
        reason: string
    }) => {

        const [startDate, endDate] = values.period;
        const payload = {
            startDate: startDate.format(REQ_BODY_DATE_FORMAT),
            endDate: endDate.format(REQ_BODY_DATE_FORMAT),
            reason: values.reason
        }

        mutate(payload, {
            onSuccess: () => {
                toggleModal();
                toast({
                    title: 'success',
                    description: 'Leave request submitted successfully!'
                })
            }
        })
    }

    const toggleModal = () => {
        setOpenModal(!openModal)
        form.resetFields();
    }

    return (
        <>

            <Button
                onClick={toggleModal}
                variant={'default'}
                className="h-10 text-white"
            >
                Request Leave
            </Button>
            <Modal
                open={openModal}
                onCancel={toggleModal}
                footer={null}
                centered
                width={440}
                closeIcon={<XIcon className="text-white" />}
                title={'Request Leave'}
                className="border border-neutral-400 rounded-md"
                classNames={{
                    content: '!bg-swamp-foreground !text-white',
                    header: ' !bg-swamp-foreground !my-0 [&>.ant-modal-title]:!text-white',
                }}
            >

                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    className=" [&>.ant-form-item>.ant-form-item-row>.ant-form-item-label>label]:!text-white pt-4"
                >
                    <p
                        className="text-neutral-400 text-sm mb-6"
                    >
                        Please fill in the form below to request leave.
                    </p>
                    <Form.Item
                        name={'period'}
                        label={'Period'}
                        rules={[
                            {
                                required: true,
                                message: 'Please select a period!',
                            }
                        ]}
                    >
                        <DatePicker.RangePicker
                            className="w-full h-10"
                            format={REQ_BODY_DATE_FORMAT}
                            disabledDate={current => current && current < dayjs().startOf("day")}
                            inputReadOnly
                        />
                    </Form.Item>
                    <Form.Item
                        name={'reason'}
                        label={'Reason'}
                        rules={[
                            {
                                required: true,
                                message: 'Please enter a reason to request a leave!',
                            }
                        ]}
                    >
                        <Input.TextArea
                            rows={4}
                            className="w-full resize-none"
                            placeholder=""
                        />
                    </Form.Item>
                    <Button
                        type={'submit'}
                        className="h-10 text-white ml-auto flex !mt-8"
                        disabled={isPending}
                    >
                        {
                            isPending && (
                                <Loader
                                    className=" animate-spin "
                                />
                            )
                        }
                        Submit
                    </Button>
                </Form>
            </Modal>
        </>
    )
}
