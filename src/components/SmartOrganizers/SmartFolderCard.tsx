import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { IoFolderOpen } from "react-icons/io5";
import { FaFolderPlus } from "react-icons/fa";
import { FaRegFolderOpen } from "react-icons/fa6";
import { NewFolderFormCard } from "../cards/newFolderFormCard";
import { useFolderContext } from "../../context/FolderContext";
import type { IFolder } from "../../types/Folder";
import { BiEdit } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";

// --- Component ---
type SmartFolderCardProps = {
  folder: IFolder;
  onOpen: (id: string) => void;
  onRename?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export const SmartFolderCard: React.FC<SmartFolderCardProps> = ({
  folder,
  onOpen,
}) => {
  return (
    <div
      className="relative border grid gap-1 w-full bg-white dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl p-3 cursor-pointer hover:shadow-md transition-all group"
      onClick={() => onOpen(folder._id)}
    >
      <div className={`bg-gray-800 place-self-start  p-1 rounded-md`}>
        <FaRegFolderOpen />
      </div>
      <div className="flex flex-col gap-1 mt-2">
        <h2
          className="text-sm font-semibold text-zinc-800 dark:text-zinc-100"
          title={folder.name}
        >
          {folder.name}
        </h2>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
          {folder.captures.length}{" "}
          {folder.captures.length === 1 ? "capture" : "captures"}
        </span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          Updated {new Date(folder.updatedAt).toLocaleDateString()}
        </span>
      </div>

      {/* Actions */}
      <div className=" absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          className="p-1 cursor-pointer rounded-md hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
          title="Rename Folder"
        >
          <BiEdit className="text-zinc-600 dark:text-zinc-300" />
        </button>
        <button
          className="p-1 cursor-pointer rounded-md hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
          title="Delete Folder"
        >
          <MdDeleteOutline className="text-zinc-600 dark:text-zinc-300" />
        </button>
      </div>
    </div>
  );
};

// --- Preview (for testing) ---
export const SmartFolderPreviewGrid = () => {
  const navigate = useNavigate();
  const [openNewFolderForm, setOpenNewFolderForm] = useState(false);

  const openFolder = (id: string) => {
    navigate({ to: "/folders/$folderId", params: { folderId: id } });
  };
  const renameFolder = (id: string) => alert(`Rename folder ${id}`);
  const deleteFolder = (id: string) => alert(`Delete folder ${id}`);

  const { folders, loadingStates } = useFolderContext();

  return (
    <div className="flex relative flex-col w-full gap-2 p-3 self-start overflow-auto">
      <div className="sticky top-0 z-999 backdrop-blur-3xl px-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm flex items-center gap-1 font-semibold text-zinc-800 dark:text-zinc-100">
            <IoFolderOpen className="inline-block text-lg" />
            Folders
          </h2>
          <button
            className="cursor-pointer text-white rounded-md transition-colors duration-200"
            onClick={() => setOpenNewFolderForm(true)}
          >
            <FaFolderPlus className="inline-block mr-1" />
          </button>
        </div>
      </div>
      <NewFolderFormCard
        open={openNewFolderForm}
        onClose={() => setOpenNewFolderForm(false)}
      />

      {loadingStates.fetch && (
        <div className="flex items-center justify-center w-full h-20">
          <span className="text-sm text-zinc-500">Loading folders...</span>
        </div>
      )}

      {!loadingStates.fetch && folders.length === 0 && (
        <div className="flex items-center justify-center w-full h-20">
          <span className="text-sm text-zinc-500">No folders available</span>
        </div>
      )}

      {folders?.map((folder) => (
        <SmartFolderCard
          key={folder._id}
          folder={folder}
          onOpen={openFolder}
          onRename={renameFolder}
          onDelete={deleteFolder}
        />
      ))}
    </div>
  );
};

export default SmartFolderCard;
