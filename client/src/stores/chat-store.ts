import { create } from "zustand";
import { persist } from "zustand/middleware";

export type IMessage = {
  role: "user" | "assistant";
  content: string;
  references?: { id: string; title: string; url: string }[];
};

interface ChatState {
  messages: IMessage[];
  userMessage: string;
  isLoading: boolean;
  isStreaming: boolean;
  chatFailed: boolean;
  abortController: AbortController | null;
}

interface ChatActions {
  setMessages: (messages: IMessage[]) => void;
  setUserMessage: (message: string) => void;
  setIsLoading: (loading: boolean) => void;
  setIsStreaming: (streaming: boolean) => void;
  setChatFailed: (failed: boolean) => void;
  setAbortController: (controller: AbortController | null) => void;
  clearMessages: () => void;
  updateMessage: (index: number, message: IMessage) => void;
  removeMessage: (index: number) => void;
}

type ChatStore = ChatState & ChatActions;

export const useChatStore = create<ChatStore>()(
  persist(
    (set, _) => ({
      // State
      messages: [],
      userMessage: "",
      isLoading: false,
      isStreaming: false,
      chatFailed: false,
      abortController: null,

      // Actions
      setMessages: (messages) => set({ messages }),
      setUserMessage: (message) => set({ userMessage: message }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setIsStreaming: (streaming) => set({ isStreaming: streaming }),
      setChatFailed: (failed) => set({ chatFailed: failed }),
      setAbortController: (controller) => set({ abortController: controller }),
      
      clearMessages: () => set({ messages: [] }),
      
      updateMessage: (index, message) => {
        set((state) => {
          const newMessages = [...state.messages];
          newMessages[index] = message;
          return { messages: newMessages };
        });
      },
      
      removeMessage: (index) => {
        set((state) => ({
          messages: state.messages.filter((_, i) => i !== index),
        }));
      },
    }),
    {
      name: "chat-store",
      partialize: (state) => ({
        messages: state.messages,
        userMessage: state.userMessage,
      }),
    }
  )
);