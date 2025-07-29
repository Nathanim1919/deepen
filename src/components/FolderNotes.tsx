import { FaFolder, FaFolderOpen } from "react-icons/fa";
import NotesList from "./NotesList";
import { FolderService } from "../api/folder.api";
import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { FiChevronRight } from "react-icons/fi";

export const FolderNotes = () => {
  const { folderId } = useParams({ strict: false });
  const [folder, setFolder] = useState<string | null>(null);

  useEffect(() => {
    const fetchFolder = async () => {
      const response = await FolderService.getById(folderId);
      setFolder(response.name);
    };
    fetchFolder();
  }, [folderId]);

  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-3 rounded-t-lg border-b border-gray-200 dark:border-gray-900">
      <div className="text-green-400 rounded-full flex items-center gap-1 py-1 px-2">
        <Link
         to={"/in/collections"}
         className="text-sm hover:underline font-medium hover:opacity-64 text-black/70 dark:text-gray-300 flex items-center gap-2">
          <FaFolder className="text-green-400" />
          Collections
        </Link>
        <FiChevronRight className="text-gray-400 dark:text-gray-500/70 flex-shrink-0" />
        <span className="text-sm font-medium text-green-400 rounded-full flex items-center gap-1">
          <FaFolderOpen className="text-green-400" />
          {folder && folder.length > 15 ? folder.slice(0, 15) + "..." : folder}
        </span>
      </div>
      </div>
      <div className="">
      <NotesList filter="folder" folderId={folderId} />
      </div>
    </div>
  );
};