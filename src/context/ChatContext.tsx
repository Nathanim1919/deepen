import { createContext, useState, useContext } from "react";
import { sendMessageStream } from "../api/chat.api";

export type IMessage = {
  role: "user" | "assistant";
  content: string;
  references?: { id: string; title: string; url: string }[]; // Adjusted type for references
};

type ChatContextType = {
  messages: IMessage[];
  setMessages: (messages: IMessage[]) => void;
  userMessage: string;
  setUserMessage: (message: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
  clearMessages: () => void;
  addMessage: (captureId: string) => void;
  updateMessage: (index: number, message: IMessage) => void;
  removeMessage: (index: number) => void;
  cancelStream: () => void;
  chatFailed: boolean;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [chatFailed, setChatFailed] = useState(false);

  const clearMessages = () => setMessages([]);

  const addMessage = (captureId: string) => {
    if (!userMessage.trim()) return;

    const userMessageObj: IMessage = {
      role: "user",
      content: userMessage.trim(),
    };
    const updatedMessages = [...messages, userMessageObj];
    setMessages(updatedMessages);
    setUserMessage("");
    setIsStreaming(true);
    setIsLoading(true);

    const controller = new AbortController();
    setAbortController(controller);

    let streamedText = "";
    const assistantMessageIndex = updatedMessages.length;

    // Optimistically add an empty assistant message
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    sendMessageStream(
      updatedMessages,
      captureId,
      (chunk) => {
        streamedText += chunk;
        updateMessage(assistantMessageIndex, {
          role: "assistant",
          content: streamedText,
        });
      },
      () => {
        setIsLoading(false);
        setIsStreaming(false);
        setAbortController(null);
      },
      (errorMsg) => {
        console.error("Streaming Error:", errorMsg);
        setChatFailed(true);
        setIsLoading(false);
        setIsStreaming(false);
      },
      controller.signal
    );
  };

  const updateMessage = (index: number, message: IMessage) => {
    setMessages((prev) => {
      const newMessages = [...prev];
      newMessages[index] = message;
      return newMessages;
    });
  };

  const removeMessage = (index: number) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  const cancelStream = () => {
    if (abortController) {
      console.log("Aborting stream...");
      abortController.abort();
      setAbortController(null);
      setIsStreaming(false);
      setIsLoading(false);
      // Optional: Add a message to the chat indicating the stream was cancelled
      setMessages((prev) => {
        const lastMessageIndex = prev.length - 1;
        if (
          lastMessageIndex >= 0 &&
          prev[lastMessageIndex].role === "assistant" &&
          prev[lastMessageIndex].content === ""
        ) {
          // If the assistant message is empty, update it with cancellation message
          const updatedLastMessage = {
            ...prev[lastMessageIndex],
            content: "Stream cancelled by user.",
          };
          const newMessages = [...prev];
          newMessages[lastMessageIndex] = updatedLastMessage;
          return newMessages;
        }
        return [
          ...prev,
          { role: "assistant", content: "Stream cancelled by user." },
        ];
      });
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        isLoading,
        setIsLoading,
        isStreaming,
        setIsStreaming,
        clearMessages,
        addMessage,
        updateMessage,
        removeMessage,
        userMessage,
        setUserMessage,
        cancelStream,
        chatFailed,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
