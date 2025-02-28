'use client';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRequestPasswordReset } from "@/hooks/query-hooks";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FadeIn } from "../common";

export function AskEmail() {
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(z.object({
            email: z.string().email('Invalid email address!')
        })),
        defaultValues: {
            email: ""
        }
    });

    const { mutate, isPending } = useRequestPasswordReset();

    const onSubmit = async (data: { email: string }) => {
        mutate(data.email, {
            onSuccess: () => {
                router.replace('/reset-password');
                toast({
                    title: 'Success',
                    description: 'An email has been sent to your email address!',
                })
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
                    Forgot Password?
                </h2>
                <p
                    className="text-sm text-neutral-300"
                >
                    Please enter the email address associated to your account!
                </p>
            </article>

            <Form
                {...form}
            >
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name={'email'}
                        key={'email'}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Email
                                </FormLabel>
                                <FormControl
                                >
                                    <Input
                                        type="email"
                                        placeholder="Email"
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
                        className="h-12 w-full text-white mt-8"
                        disabled={isPending}
                    >
                        {
                            isPending && (
                                <Loader
                                    className="animate-spin"
                                />
                            )
                        }
                        Continue
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

            {/* <article
                className="text-center !mt-12"
            >
                <p>
                    Don&apos;t recieved an OTP?
                </p>
                <Button
                    className=" !text-swamp-light !bg-transparent "
                    variant="ghost"
                >
                    Resend
                </Button>
            </article> */}
        </FadeIn>
    )
}
