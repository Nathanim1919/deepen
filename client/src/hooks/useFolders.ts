import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FolderService } from "../api/folder.api";
import { toast } from "sonner";


// Query Keys
export const folderQueryKeys = {
    all: ["folders"] as const,
    lists: () => [...folderQueryKeys.all, "list"] as const,
    list: () => [...folderQueryKeys.lists()] as const,
} as const;



// Hook: Fetch All Folders
export const useFolders = () => {
    return useQuery({
        queryKey: folderQueryKeys.list(),
        queryFn: () => FolderService.getAll(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000
    });
};


// Hook: Add Capture to Folder
export const useAddCaptureToFolder = () => {
    const queryClient = useQueryClient();


    return useMutation({
        mutationFn: ({ folderId, captureId }: { folderId: string, captureId: string }) => FolderService.addCapture(folderId, captureId),
        onSuccess: (result) => {
            // Invalidate and refresh folders
            queryClient.invalidateQueries({ queryKey: folderQueryKeys.lists() });

            toast.success(`Capture added to collection ${result.name}`);
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to add capture to folder");
        }
    });
};



// Hook: Create New Folder
export const useCreateFolder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (folderData: { name: string; description?: string }) =>
            FolderService.create(folderData),
        onSuccess: () => {
            // Invalidate and refetch folders
            queryClient.invalidateQueries({ queryKey: folderQueryKeys.lists() });

            toast.success("Folder created successfully");
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to create folder");
        },
    });
};


// Hook: Delete Folder
export const useDeleteFolder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (folderId: string) => FolderService.delete(folderId),
        onSuccess: () => {
            // Invalidate and refetch folders
            queryClient.invalidateQueries({ queryKey: folderQueryKeys.lists() });

            toast.success("Folder deleted successfully");
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to delete folder");
        },
    });
};