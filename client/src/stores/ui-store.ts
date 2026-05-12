import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UIStore } from "./types";




export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      collapsed: false,

      /* Context selector */
      contextSelectorOpen: false,
      contextSelectorMode: null,

       /* Hover coach */
      hoverCoachVisible: false,
      hoverCoachMode: null,
      hoverCoachAnchor: null,

      middlePanelCollapsed: false,
      mainContentCollapsed: false,
      openGlobalSearch: false,
      isFolderListOpen: false,
      openActionBar: false,
      openAiChat: false,
      expandAiChat: false,
      openAddCaptureModal: false,
      theme: "dark",

      // UI Actions
      // Actions
      setCollapsed: (collapsed) => set({ collapsed }),
      openContextSelector: (mode) =>
        set({
          contextSelectorOpen: true,
          contextSelectorMode: mode
        }),
    
      closeContextSelector: () =>
        set({
          contextSelectorOpen: false,
          contextSelectorMode: null
        }),
      setMiddlePanelCollapsed: (middlePanelCollapsed) =>
        set({ middlePanelCollapsed }),
      setMainContentCollapsed: (mainContentCollapsed) =>
        set({ mainContentCollapsed }),
      setOpenGlobalSearch: (openGlobalSearch) => set({ openGlobalSearch }),
      setIsFolderListOpen: (isFolderListOpen) => set({ isFolderListOpen }),
      setOpenActionBar: (openActionBar) => set({ openActionBar }),
      setOpenAiChat: (openAiChat) => set({ openAiChat }),
      setExpandAiChat: (expandAiChat) => set({ expandAiChat }),
      setOpenAddCaptureModal: (openAddCaptureModal) => set({ openAddCaptureModal }),
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to DOM
        if (typeof document !== "undefined") {
          document.documentElement.classList.remove("light", "dark");
          document.documentElement.classList.add(theme);
        }
      },

      /* Hover coach actions */
      showHoverCoach: (mode, anchor) =>
        set({ hoverCoachVisible: true, hoverCoachMode: mode, hoverCoachAnchor: anchor.getBoundingClientRect() }),
      hideHoverCoach: () =>
        set({ hoverCoachVisible: false, hoverCoachMode: null, hoverCoachAnchor: null }),

      // Convenience methods
      toggleSidebar: () => set((state) => ({ collapsed: !state.collapsed })),
      toggleMiddlePanel: () =>
        set((state) => ({ middlePanelCollapsed: !state.middlePanelCollapsed })),
      toggleMainContent: () =>
        set((state) => ({ mainContentCollapsed: !state.mainContentCollapsed })),
      toggleGlobalSearch: () =>
        set((state) => ({ openGlobalSearch: !state.openGlobalSearch })),
      toggleAiChat: () => set((state) => ({ openAiChat: !state.openAiChat })),
      // Toggle expand/collapse state for the AI chat panel
      toggleExpandAiChat: () =>
        set((state) => ({ expandAiChat: !state.expandAiChat })),
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === "dark" ? "light" : "dark";
          // Apply theme to DOM
          if (typeof document !== "undefined") {
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(newTheme);
          }
          return { theme: newTheme };
        }),
      closeAllModals: () =>
        set({
          openGlobalSearch: false,
          isFolderListOpen: false,
          openActionBar: false,
          openAiChat: false,
          expandAiChat: false,
          openAddCaptureModal: false,
        }),
    }),
    {
      name: "ui-store", // local storage key
      partialize: (state) => ({
        theme: state.theme,
        collapsed: state.collapsed,
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme to DOM when store is rehydrated
        if (state && typeof document !== "undefined") {
          document.documentElement.classList.remove("light", "dark");
          document.documentElement.classList.add(state.theme);
        }
      },
    },
  ),
);
