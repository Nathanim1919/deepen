import React, { createContext, useContext, useEffect, useState } from "react";
import type { IFolder } from "../types/Folder";
import { FolderService } from "../api/folder.api";
import { toast } from "sonner";
import { useCaptureContext } from "./CaptureContext";
import type { Capture } from "../types/Capture";

interface FolderContextType {
  folders: IFolder[];
  setFolders: React.Dispatch<React.SetStateAction<IFolder[]>>;
  openNewFolderForm: boolean;
  setOpenNewFolderForm: (value: boolean) => void;
  selectedFolder: IFolder | null;
  setSelectedFolder: React.Dispatch<React.SetStateAction<IFolder | null>>;
  loadingStates: {
    fetch: boolean;
    append: boolean;
  };
  setLoadingStates: React.Dispatch<
    React.SetStateAction<{
      fetch: boolean;
      append: boolean;
    }>
  >;
  error?: string;
  setError?: React.Dispatch<React.SetStateAction<string | undefined>>;
  addCaptureToFolder: (folderId: string, captureId: string) => Promise<void>;
}

const FolderContext = createContext<FolderContextType | undefined>(undefined);

export const FolderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<IFolder | null>(null);
  const [loadingStates, setLoadingStates] = useState({
    fetch: false,
    append: false,
  });
  const [error, setError] = useState<string | undefined>(undefined);
  const [openNewFolderForm, setOpenNewFolderForm] = useState<boolean>(false);
  const { selectedCapture } = useCaptureContext();

  const addCaptureToFolder = async (folderId: string, captureId: string) => {
    setLoadingStates((prev) => ({ ...prev, append: true }));
    try {
      const res = await FolderService.addCapture(folderId, captureId);
      if (res) {
        setFolders((prev) =>
          prev.map((folder) =>
            folder._id === folderId
              ? {
                  ...folder,
                  captures: [...folder.captures, selectedCapture as Capture],
                }
              : folder
          )
        );
      }
      toast.success(`Capture add to collection ${res.name}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoadingStates((prev) => ({ ...prev, append: false }));
    }
  };

  useEffect(() => {
    const fetchFolders = async () => {
      setLoadingStates((prev) => ({ ...prev, fetch: true }));
      try {
        const response = await FolderService.getAll();
        setFolders(response); // Ensure response is of type IFolder[]
      } catch (err) {
        console.error("Error fetching folders:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoadingStates((prev) => ({ ...prev, fetch: false }));
      }
    };

    fetchFolders();
  }, []);

  return (
    <FolderContext.Provider
      value={{
        folders,
        setFolders,
        selectedFolder,
        setSelectedFolder,
        loadingStates,
        setLoadingStates,
        error,
        setError,
        addCaptureToFolder,
        openNewFolderForm,
        setOpenNewFolderForm,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};

export const useFolderContext = (): FolderContextType => {
  const context = useContext(FolderContext);
  if (!context) {
    throw new Error("useFolderContext must be used within a FolderProvider");
  }
  return context;
};
