import { create } from 'zustand';

export const useUsersStore = create((set) => ({
    users: [],
    setUsers: (users) => set({ users }),
    getUser: (id) => set((state) => state.users.find(u => u.id === id)),
}));
