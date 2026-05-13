import { useFolderStore } from "../stores/folder-store";
import {
  useFolders,
  useAddCaptureToFolder,
  useCreateFolder,
  useDeleteFolder,
} from "./useFolders";

// Combined Hook: Folder Manager
export const useFolderManager = () => {
  // Zustand store for client state
  const folderStore = useFolderStore();

  // React Query for server state
  const foldersQuery = useFolders();

  // Mutations
  const addCaptureMutation = useAddCaptureToFolder();
  const createFolderMutation = useCreateFolder();
  const deleteFolderMutation = useDeleteFolder();

  // Combined actions
  const addCaptureToFolder = async (folderId: string, captureId: string) => {
    await addCaptureMutation.mutateAsync({ folderId, captureId });
  };

  const createFolder = async (folderData: { name: string; description?: string }) => {
    await createFolderMutation.mutateAsync(folderData);
  };

  const deleteFolder = async (folderId: string) => {
    await deleteFolderMutation.mutateAsync(folderId);
  };

  return {
    // Server state (from React Query)
    folders: foldersQuery.data || [],
    loading: foldersQuery.isLoading,
    error: foldersQuery.error,
    refetch: foldersQuery.refetch,

    // Client state (from Zustand)
    selectedFolder: folderStore.selectedFolder,
    setSelectedFolder: folderStore.setSelectedFolder,
    openNewFolderForm: folderStore.openNewFolderForm,
    setOpenNewFolderForm: folderStore.setOpenNewFolderForm,

    // Actions
    addCaptureToFolder,
    createFolder,
    deleteFolder,

    // Mutation states
    isAddingCapture: addCaptureMutation.isPending,
    isCreatingFolder: createFolderMutation.isPending,
    isDeletingFolder: deleteFolderMutation.isPending,
  };
};