import { useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import NoteView from "./NoteView";
import EmptyNoteView from "./EmptyNoteView";
import { useCaptureDetail } from "../hooks/useCaptureManager";
import { NoteHeaderSkeleton } from "./skeleton/NoteHeaderSkeleton";
import { NoteSummarySkeleton } from "./skeleton/NoteSummarySkeleton";
import { NoteMetaBoxSkeleton } from "./skeleton/NoteMetaBoxSkeleton";
import HeadingOutlineSkeleton from "./skeleton/HeadingOutlineSkeleton";
import { useStore } from "../context/StoreContext";
import { AIChatContainer } from "./Chat/AIChatContainer";
import { AnimatePresence, motion } from "framer-motion";
import type { UIStore } from "../stores/types";
import { useChatManager } from "../hooks/useChatManager";

export const CaptureDetail = () => {
  const { captureId } = useParams({ strict: false });
  const { setMessages } = useChatManager();
  const { middlePanelCollapsed, openAiChat, expandAiChat, setExpandAiChat, setOpenAiChat } = useStore().ui as UIStore;

  // Use the new capture detail hook
  const {
    capture,
    isLoading: loading,
    setAsSelected,
  } = useCaptureDetail(captureId || '');

  useEffect(() => {
    if (captureId && capture) {
      setAsSelected();
      setExpandAiChat(false); // Reset AI chat expansion when loading a new capture
      setOpenAiChat(false); // Reset action bar state
      setMessages([]); // Clear chat messages when loading a new capture
    }
  }, [captureId, capture]); // Remove function dependencies to prevent infinite loops

  if (loading)
    return (
      <div className="md:w-[60%] w-[90%] mx-auto mt-6">
        <NoteHeaderSkeleton />
        <HeadingOutlineSkeleton />
        <NoteSummarySkeleton />
        <NoteMetaBoxSkeleton />
      </div>
    );

  return (
    <motion.div
      className={`${middlePanelCollapsed ? "w-full" : "w-0 md:w-full"
        } h-full overflow-hidden`}
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {capture ? (
        <motion.div
          className={`grid overflow-hidden h-screen ${expandAiChat
            ? "grid-cols-[0fr_1fr]" :
            openAiChat
              ? "grid-cols-[0fr_1fr] md:grid-cols-[0.65fr_0.35fr]"
              : "grid-cols-[1fr]"
            }`}
          initial={false}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <NoteView capture={capture} />

          <AnimatePresence>
            {openAiChat && (
              <motion.div
                className="h-full relative w-full overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <AIChatContainer />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyNoteView />
      )}
    </motion.div>
  );
};
