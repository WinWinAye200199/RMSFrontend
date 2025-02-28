'use client';

import { useChanagePassword } from "@/hooks/query-hooks";
import { useGetUserData } from "@/hooks/query-hooks/useStaff";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getJwtClient } from "@/services/getJwtClient";
import { useUserStore } from "@/states/zustand/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosed, EyeIcon, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { FadeIn } from "./FadeIn";

export function UserProfile() {

    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false,
    });
    const router = useRouter()

    const { mutate, isPending } = useChanagePassword();
    const { data: userData } = useGetUserData();

    const form = useForm({
        resolver: zodResolver(z.object({
            oldPassword: z.string().nonempty('Current password is required!'),
            newPassword: z.string().nonempty('New password is required!').min(8, 'Password is too short').max(255, 'Password is too long!'),
            confirmPassword: z.string().nonempty('Confirm password is required!')
        }).refine(data => data.newPassword === data.confirmPassword, {
            message: 'Passwords do not match!',
            path: ['confirmPassword']
        })),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    })

    const onShowPassword = (field: string) => {
        setShowPassword({
            ...showPassword,
            [field as keyof typeof showPassword]: !showPassword[field as keyof typeof showPassword]
        })
    }

    const onChangePassword = (data: { oldPassword: string, newPassword: string, confirmPassword: string }) => {
        mutate(data, {
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: 'Password changed successfully!',
                })
                form.reset();
                nProgress.start();
                getJwtClient().removeJwt();
                const { removeJwt } = useUserStore.getState() as { removeJwt: () => void };
                removeJwt();
                nProgress.done();
                router.replace('/login')
            }
        })
    }

    return (
        <FadeIn
            className="space-y-6 "
        >

            <div
                className="p-6 space-y-6 border border-swamp-light/30 rounded-md"
            >
                <h2
                    className="text-lg font-semibold"
                >
                    Profile Details
                </h2>
                <DataItem
                    label="Name"
                    value={userData?.name ?? 'Staff Name'}
                />
                <DataItem
                    label="Email"
                    value={userData?.email ?? 'Staff Email'}
                />
                <DataItem
                    label="Mobile Number"
                    value={userData?.phone ?? 'Staff Phone'}
                />
            </div>
            <Form
                {...form}
            >
                <div
                    className="p-6 space-y-6 border border-swamp-light/30 rounded-md"
                >
                    <h3
                        className="text-lg font-semibold"
                    >
                        Change Password
                    </h3>
                    <form
                        onSubmit={form.handleSubmit(onChangePassword)}
                        className=" grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        <FormField
                            control={form.control}
                            name="oldPassword"
                            key="oldPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        className="text-base text-neutral-300"
                                    >
                                        Current Password
                                    </FormLabel>
                                    <div className="relative">
                                        <FormControl
                                        >
                                            <Input
                                                {...field}
                                                type={showPassword.oldPassword ? 'text' : 'password'}
                                                className="h-12"
                                            />
                                        </FormControl>
                                        <p
                                            itemType="button"
                                            className="absolute top-1/2 right-3 transform -translate-y-1/2  !text-white cursor-pointer "
                                            onClick={() => onShowPassword('oldPassword')}
                                        >
                                            {
                                                showPassword.oldPassword ? <EyeIcon size={16} /> : <EyeClosed size={16} />
                                            }
                                        </p>
                                    </div>
                                    <FormMessage />

                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            key="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        className="text-base text-neutral-300"
                                    >
                                        New Password
                                    </FormLabel>
                                    <div className="relative">
                                        <FormControl
                                        >
                                            <Input
                                                {...field}
                                                type={showPassword.newPassword ? 'text' : 'password'}
                                                className="h-12"
                                            />
                                        </FormControl>
                                        <p
                                            itemType="button"
                                            className="absolute top-1/2 right-3 transform -translate-y-1/2  !text-white cursor-pointer"
                                            onClick={() => onShowPassword('newPassword')}
                                        >
                                            {
                                                showPassword.newPassword ? <EyeIcon size={16} /> : <EyeClosed size={16} />
                                            }
                                        </p>
                                    </div>
                                    <FormMessage />

                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            key="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        className="text-base text-neutral-300"
                                    >
                                        Confirm Password
                                    </FormLabel>
                                    <FormControl
                                    >
                                        <Input
                                            {...field}
                                            type={showPassword.newPassword ? 'text' : 'password'}
                                            className="h-12"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="h-12 text-white"
                            disabled={isPending}
                        >
                            <Loader
                                className={cn('animate-spin',
                                    { 'hidden': !isPending }
                                )}
                            />
                            Change Password
                        </Button>
                    </form>
                </div>
            </Form>

        </FadeIn>
    )
}

const DataItem = ({ label, value }: { label: string, value: string }) => {
    return (
        <div
            className="space-y-2"
        >
            <h3
                className="font-semibold text-neutral-300"
            >
                {label}
            </h3>
            <p
                className="p-4 rounded-sm border border-white/40 bg-black/50 text-neutral-300 "
            >
                {value}
            </p>
        </div>
    )
}