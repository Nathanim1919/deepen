import { SparklesIcon } from "lucide-react";

export const EmptyChatState = () => {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <SparklesIcon className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-1">Start a conversation</h3>
        <p className="text-gray-400 max-w-md">
          Ask about the current concept or reference available materials to get detailed explanations.
        </p>
      </div>
    );
  };