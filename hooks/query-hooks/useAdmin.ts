import { USER_ROLES } from "@/constants";
import { queryClient } from "@/hoc/LayoutWrapper";
import { CLIENT_API } from "@/services/axios-client";
import { useUserStore } from "@/states/zustand/user";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAllStaff = () => {

    const { data, isLoading, error } = useQuery({
        queryKey: ['staffs'],
        queryFn: () => CLIENT_API.getAllStaffs(),
    });

    return {
        data,
        isLoading,
        error
    }
}

export const useUpdateStaffInfo = () => {
    const { mutate, isPending, error } = useMutation({
        mutationKey: ['updateStaffInfo'],
        mutationFn: (payload: { staffId: number, data: Pick<User, 'name' | 'email' | 'role' | 'phone'> }) => CLIENT_API.updateStaffInfo(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staffs'] })
        }
    })

    return {
        mutate,
        isPending,
        error
    }
}

export const useDeleteStaff = () => {
    const { mutate, isPending, error } = useMutation({
        mutationKey: ['deleteStaff'],
        mutationFn: (staffId: number) => CLIENT_API.deleteStaff(staffId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staffs'] })
        }   
    })

    return {
        mutate,
        isPending,
        error
    }
}

export const useAssignShift = () => {
    const { mutate, isPending, error } = useMutation({
        mutationKey: ['assignShift'],
        mutationFn: (payload: Pick<Staff & Shift, 'name' | 'date' | 'startTime' | 'endTime'>) => CLIENT_API.assignShift(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shifts'] })
        }
    })

    return {
        mutate,
        isPending,
        error
    }
}

export const useUpdateShift = () => {
    const { mutate, isPending, error } = useMutation({
        mutationKey: ['updateShift'],
        mutationFn: (payload: Pick<Staff & Shift, 'id' | 'name' | 'date' | 'startTime' | 'endTime'>) => CLIENT_API.updateShift(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shifts'] })
        }
    })

    return {
        mutate,
        isPending,
        error
    }
}

export const useDeleteShift = () => {
    const { mutate, isPending, error } = useMutation({
        mutationKey: ['deleteShift'],
        mutationFn: (shiftId: number) => CLIENT_API.deleteShift(shiftId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shifts'] })
        }
    })

    return {
        mutate,
        isPending,
        error
    }
}

export const useGetAllShifts = () => {

    const jwt = useUserStore(state => state.jwt);
    const isAdmin = jwt?.role === USER_ROLES.ADMIN

    const { data, isLoading, error } = useQuery({
        queryKey: ['shifts'],
        queryFn: () => isAdmin ? CLIENT_API.getAllShifts() : CLIENT_API.getWorkSchedule()
    })

    return {
        data,
        isLoading,
        error
    }
}

export const useGetAllAttendance = () => {

    const jwt = useUserStore(state => state.jwt);
    const isAdmin = jwt?.role === USER_ROLES.ADMIN

    const { data, isLoading, error } = useQuery({
        queryKey: ['attendance'],
        queryFn: () => isAdmin ? CLIENT_API.getAllAttendance() : CLIENT_API.getAttandanceHistory()
    })

    return {
        data,
        isLoading,
        error
    }
}

export const useGetAllLeaveRequest = () => {

    const jwt = useUserStore(state => state.jwt);
    const isAdmin = jwt?.role === USER_ROLES.ADMIN

    const { data, isLoading, error } = useQuery({
        queryKey: ['leaveRequest'],
        queryFn: () => isAdmin ? CLIENT_API.getAllLeaveRequest() : CLIENT_API.getLeaveHistory()
    })

    return {
        data,
        isLoading,
        error
    }
}

export const useUpdateLeaveRequest = () => {
    const { mutate, isPending, error } = useMutation({
        mutationKey: ['updateLeaveRequest'],
        mutationFn: (payload: { userId: number, status: Pick<Leave, 'status'> }) => CLIENT_API.updateLeaveRequest(payload),
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

export const useGetAllPayroll = (startDate: string, endDate: string) => {

    const jwt = useUserStore(state => state.jwt);
    const isAdmin = jwt?.role === USER_ROLES.ADMIN

    const { data, isLoading, error } = useQuery({
        queryKey: ['payroll', startDate, endDate],
        queryFn: async () => {
            if (isAdmin) {
                return await CLIENT_API.getAllPayroll(startDate, endDate);
            } else {
                return await CLIENT_API.getPayroll(startDate, endDate)
            }
        }
    })

    return {
        data,
        isLoading,
        error
    }
}

export const useUpdateBasicSalary = () => {
    const { mutate, isPending, error } = useMutation({
        mutationKey: ['updateBasicSalary'],
        mutationFn: (payload: { userId: number, newSalary: number }) => CLIENT_API.updateBasicSalary(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staffs'] })
        }
    })

    return {
        mutate,
        isPending,
        error
    }
}