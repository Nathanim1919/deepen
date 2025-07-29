import { useUI } from "../context/UIContext";
import { BsBookmarkHeart } from "react-icons/bs";
import { MdOutlineLanguage } from "react-icons/md";
import { LuFolderOpen } from "react-icons/lu";
import { FaRegUserCircle } from "react-icons/fa";
import {
  Brain,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import { SidebarItem } from "./SidebarItem";
import { IoSearch } from "react-icons/io5";
import { IoDocumentsOutline } from "react-icons/io5";

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
  const { collapsed, setCollapsed} = useUI();

  return (
    <motion.div
      className={`h-screen relative z-900 bg-white dark:bg-[#1A1A1C] border-r border-gray-200 dark:border-gray-800/40
    text-gray-600 dark:text-gray-300 flex flex-col justify-start gap-10 md:gap-0 md:justify-between py-6 
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
      {/* Logo */}
      <div
        className={`flex items-center ${
          collapsed ? "justify-center" : "justify-between px-2"
        }`}
      >
        <div
          onClick={() => {
            setCollapsed(false);
          }}
          className={`p-2 ${collapsed ? "hover:cursor-e-resize" : ""} group ${
            collapsed ? "hover:bg-white/5" : ""
          } rounded-lg backdrop-blur-sm`}
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
            className="p-2 hover:cursor-e-resize group hover:bg-white/5 rounded-lg backdrop-blur-sm"
          >
            <PanelRightOpen className="w-5 h-5 text-gray-400 dark:text-gray-600" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className=" w-full px-2">
        <nav className="flex flex-col gap-4">
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
      </div>

      {/* User & Logout */}
      <div className="flex flex-col w-full px-2 gap-1">
        {/* Theme Toggle */}

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
          {/* <SidebarItem
            icon={theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
            label={theme === "dark" ? "Dark" : "Light"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            collapsed={collapsed}
          /> */}
      </div>
    </motion.div>
  );
};

export default Sidebar;
