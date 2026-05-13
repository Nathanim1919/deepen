// src/App.tsx
import { useEffect } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes";
import { useUIStore } from "./stores/ui-store";

function App() {
  const { theme } = useUIStore();

  // Initialize theme on app startup
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  return <RouterProvider router={router} />;
}

export default App;
