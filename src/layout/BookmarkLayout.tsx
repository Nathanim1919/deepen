import { useUI } from "../context/UIContext";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import NotesList from "../components/NotesList";

export const BookMarkLayout: React.FC = () => {
  const { middlePanelCollapsed, setMiddlePanelCollapsed } = useUI();

  return (
    <div
      className={`bg-[#faf7f7] dark:bg-[#141416]  ${
        middlePanelCollapsed ? "p-0" : ""
      } relative border-r border-gray-200 dark:border-zinc-800 overflow-y-auto`}
    >
      <div
        className="w-8 h-8 z-1000 hover:text-violet-500 rounded-full cursor-pointer hover:bg-transparent text-2xl grid place-items-center absolute top-3 right-0"
        onClick={() => setMiddlePanelCollapsed(!middlePanelCollapsed)}
      >
        <MdOutlineKeyboardDoubleArrowLeft />
      </div>
      <NotesList filter="bookmarks" />
    </div>
  );
};
