import { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/ChatContext";
import { SendHorizonal, Square } from "lucide-react";
import { useCaptureContext } from "../../context/CaptureContext";
import { doesUserHasApiKey } from "../../utils/profile.util";

export const ChatInput = () => {
  const { selectedCapture } = useCaptureContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage, userMessage, setUserMessage, isStreaming, cancelStream } = useChat();
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  const handleSend = () => {
    if (userMessage.trim()) {
      addMessage(selectedCapture?._id || "");
    }
    setUserMessage(""); // Clear input after sending
  };



  useEffect(() => {
    const checkApiKey = async () => {
      const result = await doesUserHasApiKey(); // Resolve the promise
      setHasApiKey(result);
    };
    checkApiKey();
  }, []);

  return (
    <div className="px-5 py-4 border-t border-gray-700/50 bg-white dark:bg-[#161618] backdrop-blur-2xl">
      {/* Suggested Prompts */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
        {["Explain like I'm 5", "Give me examples"].map((prompt) => (
          <button
            key={prompt}
            className="text-xs bg-gray-200 dark:bg-[#232326] text-black/70 dark:text-gray-300 px-3.5 py-2 rounded-full whitespace-nowrap flex-shrink-0 hover:bg-gray-200 cursor-pointer hover:dark:bg-gray-700 active:dark:bg-gray-600 active:bg-gray-300  transition-colors duration-150"
            onClick={() => {
              setUserMessage(prompt);
              textareaRef.current?.focus();
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Text Input */}
      <div className="relative">
        <textarea
          disabled={!hasApiKey || isStreaming}
          ref={textareaRef}
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          className="w-full bg-gray-100 dark:bg-[#1e1e21] backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700/30 dark:text-white py-3 px-5 pr-14 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-gray-500 text-sm leading-5 transition-all duration-200 scrollbar-hide"
          placeholder="Ask about the current concept..."
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
       <button
          className={`absolute right-2 bottom-3 p-2 rounded-full transition-all ${
            userMessage.trim()
              ? "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
              : "dark:bg-gray-700 bg-gray-300 text-gray-500"
          }`}
          onClick={handleSend}
        >
          {isStreaming?<Square
           onClick={cancelStream}
           className="w-5 fill-white h-5"/>:<SendHorizonal className="h-5 w-5 text-white" />
          }
        </button>
      </div>
    </div>
  );
};
