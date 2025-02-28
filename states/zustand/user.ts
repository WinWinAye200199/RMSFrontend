import { getJwtClient } from '@/services/getJwtClient'
import { create } from 'zustand'

export const useUserStore = create((set) => ({
    jwt: getJwtClient().jwt,
    setJwt: (jwt: JWT) => set({ jwt }),
    removeJwt: () => set({ jwt: undefined }),
}))