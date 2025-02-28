
interface AuthCredentials {
    name: string
    email: string
    phone: string
    password: string
    confirmedPassword: string
    role: string
    jobRole?: string
}

interface User {
    id: number
    name: string
    email: string
    phone: string
    role: string
}

interface Staff extends Pick<User, 'id' | 'name' | 'phone' | 'email'> {
    jobRole: string
    nextShift: string | null
    totalHoursWorked: number
    attendanceOverview: string | null
    basicSalary: number
    active: boolean
}

interface JWT {
    type: string,
    accessToken: string
    expiredAt: string
    role: string
}

interface Shift {
    id: number
    date: string
    startTime: string
    endTime: string
    staffName: string
    managerName: string
    active: boolean
    finish: boolean
}

interface Attandance extends Pick<Shift & Staff, 'id' | 'name' | 'date' | 'startTime' | 'endTime'> {
    status: string
    duration: number
}

interface Leave extends Pick<Attandance, 'id' | 'name' | 'status'> {
    startDate: string
    endDate: string
    reason: string
}

interface Payroll {
    userId: number
    username: string
    startDate: string
    endDate: string
    totalPayment: number
}