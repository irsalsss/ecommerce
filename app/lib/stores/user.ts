import { create } from "zustand";
import type { User } from "@prisma/client";

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  
  setUser: (user) => {
    set({ user });
  },

  clearUser: () => {
    set({ user: null });
  },

  isAuthenticated: () => {
    return get().user !== null;
  },

  isAdmin: () => {
    const { user } = get();
    return user?.role === "ADMIN";
  },
}));
