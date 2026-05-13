import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IFolder } from "../types/Folder";

interface FolderState {
    selectedFolder: IFolder | null;
    openNewFolderForm: boolean;
}

interface FolderActions {
    setSelectedFolder: (folder: IFolder) => void;
    setOpenNewFolderForm: (open: boolean) => void;
}

type FolderStore = FolderState & FolderActions;


export const useFolderStore = create<FolderStore>()(
    persist(
        (set) => ({
            // State
            selectedFolder: null,
            openNewFolderForm: false,

            // Actions
            setSelectedFolder: (folder) => set({ selectedFolder: folder }),
            setOpenNewFolderForm: (open) => set({ openNewFolderForm: open })
        }),
        {
            name: 'folder-store',
            partialize: (state) => ({
                selectedFolder: state.selectedFolder,
                openNewFolderForm: state.openNewFolderForm
            }),
        }
    )
)