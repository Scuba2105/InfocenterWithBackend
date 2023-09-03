import { create } from 'zustand';

export const useConfirmation = create((set) => ({
    updateConfirmation: null,
    proceedUpdate: () => set((state) => ({updateConfirmation: "proceed"})),
    cancelUpdate: () => set((state) => ({updateConfirmation: "cancel"})),
    resetConfirmation: () => set((state) => ({updateConfirmation: null}))
})) 


export const useLoggedIn = create((set) => ({
    loggedIn: false,
    login: () => set({loggedIn: true}),
    logout: () => set({loggedIn: false}),
})) 

export const useUser = create((set) => ({
    userCredentials: {user: null, staffId: null, permissions: null},
    setUser: (name, id, permissions) => set((state) => ({userCredentials: {user: name, staffId: id, permissions: permissions}})),
    clearUser: () => set((state) => ({userCredentials: {user: null, staffId: null, permissions: null}})),
}))

export const useVendor = create((set) => ({
    vendor: "3M Australia",
    setVendor: (newVendor) => set((state) => ({vendor: newVendor})),
    resetVendor: () => set((state) => ({vendor: "3M Australia"})),
}))

export const useDevice = create((set) => ({
    device: "MX450",
    setDevice: (newDevice) => set((state) => ({device: newDevice})),
    resetDevice: () => set((state) => ({vendor: "MX450"})),
}))

