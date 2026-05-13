import { useChatStore, type IMessage } from "../stores/chat-store";
import { sendMessageStream } from "../api/chat.api";
import { useSettingsStore } from "../stores/settings-store";

export const useChatManager = () => {
  const chatStore = useChatStore();
  const { defaultModelId } = useSettingsStore();

  const addMessage = (captureId: string) => {
    if (!chatStore.userMessage.trim()) return;

    const userMessageObj: IMessage = {
      role: "user",
      content: chatStore.userMessage.trim(),
    };
    const updatedMessages = [...chatStore.messages, userMessageObj];
    
    chatStore.setMessages(updatedMessages);
    chatStore.setUserMessage("");
    chatStore.setIsStreaming(true);
    chatStore.setIsLoading(true);

    const controller = new AbortController();
    chatStore.setAbortController(controller);

    let streamedText = "";
    const assistantMessageIndex = updatedMessages.length;

    // Optimistically add an empty assistant message
    chatStore.setMessages([...updatedMessages, { role: "assistant", content: "" }]);

    sendMessageStream(
      updatedMessages,
      captureId,
      (chunk) => {
        streamedText += chunk;
        chatStore.updateMessage(assistantMessageIndex, {
          role: "assistant",
          content: streamedText,
        });
      },
      () => {
        chatStore.setIsLoading(false);
        chatStore.setIsStreaming(false);
        chatStore.setAbortController(null);
      },
      (errorMsg) => {
        console.error("Streaming Error:", errorMsg);
        chatStore.setChatFailed(true);
        chatStore.setIsLoading(false);
        chatStore.setIsStreaming(false);
      },
      controller.signal,
      defaultModelId, // Pass the selected model
    );
  };

  const cancelStream = () => {
    if (chatStore.abortController) {
      console.log("Aborting stream...");
      chatStore.abortController.abort();
      chatStore.setAbortController(null);
      chatStore.setIsStreaming(false);
      chatStore.setIsLoading(false);
      
      // Add cancellation message
      const currentMessages = chatStore.messages;
      const lastMessageIndex = currentMessages.length - 1;
      if (
        lastMessageIndex >= 0 &&
        currentMessages[lastMessageIndex].role === "assistant" &&
        currentMessages[lastMessageIndex].content === ""
      ) {
        const updatedLastMessage = {
          ...currentMessages[lastMessageIndex],
          content: "Stream cancelled by user.",
        };
        const newMessages = [...currentMessages];
        newMessages[lastMessageIndex] = updatedLastMessage;
        chatStore.setMessages(newMessages);
      } else {
        chatStore.setMessages([
          ...currentMessages,
          { role: "assistant", content: "Stream cancelled by user." },
        ]);
      }
    }
  };

  return {
    // State
    messages: chatStore.messages,
    userMessage: chatStore.userMessage,
    isLoading: chatStore.isLoading,
    isStreaming: chatStore.isStreaming,
    chatFailed: chatStore.chatFailed,

    // Actions
    setMessages: chatStore.setMessages,
    setUserMessage: chatStore.setUserMessage,
    setIsLoading: chatStore.setIsLoading,
    setIsStreaming: chatStore.setIsStreaming,
    clearMessages: chatStore.clearMessages,
    updateMessage: chatStore.updateMessage,
    removeMessage: chatStore.removeMessage,
    addMessage,
    cancelStream,
  };
};