'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/hooks/query-hooks";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, EyeClosed, EyeIcon, Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FadeIn } from "../common";

export function ResetPasswordForm() {

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const { mutate, isPending } = useResetPassword();
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(z.object({
            token: z.string(),
            newPassword: z.string().min(8, 'Password too short!').max(255, 'Password too long!'),
            confirmedPassword: z.string().nonempty('Please confirm your new password!')
        }).refine(data => data.newPassword === data.confirmedPassword, {
            message: 'Password does not match!',
            path: ['confirmedPassword']
        })),
        defaultValues: {
            token: '',
            newPassword: '',
            confirmedPassword: ''
        }
    });

    const onSubmit = (data: { token: string, newPassword: string, confirmedPassword: string }) => {
        mutate(data, {
            onSuccess: (result) => {
                console.log(result)
                toast({
                    title: "Success",
                    description: "Password reset successful!",
                })
                router.replace('/login')
            },
            onError: (error) => {
                toast({
                    title: 'Error',
                    description: error.message ?? 'An error occurred!',
                    status: 'error',
                    variant: 'destructive'
                })
            }
        })
    }

    return (
        <FadeIn
            className="auth-box"
        >
            <article
                className="space-y-2 text-center"
            >
                <h2
                    className="text-lg font-semibold"
                >
                    Create new password
                </h2>
                <p
                    className="text-sm text-neutral-300"
                >
                    Please provide an OTP code sent to your email, alongside with the new password!
                </p>
            </article>

            <Form
                {...form}
            >
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                    autoComplete="off"
                >
                    <FormField
                        control={form.control}
                        name="token"
                        key="token"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    OTP Code
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        className="h-12"
                                    />
                                </FormControl>
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
                                <FormLabel>
                                    Password
                                </FormLabel>
                                <div className="relative">
                                    <FormControl
                                    >
                                        <Input
                                            {...field}
                                            type={showPassword ? 'text' : 'password'}
                                            className="h-12"
                                        />
                                    </FormControl>
                                    <p
                                        itemType="button"
                                        className="absolute top-1/2 right-3 transform -translate-y-1/2  !text-white cursor-pointer "
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {
                                            showPassword ? <EyeClosed size={16} /> : <EyeIcon size={16} />
                                        }
                                    </p>
                                </div>
                                <FormMessage />

                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmedPassword"
                        key="confirmedPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Confirm Password
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type={showPassword ? 'text' : 'password'}
                                        className="h-12"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className="h-12 w-full text-white !mt-8"
                        disabled={isPending}
                    >
                        {
                            isPending && <Loader className="animate-spin" />
                        }
                        Submit
                    </Button>
                </form>
            </Form>

            <Button
                variant={'link'}
                className="w-fit mx-auto flex"
                asChild
            >
                <Link
                    href={'/login'}
                >
                    <ChevronLeft />
                    Back
                </Link>
            </Button>

        </FadeIn>
    )
}
