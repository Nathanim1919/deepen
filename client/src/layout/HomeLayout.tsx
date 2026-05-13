import { useStore } from "../context/StoreContext";
import NotesList from "../components/NotesList";
import type { UIStore } from "../stores/types";
import { PanelRightOpen } from "lucide-react";

export const HomeLayout: React.FC = () => {
  const { middlePanelCollapsed, setMiddlePanelCollapsed } = useStore()
    .ui as UIStore;

  return (
    <div
      className={`bg-[#faf7f7] dark:bg-[#141416] ${
        middlePanelCollapsed ? "p-0" : ""
      } relative border-r border-gray-200 dark:border-zinc-800 overflow-y-auto`}
    >
      <div
        className="w-8 z-1000 h-8 rounded-full cursor-pointer hover:bg-transparent text-2xl grid place-items-center dark:text-gray-200 text-[#333] absolute top-1 hover:opacity-45 right-0"
        onClick={() => setMiddlePanelCollapsed(!middlePanelCollapsed)}
      >
        <PanelRightOpen
        size={18}
        className="text-gray-400 dark:text-gray-600 hover:opacity-85"
        />
      </div>
      <NotesList filter="all" />
    </div>
  );
};
