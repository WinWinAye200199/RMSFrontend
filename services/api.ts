import axios, { AxiosInstance } from "axios";


export const createApi = (apiInstance: AxiosInstance) => {
    return thenData({
        // auth
        signup: (data: AuthCredentials) => apiInstance.post('/auth/signup', data),

        login: (data: Pick<AuthCredentials, 'email' | 'password'>) => apiInstance.post('/auth/login', data),

        changePassword: (data: { oldPassword: string, newPassword: string }) => apiInstance.put('/auth/change-password', data),

        requestPasswordReset: (data: { email: string }) => apiInstance.post('/auth/request-reset-password', data),

        resetPassword: (data: { token: string, newPassword: string, confirmedPassword: string }) => apiInstance.put('/auth/reset-password', data),

        // admin
        getAllStaffs: (): Promise<Staff[]> => apiInstance.get('/admin/profiles'),

        updateStaffInfo: ({ staffId, data }: { staffId: number, data: Partial<User> }) => apiInstance.put(`/admin/${staffId}`, data),

        deleteStaff: (staffId: number) => apiInstance.delete(`/admin/removeStaff/${staffId}`),

        getAllShifts: (): Promise<Shift[]> => apiInstance.get('/admin/getAllShift'),

        assignShift: (data: Pick<Staff & Shift, 'name' | 'date' | 'startTime' | 'endTime'>) => apiInstance.post('/admin/assignShift', data),

        updateShift: (data: Pick<Staff & Shift, 'id' | 'name' | 'date' | 'startTime' | 'endTime'>) => apiInstance.put(`/admin/shifts/${data.id}`, data),

        deleteShift: (shiftId: number) => apiInstance.delete(`/admin/removeShift/${shiftId}`),

        getAllAttendance: (): Promise<Attandance[]> => apiInstance.get('/admin/getAllAttendance'),

        getAllLeaveRequest: (): Promise<Leave[]> => apiInstance.get('/admin/getAllLeaveRequest'),

        updateLeaveRequest: ({ userId, status }: { userId: number, status: Pick<Leave, 'status'> }) => apiInstance.put(`/admin/updateLeaveRequest/${userId}`, { status }),

        getAllPayroll: (startDate: string, endDate: string): Promise<Payroll[]> => apiInstance.get(`/admin/all?startDate=${startDate}&endDate=${endDate}`),

        updateBasicSalary: (data: { userId: number, newSalary: number }) => apiInstance.put(`/admin/users/${data.userId}/salary`, { newSalary: data.newSalary }),

        // staff
        getProfile: () => apiInstance.get('/users/profile'),

        clockIn: (shiftId: number): Promise<{ success: boolean, message: string }> => apiInstance.post(`/users/attendance/clock-in/${shiftId}`),

        clockOut: (shiftId: number): Promise<{ success: boolean, message: string }> => apiInstance.post(`/users/attendance/clock-out/${shiftId}`),

        requestLeave: (data: Partial<Leave>) => apiInstance.post('/users/leave/request', data),

        getAttandanceHistory: (): Promise<Attandance[]> => apiInstance.get('/users/attendance/history'),

        getWorkSchedule: (): Promise<Shift[]> => apiInstance.get('/users/work-schedule'),

        getLeaveHistory: (): Promise<Leave[]> => apiInstance.get('/users/leave/history'),

        getPayroll: (startDate: string, endDate: string): Promise<{ totalWorkedHours: number, totalSalary: number }> => apiInstance.get('/users/salary?startDate=' + startDate + '&endDate=' + endDate),
    })

}

export const setApiToken = ({ apiInstance, token }: { apiInstance: AxiosInstance, token: string }) => {
    apiInstance.defaults.headers.common.Authorization = `Bearer ${token}`
}

export const removeApiToken = (apiInstance: AxiosInstance) => {
    apiInstance.defaults.headers.common.Authorization = undefined;
    axios.defaults.headers.common.Authorization = undefined;
}

// This function is used to get the data from the response object
export function thenData<T>(OriginApi: T): T {
    const _API: Partial<T> = {};
    for (const key in OriginApi) {
        if (OriginApi.hasOwnProperty(key)) {
            _API[key] = (...args: any[]) =>
                (OriginApi[key] as any)(...args)
                    .then((res: any) => res.data)
            // .catch((err: any) => {
            //     throw err.response.data;
            // });
        }
    }
    return _API as T;
}