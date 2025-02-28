'use client'

import { AuthForm, FORM_TYPES } from "@/components/auth";
import { CLIENT_API } from "@/services/axios-client";
import { z } from "zod";

const LoginSchema = z.object({
    email: z.string().email('Invalid email address').nonempty('Email is required'),
    password: z.string().nonempty('Password is required')
})

export default function Login() {
    return (
        <>
            <AuthForm
                schema={LoginSchema}
                type={FORM_TYPES.LOGIN}
                onSubmit={(data) => CLIENT_API.login(data)}
                defaultValues={{
                    email: "",
                    password: ""
                }}
            />
        </>
    )
}
