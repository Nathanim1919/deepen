import { Outlet, useLocation, useParams } from "@tanstack/react-router";
import { CaptureDetail } from "../components/CaptureDetail";
import { useStore } from "../context/StoreContext";
import clsx from "clsx";
import { NewFolderFormCard } from "../components/cards/newFolderFormCard";
import type { UIStore } from "../stores/types";
import { useFolderManager } from "../hooks/useFolderManager";
import { BrainChatContainer } from "../components/brainChat/BrainChatContainer";
import { EmptyChatView } from "../components/brainChat/EmptyChatView";

export const ContentLayout = () => {
  const { middlePanelCollapsed } = useStore().ui as UIStore;
    const {setOpenNewFolderForm, openNewFolderForm } = useFolderManager();
  
  const location = useLocation();
  const params = useParams({ strict: false });
  // @ts-ignore - accessing dynamic param
  const conversationId = params.conversationId;

  const isSearchRoute = location.pathname === "/in";
  const isBrainRoute = location.pathname.includes("/brain");

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
      
      {isBrainRoute ? (
        conversationId ? <BrainChatContainer /> : <EmptyChatView />
      ) : (
        <CaptureDetail />
      )}
    </div>
  );
};
