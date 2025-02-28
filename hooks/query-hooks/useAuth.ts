import { CLIENT_API } from "@/services/axios-client"
import { useMutation } from "@tanstack/react-query"

export const useLogin = () => {
    const { mutate, isPending, error } = useMutation({
        mutationKey: ['login'],
        mutationFn: (data: { email: string, password: string }) => CLIENT_API.login(data)
    })

    return {
        mutate,
        isPending,
        error
    }
}

export const useSignup = () => {
    const { mutate, isPending, error } = useMutation({
        mutationKey: ['signup'],
        mutationFn: (data: AuthCredentials) => CLIENT_API.signup(data)
    })

    return {
        mutate,
        isPending,
        error
    }
}

export const useRequestPasswordReset = () => {
    const { mutate, isPending, error } = useMutation({
        mutationKey: ['requestOTP'],
        mutationFn: (email: string) => CLIENT_API.requestPasswordReset({ email })
    })

    return {
        mutate,
        isPending,
        error
    }
}

export const useChanagePassword = () => {
    const { mutate, isPending, error } = useMutation({
        mutationKey: ['changePassword'],
        mutationFn: (data: { oldPassword: string, newPassword: string }) => CLIENT_API.changePassword(data),
    })

    return {
        mutate,
        isPending,
        error
    }
}

export const useResetPassword = () => {
    const { mutate, isPending, error } = useMutation({
        mutationKey: ['resetPassword'],
        mutationFn: (data: { token: string, newPassword: string, confirmedPassword: string }) => CLIENT_API.resetPassword(data),
    })

    return {
        mutate,
        isPending,
        error
    }
}