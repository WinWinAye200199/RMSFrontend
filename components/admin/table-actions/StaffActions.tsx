'use client';

import { useDeleteStaff, useUpdateBasicSalary, useUpdateStaffInfo } from "@/hooks/query-hooks/useAdmin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ROLES } from "@/constants";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Modal } from "antd";
import { EditIcon, Eye, Loader, Trash, XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";

const UPDATE_STAFF_FORM_FILEDS = {
    name: 'name',
    email: 'email',
    phone: 'phone',
    basicSalary: 'basicSalary',
    role: 'role'
}



function UpdateStaffInfoForm({ staff }: { staff: Staff }) {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { mutate, isPending } = useUpdateStaffInfo();
    const { mutate: updateSalary, isPending: isSalaryUpdating } = useUpdateBasicSalary()

    const form = useForm({
        resolver: zodResolver(z.object({
            name: z.string().min(3, 'Name is too short!').max(255, 'Name is too long!'),
            email: z.string().email('Invalid email!'),
            phone: z.string().regex(/^\d{6,11}$/, 'Invalid phone number!'),
            basicSalary: z.coerce.number({ coerce: true }).min(1, 'Invalid Salary!'),
            role: z.enum(['ADMIN', 'USER']),
        })),
        defaultValues: {
            name: staff.name,
            email: staff.email,
            phone: staff.phone,
            basicSalary: staff.basicSalary,
            role: 'USER'
        }
    })

    const onSubmit = (data: { name: string, email: string, phone: string, role: string, basicSalary: number }) => {
        mutate({
            staffId: staff.id,
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                role: data.role
            }
        }, {
            onSuccess: () => {
                updateSalary({
                    userId: staff.id,
                    newSalary: data.basicSalary
                }, {
                    onSuccess: () => {
                        toggleModal();
                        toast({
                            title: "Success",
                            description: "Staff's informations update successfully!"
                        })
                    }
                })
            }
        })
    }

    const toggleModal = () => {
        setIsOpen(prev => !prev);
        form.reset();
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
                title="Edit Staff Data"
                footer={null}
                width={440}
                closeIcon={<XIcon className="text-white" />}
                centered
                className="border border-neutral-400 rounded-md"
                classNames={{
                    content: '!bg-swamp-foreground !text-white',
                    header: ' !bg-swamp-foreground !my-0 [&>.ant-modal-title]:!text-white',
                }}
            >
                <Form
                    {...form}
                >
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 pt-4"
                    >
                        <p
                            className="text-neutral-400 text-sm"
                        >
                            Edit and update your staff&apos; information below:
                        </p>
                        {
                            Object.keys(UPDATE_STAFF_FORM_FILEDS).map((key) => {
                                return (
                                    <FormField
                                        control={form.control}
                                        name={key as keyof typeof UPDATE_STAFF_FORM_FILEDS}
                                        key={key}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel
                                                    className="text-sm font-semibold capitalize"
                                                >
                                                    {key}
                                                </FormLabel>
                                                <FormControl>

                                                    {
                                                        key === 'role' ? (
                                                            <Select
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value.toString()}
                                                            >
                                                                <SelectTrigger
                                                                    className="h-12"
                                                                >
                                                                    <SelectValue placeholder="Select Role" />
                                                                </SelectTrigger>
                                                                <SelectContent
                                                                    className="bg-swamp-foreground z-[99999]"
                                                                >
                                                                    {
                                                                        Object.keys(ROLES).map((role) => (
                                                                            <SelectItem
                                                                                key={role}
                                                                                value={role}
                                                                                className="h-12 cursor-pointer text-white"
                                                                            >
                                                                                {role}
                                                                            </SelectItem>
                                                                        ))
                                                                    }
                                                                </SelectContent>
                                                            </Select>
                                                        ) : (
                                                            <Input
                                                                placeholder={UPDATE_STAFF_FORM_FILEDS[field.name as keyof typeof UPDATE_STAFF_FORM_FILEDS]}
                                                                className="h-12"
                                                                prefix={key === 'basicSalary' ? '$' : undefined}
                                                                type={key === 'basicSalary' ? 'number' : 'text'}
                                                                {...field}
                                                            />
                                                        )
                                                    }
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )
                            }

                            )
                        }
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="flex w-fit ml-auto text-white !mt-8"
                            size={'lg'}
                        >
                            <Loader
                                className={cn('hidden', {
                                    'block animate-spin': isPending
                                })}
                            />
                            Save Changes
                        </Button>
                    </form>
                </Form>
            </Modal>
        </>
    )
}

function DeleteStaff({ staff }: { staff: Staff }) {

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
    const { mutate, isPending } = useDeleteStaff()

    const onDelete = () => {
        mutate(staff.id, {
            onSuccess: (result) => {
                setIsDialogOpen(prev => !prev)
                toast({
                    title: 'Success',
                    description: result?.message ?? 'Staff deleted successfully!',
                })
            },
            onError: (error) => {
                toast({
                    title: 'Error',
                    description: error?.message ?? 'Staff deleted successfully!',
                    variant: "destructive"
                })
            }
        })
    }

    return (
        <>
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
                            This action cannot be undone. This will permanently delete your staff data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose
                            asChild
                        >
                            <Button
                                variant={'ghost'}
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
        </>
    )

}

function StaffDetail({ staff }: { staff: Staff }) {

    return (
        <Dialog>
            <DialogTrigger
                asChild
            >
                <Button
                    variant="ghost"
                    size='icon'
                    className="!bg-transparent !text-blue-400"
                >
                    <Eye />
                </Button>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-lg bg-swamp-foreground text-white"
            >
                <DialogHeader>
                    <DialogTitle>{staff.name}</DialogTitle>
                    <DialogDescription>
                        {staff.name} is a {staff.jobRole} at our restaurent.
                    </DialogDescription>
                </DialogHeader>
                <div
                    className="grid grid-cols-2 gap-4"
                >
                    <DetailItem
                        label="Email"
                        value={staff.email}
                    />
                    <DetailItem
                        label="Phone"
                        value={staff.phone}
                    />
                    <DetailItem
                        label="Role"
                        value={staff.jobRole}
                    />
                    <DetailItem
                        label="Basic Salary"
                        value={staff.basicSalary.toString() + ' $'}
                    />
                    <DetailItem
                        label="Total Hours Worked"
                        value={staff.totalHoursWorked.toString()}
                    />
                    <DetailItem
                        label="Next Shift"
                        value={staff.nextShift ?? 'No upcoming shifts'}
                    />
                </div>
                <DialogFooter>
                    <DialogClose
                        asChild
                    >
                        <Button variant="ghost">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const DetailItem = ({ label, value }: { label: string, value: string }) => {
    return (
        <div
            className="text-sm p-2 border border-swamp-light/30 bg-swamp-light/10 space-y-2"
        >
            <p
                className="font-semibold text-neutral-400"
            >
                {label}:
            </p>
            <p
                className=" text-swamp-light"
            >
                {value}
            </p>
        </div>
    )
}

export const StaffActions = {
    Update: UpdateStaffInfoForm,
    Delete: DeleteStaff,
    Detail: StaffDetail
}