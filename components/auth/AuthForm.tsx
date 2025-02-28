'use client';

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { AUTH_FORM_FIELD_NAMES, AUTH_FORM_FIELD_TYPES, JOB_ROLES, ROLES } from "@/constants";
import { toast } from "@/hooks/use-toast";
import { setApiToken } from "@/services/api";
import { axiosClient } from "@/services/axios-client";
import { getJwtClient } from "@/services/getJwtClient";
import { useUserStore } from "@/states/zustand/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosed, EyeIcon, Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import { useState } from "react";
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { ZodType } from "zod";
import { FadeIn } from "../common";

export enum FORM_TYPES {
    LOGIN = 'LOGIN',
    SIGN_IN = 'SIGN_IN'
}

const SELECT_OPTIONS = {
    role: ROLES,
    jobRole: JOB_ROLES
}

interface Props<T extends FieldValues> {
    schema: ZodType<T>,
    defaultValues: T,
    onSubmit: (data: T) => Promise<JWT | AuthCredentials | any>,
    type: FORM_TYPES
}

export function AuthForm<T extends FieldValues>({ schema, defaultValues, onSubmit, type }: Props<T>) {

    const [userRole, setUserRole] = useState<string>(defaultValues?.role);
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();
    const isLogin = type === FORM_TYPES.LOGIN

    const form: UseFormReturn<T> = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleSubmit: SubmitHandler<T> = async (data) => {

        setLoading(true);
        nProgress.start();
        if (data?.role === ROLES.ADMIN) {
            delete data?.jobRole;
        }

        try {
            const result = await onSubmit(data);
            if ('accessToken' in result || 'success' in result) {
                toast({
                    title: 'Success',
                    description: isLogin ? 'Login successful!' : 'Signup successful! Please Login to continue.',
                })
                if (isLogin) {
                    let jwt: JWT = {
                        accessToken: '',
                        expiredAt: '',
                        role: '',
                        type: ''
                    }
                    if ('accessToken' in result && 'expiredAt' in result && 'role' in result) {
                        jwt = {
                            accessToken: result?.accessToken,
                            expiredAt: result?.expiredAt,
                            role: result?.role,
                            type: 'Bearer'
                        }
                    }
                    setApiToken({
                        apiInstance: axiosClient,
                        token: jwt.accessToken
                    })
                    getJwtClient().setJwt(jwt);
                    useUserStore.getState().setJwt(jwt);
                    // if (jwt?.role == USER_ROLES.ADMIN) {
                    //     router.push('/')
                    //     return;
                    // }
                    // if (jwt?.role == USER_ROLES.USER) {
                    //     router.push('/attandances');
                    //     return;
                    // }
                } else {
                    router.replace('/login');
                }
            } else {
                toast({
                    title: 'Error',
                    description: result?.message ?? `Unkown error occured while${isLogin ? ' logging in!' : ' signing up your account!'}`,
                    variant: "destructive"
                })
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.response?.data?.message || error?.message || 'An error occured while processing your request!',
                variant: "destructive"
            })
        } finally {
            setLoading(false);
            nProgress.done();
        }
    }

    return (
        <FadeIn
            className="auth-box"
        >
            <h2
                className="text-lg font-semibold text-center"
            >
                {isLogin ? 'Login to account' : 'Create an account'}
            </h2>

            <Form
                {...form}
            >
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4"
                >
                    {
                        Object.keys(defaultValues).map((key) => {

                            if (userRole === ROLES.ADMIN && key === 'jobRole') return null;

                            return (
                                <FormField
                                    key={key}
                                    name={key as Path<T> & string}
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                className="text-sm font-medium"
                                            >
                                                {AUTH_FORM_FIELD_NAMES[field.name as keyof typeof AUTH_FORM_FIELD_NAMES]}
                                            </FormLabel>
                                            <div
                                                className="relative"
                                            >
                                                <FormControl>
                                                    {
                                                        (field.name === 'role' ||
                                                            field.name === 'jobRole'
                                                        ) ? (
                                                            <Select
                                                                onValueChange={(value) => {
                                                                    setUserRole(value as string);
                                                                    field.onChange(value);
                                                                }}
                                                                defaultValue={field.value}
                                                            >
                                                                <SelectTrigger
                                                                    className="h-12"
                                                                >
                                                                    <SelectValue placeholder="Select Role" />
                                                                </SelectTrigger>
                                                                <SelectContent
                                                                    className="bg-swamp-foreground"
                                                                >
                                                                    {
                                                                        Object.entries(SELECT_OPTIONS[field.name as keyof typeof SELECT_OPTIONS]).map((role) => (
                                                                            <SelectItem
                                                                                key={role[0]}
                                                                                value={role[0]}
                                                                                className="h-12 cursor-pointer text-white"
                                                                            >
                                                                                {role[1]}
                                                                            </SelectItem>
                                                                        ))
                                                                    }
                                                                </SelectContent>
                                                            </Select>
                                                        ) : (
                                                            <Input
                                                                {...field}
                                                                type={(field.name === 'password' || field.name === 'confirmedPassword') ? (showPassword ? 'text' : 'password') : AUTH_FORM_FIELD_TYPES[field.name as keyof typeof AUTH_FORM_FIELD_TYPES]}
                                                                placeholder={AUTH_FORM_FIELD_NAMES[field.name as keyof typeof AUTH_FORM_FIELD_NAMES]}
                                                                className="h-12"
                                                            />
                                                        )
                                                    }
                                                </FormControl>
                                                {
                                                    (field.name === 'password') && (
                                                        <p
                                                            itemType="button"
                                                            className="absolute top-1/2 right-3 transform -translate-y-1/2  !text-white cursor-pointer "
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            {
                                                                showPassword ? <EyeIcon size={16} /> : <EyeClosed size={16} />
                                                            }
                                                        </p>
                                                    )
                                                }
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )
                        })
                    }
                    <Button
                        className="w-full h-12 text-white !mt-8"
                        type="submit"
                        disabled={loading}
                    >
                        {
                            loading && (
                                <Loader
                                    className="animate-spin"
                                />
                            )
                        }
                        {isLogin ? 'Login' : 'Sign up'}
                    </Button>
                </form>
            </Form>

            {
                isLogin && (
                    <Button
                        variant='link'
                        asChild
                        className="mx-auto block w-fit"
                    >
                        <Link
                            href={'/forgot-password'}
                        >
                            Forgot Password?
                        </Link>
                    </Button>
                )
            }

            <p
                className="text-center text-sm font-medium"
            >
                {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"
                }
                <Button
                    asChild
                    variant="link"
                >
                    <Link
                        href={isLogin ? "/sign-up" : "/login"}
                    >
                        {
                            isLogin
                                ? "Create an account"
                                : "Login"
                        }
                    </Link>
                </Button>
            </p>
        </FadeIn>
    )
}
