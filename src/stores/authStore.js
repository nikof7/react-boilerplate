import { create } from 'zustand';
import pb from '../api/client';

export const useAuthStore = create((set) => ({
    user: pb.authStore.record,
    isAuthenticated: pb.authStore.isValid,

    setUser: (user) => set({ user, isAuthenticated: true }),

    logout: () => {
        pb.authStore.clear();
        set({ user: null, isAuthenticated: false });
    },

    // Inicializar estado desde PocketBase authStore
    initialize: () => {
        set({
            user: pb.authStore.record,
            isAuthenticated: pb.authStore.isValid,
        });
    },
}));
