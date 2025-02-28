'use client';

import { AuthForm, FORM_TYPES } from "@/components/auth";
import { SERVER_API } from "@/services/axios-server";
import { z } from "zod";

const SignupSchema = z.object({
    name: z.string().min(3, 'Name is too short!').max(255, 'Name is too long!'),
    email: z.string().email('Invalid email address').nonempty('Email is required!'),
    phone: z.string().regex(/^\d{6,11}$/, { message: "Invalid mobile number!" }),
    password: z.string().min(8, 'Password is too short!').max(255, 'Password is too long!'),
    confirmedPassword: z.string().nonempty('Confirm password is required!'),
    role: z.enum(["USER", "ADMIN"], { message: "Invalid role" }),
    jobRole: z.optional(z.enum(['CHEF', 'WAITER', 'MANAGER', 'CASHIER'], { message: "Invalid job role" })),
}).refine(data => data.password === data.confirmedPassword, {
    message: "Passwords do not match",
    path: ["confirmedPassword"]
})

export default function Signup() {
    return (
        <>
            <AuthForm
                schema={SignupSchema}
                onSubmit={(data) => SERVER_API.signup(data)}
                type={FORM_TYPES.SIGN_IN}
                defaultValues={{
                    name: "",
                    email: "",
                    phone: "",
                    password: "",
                    confirmedPassword: "",
                    role: "USER",
                    jobRole: "CHEF"
                }}
            />
        </>
    )
}
