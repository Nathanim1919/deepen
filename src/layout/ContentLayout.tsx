import { Outlet, useLocation } from "@tanstack/react-router";
import { CaptureDetail } from "../components/CaptureDetail";
import { useUI } from "../context/UIContext";
import clsx from "clsx";
import { NewFolderFormCard } from "../components/cards/newFolderFormCard";
import { useFolderContext } from "../context/FolderContext";

export const ContentLayout = () => {
  const { middlePanelCollapsed } = useUI();
    const {setOpenNewFolderForm, openNewFolderForm } = useFolderContext();
  
  const location = useLocation();

  const isSearchRoute = location.pathname === "/in";

  const gridCols = isSearchRoute
    ? "grid-cols-[1fr]"
    : middlePanelCollapsed
    ? "grid-cols-[0fr_1fr]"
    : "grid-cols-[5fr_0fr] md:grid-cols-[0.3fr_1fr]";

  return (
    <div
      className={clsx(
        "h-full w-full grid transition-all bg-white dark:bg-black duration-300 ease-in-out",
        gridCols
      )}
    >
        <NewFolderFormCard
        open={openNewFolderForm}
        onClose={() => setOpenNewFolderForm(false)}
      />
      {!isSearchRoute && <Outlet />}
      <CaptureDetail />
    </div>
  );
};
