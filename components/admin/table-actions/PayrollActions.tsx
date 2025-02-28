'use client';

import { useUpdateBasicSalary } from "@/hooks/query-hooks/useAdmin";
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
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { EditIcon, Eye, Loader } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";

function UpdateSalaryForm({ payroll }: { payroll: Payroll }) {

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const { mutate, isPending } = useUpdateBasicSalary();

    const form = useForm({
        resolver: zodResolver(z.object({
            newSalary: z.number().min(0, 'Salary cannot be less than 0!').max(1000000, 'Salary cannot be more than 1,000,000!'),
        })),
        defaultValues: {
            newSalary: 0,
        }
    })

    const onSubmit = (data: { newSalary: number }) => {
        mutate({
            userId: payroll.userId,
            newSalary: data.newSalary
        }, {
            onSuccess: (result) => {
                setIsDialogOpen(false);
                toast({
                    title: 'Success',
                    description: result?.message || 'Basic salary updated successfully!',
                })
            }
        })
    }

    return (
        <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
                setIsDialogOpen(open);
                form.clearErrors()
            }}
        >
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size='icon'
                    className="!bg-transparent !text-swamp"
                    onClick={() => setIsDialogOpen(true)}
                >
                    <EditIcon />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-swamp-foreground text-white">
                <DialogHeader>
                    <DialogTitle>Update {payroll.username}&apos;s Basic Salary </DialogTitle>
                    <DialogDescription>
                        You can update the basic salary of staffs from here.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    {...form}
                >
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name={'newSalary'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        className="text-sm font-semibold capitalize"
                                    >
                                        Salary
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={'Enter new salary'}
                                            className="h-12"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                            Confirm
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

function PayrollDetail({ payroll }: { payroll: Payroll }) {


    return (
        <Dialog>
            <DialogTrigger
                asChild
            >
                <Button
                    variant="ghost"
                    size='icon'
                    className="!bg-transparent text-blue-400"
                >
                    <Eye />
                </Button>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-md bg-swamp-foreground text-white"
            >
                <DialogHeader>
                    <DialogTitle> {payroll.username} </DialogTitle>
                    <DialogDescription>
                        Here are the details of the payroll for {payroll.username}.
                    </DialogDescription>
                </DialogHeader>
                <section className="flex flex-col space-y-4">
                    <div className="flex justify-between">
                        <span>Start Date</span>
                        <span>{dayjs(payroll.startDate).format('DD MMM, YYYY')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>End Date</span>
                        <span>{dayjs(payroll.endDate).format('DD MMM, YYYY')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Net Salary</span>
                        <span>{payroll.totalPayment}</span>
                    </div>
                </section>
                <DialogFooter>
                    <DialogClose
                        asChild
                    >
                        <Button
                            className="!text-white"
                        >
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent >
        </Dialog >
    )

}

export const PayrollActions = {
    Update: UpdateSalaryForm,
    Detail: PayrollDetail
}