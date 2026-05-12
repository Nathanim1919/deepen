import { useStore } from "../context/StoreContext";
import { BsBookmarkHeart } from "react-icons/bs";
import { MdOutlineLanguage } from "react-icons/md";
import { LuFolderOpen } from "react-icons/lu";
import { FaRegUserCircle } from "react-icons/fa";
import {
  Brain,
  PanelRightClose,
  PanelRightOpen,
  Sun,
  Moon,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import { SidebarItem } from "./SidebarItem";
import { IoSearch } from "react-icons/io5";
import { IoDocumentsOutline } from "react-icons/io5";
import type { UIStore } from "../stores/types";

const navItems = [
  {
    icon: <IoDocumentsOutline />,
    label: "Captures",
    path: "/in/captures",
  },
  {
    icon: <BsBookmarkHeart />,
    label: "Bookmarks",
    path: "/in/bookmarks",
  },
  // {
  //   icon: <FaFileAlt />,
  //   label: "Files",
  //   path: "/in/files",
  // },
  {
    icon: <Brain />,
    label: "Brain",
    path: "/in/brain",
  },
  {
    icon: <IoSearch />,
    label: "Search",
    path: "/in",
  },
  {
    icon: <LuFolderOpen />,
    label: "Collections",
    path: "/in/collections",
  },
  {
    icon: <MdOutlineLanguage />,
    label: "Sources",
    path: "/in/sources",
  },
];

const Sidebar: React.FC<{
  hideSidebar?: boolean;
  setHideSidebar?: (hide: boolean) => void;
  user: {
    id: string;
    email: string;
    name: string;
    token: string;
  };
}> = ({ user, hideSidebar, setHideSidebar }) => {
  const { collapsed, setCollapsed, theme, toggleTheme, setOpenAddCaptureModal } = useStore()
    .ui as UIStore;

  return (
    <motion.div
      className={`h-screen relative z-900 bg-white dark:bg-[#1A1A1C] border-r border-gray-100 dark:border-gray-800/40
    text-gray-600 dark:text-gray-300 flex flex-col justify-start md:justify-between gap-10 md:gap-0 pb-6
    transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
    /* Mobile behavior (controlled by hideSidebar) */
    ${
      hideSidebar
        ? "max-md:w-0 max-md:overflow-hidden max-md:translate-x-[-100%]"
        : ""
    }
    /* Desktop behavior (controlled by collapsed) */
    ${collapsed ? "w-12 md:w-14" : "w-36"}
  `}
    >
      <div
        className={`flex border-b border-gray-200 dark:border-gray-800 items-center ${
          collapsed ? "justify-center" : "justify-between px-2"
        }`}
      >
        <div
          onClick={() => {
            setCollapsed(false);
          }}
          className={`p-4 ${collapsed ? "hover:cursor-e-resize" : ""} group ${
            collapsed ? "hover:bg-white/5" : ""
          } backdrop-blur-sm`}
        >
          <Brain
            className={`${
              collapsed ? "group-hover:hidden" : ""
            } w-5 h-5 dark:text-gray-300`}
          />
          {collapsed && (
            <PanelRightClose className="hidden w-5 h-5 group-hover:grid text-gray-600" />
          )}
        </div>
        {!collapsed && (
          <div
            onClick={() => {
              setHideSidebar?.(true);
              setCollapsed(true);
            }}
            className="hover:cursor-e-resize group hover:bg-white/5 rounded-lg backdrop-blur-sm"
          >
            <PanelRightOpen className="w-5 h-5 text-gray-400 dark:text-gray-600" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className=" w-full flex-1 py-6 px-2">
        <nav className="flex flex-col gap-5 ">
          {navItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              collapsed={collapsed}
            />
          ))}
        </nav>

        {/* Add Capture Button */}
        <button
          onClick={() => setOpenAddCaptureModal(true)}
          className={`mt-5 w-full flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Add Capture" : ""}
        >
          <Plus className="w-5 h-5" />
          {!collapsed && (
            <span className="text-sm font-medium">Add</span>
          )}
        </button>
      </div>

      {/* User & Logout */}
      <div className="flex flex-col border-t border-gray-200 dark:border-gray-800 w-full justify-self-end px-2 gap-1">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`flex cursor-pointer items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 ${
            collapsed ? "justify-center" : ""
          }`}
          title={
            collapsed
              ? theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
              : ""
          }
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-blue-500" />
          )}
          {!collapsed && (
            <span className="text-sm font-medium">
              {theme === "dark" ? "Light" : "Dark"}
            </span>
          )}
        </button>

        {/* Profile Link */}
        <SidebarItem
          icon={
            <div className="relative">
              <FaRegUserCircle size={20} className="text-gray-400" />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-gray-900"></span>
            </div>
          }
          label={
            user.name.length > 7 ? `${user.name.slice(0, 7)}...` : user.name
          }
          path="/profile"
          collapsed={collapsed}
        />
      </div>
    </motion.div>
  );
};

export default Sidebar;
