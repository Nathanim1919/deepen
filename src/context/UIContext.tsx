// context/UIContext.tsx
import { createContext, useState, useContext, useEffect } from "react";

type UIContextType = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  middlePanelCollapsed: boolean;
  setMiddlePanelCollapsed: (collapsed: boolean) => void;
  mainContentCollapsed: boolean;
  setMainContentCollapsed: (collapsed: boolean) => void;
  openGlobalSearch: boolean;
  setOpenGlobalSearch: (open: boolean) => void;
  isFolderListOpen: boolean;
  setIsFolderListOpen: (isOpen: boolean) => void;
  openActionBar: boolean;
  setOpenActionBar: (open: boolean) => void;
  openAiChat: boolean;
  setOpenAiChat: (open: boolean) => void;
  expandAiChat: boolean;
  setExpandAiChat: (open: boolean) => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [middlePanelCollapsed, setMiddlePanelCollapsed] = useState(true);
  const [mainContentCollapsed, setMainContentCollapsed] = useState(true);
  const [openGlobalSearch, setOpenGlobalSearch] = useState(false);
  const [isFolderListOpen, setIsFolderListOpen] = useState(false);
  const [openActionBar, setOpenActionBar] = useState(false);
  const [openAiChat, setOpenAiChat] = useState(false);
  const [theme, setThemeState] = useState<"light" | "dark">("dark");
  const [expandAiChat, setExpandAiChat] = useState(false);

  // Set theme class and state
  const setTheme = (newTheme: "light" | "dark") => {
    console.log("Setting theme to:", newTheme);
    setThemeState(newTheme);
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);
    }
  };

  // Initialize theme from system preference
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
  }, [theme]);
  

  return (
    <UIContext.Provider
      value={{
        collapsed,
        setCollapsed,
        middlePanelCollapsed,
        setMiddlePanelCollapsed,
        mainContentCollapsed,
        setMainContentCollapsed,
        openGlobalSearch,
        setOpenGlobalSearch,
        isFolderListOpen,
        setIsFolderListOpen,
        openActionBar,
        setOpenActionBar,
        openAiChat,
        setOpenAiChat,
        theme,
        setTheme,
        expandAiChat,
        setExpandAiChat,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context)
    throw new Error("useUI must be used within a UIProvider");
  return context;
};
