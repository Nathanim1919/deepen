import { create } from "zustand";
import type { AppStore } from "./types";
import { persist } from "zustand/middleware";

export const useAppStore = create<AppStore>()(
    persist(
        (set, _) => ({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
            preferences: {
                theme: "dark",
                language: "en",
                notifications: true,
            },
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
            updatePreferences: (preferences) => set((state) => ({
                preferences: {
                    ...state.preferences,
                    ...preferences
                }
            })),
            logout: () => set({ user: null, isAuthenticated: false }),
            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null })
        }),
        {
            name: "app-store",
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                preferences: state.preferences
            })
        }
    )
);