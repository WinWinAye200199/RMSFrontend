import { queryClient } from "@/hoc/LayoutWrapper"
import { CLIENT_API } from "@/services/axios-client"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useGetUserData = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['staff'],
        queryFn: () => CLIENT_API.getProfile()
    })

    return {
        data,
        isLoading,
        error
    }
}

export const useClockInAssign = () => {
    const { mutate, isPending, error } = useMutation({
        mutationKey: ['clockInAssign'],
        mutationFn: (shiftId: number) => CLIENT_API.clockIn(shiftId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendance'] })
        }
    })

    return {
        mutate,
        isPending,
        error
    }
}

export const useClockOutAssign = () => {
    const { mutate, isPending, error } = useMutation({
        mutationKey: ['clockOutAssign'],
        mutationFn: (shiftId: number) => CLIENT_API.clockOut(shiftId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendance'] })
        }
    })

    return {
        mutate,
        isPending,
        error
    }
}

export const useRequestLeave = () => {
    const { mutate, isPending, error } = useMutation({
        mutationKey: ['clockOutAssign'],
        mutationFn: (payload: Pick<Leave, 'reason' | 'startDate' | 'endDate'>) => CLIENT_API.requestLeave(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leaveRequest'] })
        }
    })

    return {
        mutate,
        isPending,
        error
    }
}

export const useGetUserAttandanceHistory = () => {
    const { data, isPending, error } = useQuery({
        queryKey: ['attandanceHistory'],
        queryFn: () => CLIENT_API.getAttandanceHistory()
    })

    return {
        data,
        isPending,
        error
    }
}

export const useGetWorkSchedule = () => {
    const { data, isPending, error } = useQuery({
        queryKey: ['workSchedule'],
        queryFn: () => CLIENT_API.getWorkSchedule()
    })

    return {
        data,
        isPending,
        error
    }
}

// export const useGetLeaveHistory = () => {
//     const { data, isPending, error } = useQuery({
//         queryKey: ['leaveHistory'],
//         queryFn: () => CLIENT_API.getLeaveHistory()
//     })

//     return {
//         data,
//         isPending,
//         error
//     }
// }

export const useGetPayrollHistory = () => {
    const { data, isPending, error } = useQuery({
        queryKey: ['payrollHistory'],
        queryFn: () => CLIENT_API.getPayroll()
    })

    return {
        data,
        isPending,
        error
    }
}