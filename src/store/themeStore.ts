import { create } from "zustand";
import { persist, StateStorage } from "zustand/middleware";

interface ThemeState {
    activeIndex: number;
    lastIndex: number;
    background: string | null;
    setActiveIndex: (index: number) => void;
    setLastIndex: (index: number) => void;
    setBackground: (color: string) => void;
}

type ThemeStore = ReturnType<typeof useThemeStore>;

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            activeIndex: 0,
            lastIndex: 0,
            background: null,
            setActiveIndex: (index) => set((state) => ({
                lastIndex: state.activeIndex,
                activeIndex: index,
            })),
            setLastIndex: (index) => set({ lastIndex: index }),
            setBackground: (color) => set({ background: color }),
        }),
        { name: "liquid-swipe-store" }
    )
);
