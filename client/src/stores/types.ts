// Base types for stores that need loading/error states (API stores)
export interface BaseApiState {
  loading: boolean;
  error: string | null;
}

// Base actions for API stores
export interface BaseApiActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export type ContextSelectorMode = 
  | "collections"
  | "bookmarks"
  | "captures"
  | "models"
  | "models-default"  // For settings page - sets default model
  | null;


export type HoverCoachMode = 
  | "brain"
  | "collections"
  | "bookmarks"
  | "captures"
  | null;

// UI Store - no loading/error needed (instant state changes)
export interface UIState {
  // Sidebar states
  collapsed: boolean;
  middlePanelCollapsed: boolean;
  mainContentCollapsed: boolean;
  contextSelectorOpen: boolean;
  contextSelectorMode: ContextSelectorMode;
  hoverCoachVisible: boolean;
  hoverCoachMode: HoverCoachMode;
  hoverCoachAnchor: DOMRect | null;

  // Modal states
  openGlobalSearch: boolean;
  isFolderListOpen: boolean;
  openActionBar: boolean;
  openAiChat: boolean;
  expandAiChat: boolean;
  openAddCaptureModal: boolean;


  // Theme
  theme: "light" | "dark" | "system";
}

// UI Actions - no base actions needed (instant state changes)
export interface UIActions {
  // Sidebar actions
  setCollapsed: (collapsed: boolean) => void;
  setMiddlePanelCollapsed: (collapsed: boolean) => void;
  setMainContentCollapsed: (collapsed: boolean) => void;
  openContextSelector: (mode: ContextSelectorMode) => void
  closeContextSelector: () => void
  showHoverCoach: (mode: HoverCoachMode, anchor: HTMLElement) => void
  hideHoverCoach: () => void

  // Modal actions
  setOpenGlobalSearch: (open: boolean) => void;
  setIsFolderListOpen: (isOpen: boolean) => void;
  setOpenActionBar: (open: boolean) => void;
  setOpenAiChat: (open: boolean) => void;
  setExpandAiChat: (open: boolean) => void;
  setOpenAddCaptureModal: (open: boolean) => void;

  // Theme actions
  setTheme: (theme: "light" | "dark" | "system") => void;

  // Convenience methods
  toggleSidebar: () => void;
  toggleMiddlePanel: () => void;
  toggleMainContent: () => void;
  toggleGlobalSearch: () => void;
  toggleAiChat: () => void;
  toggleTheme: () => void;
  closeAllModals: () => void;
}

// Combined UI Store type
export type UIStore = UIState & UIActions;

// App Store - for global app state (user info, etc.)
export interface AppState extends BaseApiState {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  } | null;
  isAuthenticated: boolean;
  preferences: {
    theme: "light" | "dark" | "system";
    language: string;
    notifications: boolean;
  };
}

export interface AppActions extends BaseApiActions {
  setUser: (user: AppState["user"]) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  updatePreferences: (preferences: Partial<AppState["preferences"]>) => void;
  logout: () => void;
}

// Combined App Store type
export type AppStore = AppState & AppActions;

// Store selector types for better type safety
export type UIStoreSelector<T> = (state: UIStore) => T;
export type AppStoreSelector<T> = (state: AppStore) => T;
