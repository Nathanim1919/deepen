import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      theme="dark"
      richColors
      closeButton
      visibleToasts={3}
      toastOptions={{
        duration: 3000,
        unstyled: true,
        classNames: {
          toast: `
                w-full 
                backdrop-blur-lg
                flex
                items-center
                p-2
                gap-2
                bg-[#101011]
                border border-[#2b2b2e]
                shadow-lg
                rounded-xl
                overflow-hidden
                pointer-events-auto
                transition-all
                data-[swipe=cancel]:translate-x-0
                data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]
                data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]
                data-[swipe=move]:transition-none
              `,
          title: `
                text-sm
                font-medium
                text-gray-100
              `,
          description: `
                text-xs
                text-gray-400
              `,
          closeButton: `
                absolute
                right-2
                top-2
                rounded-sm
                p-1
                text-gray-400/70
                hover:text-gray-100
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-gray-400/30
                transition-colors
              `,
          success: `
                [--toast-icon-theme:theme(colors.emerald.500)]
                border-emerald-800/50
                [--toast-icon:theme(colors.emerald.500)]
              `,
          error: `
                [--toast-icon-theme:theme(colors.rose.500)]
                border-rose-800/50
                [--toast-icon:theme(colors.rose.500)]
              `,
          warning: `
                [--toast-icon-theme:theme(colors.amber.500)]
                border-amber-800/50
                [--toast-icon:theme(colors.amber.500)]
              `,
          info: `
                [--toast-icon-theme:theme(colors.blue.500)]
                border-blue-800/50
                [--toast-icon:theme(colors.blue.500)]
              `,
        },
      }}
    />
  </StrictMode>
);
