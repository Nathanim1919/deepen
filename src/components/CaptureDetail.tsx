import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import NoteView from "../components/NoteView";
import EmptyNoteView from "../components/EmptyNoteView";
import { CaptureService } from "../api/capture.api";
import type { Capture } from "../types/Capture";
import { useCaptureContext } from "../context/CaptureContext";
import { NoteHeaderSkeleton } from "./skeleton/NoteHeaderSkeleton";
import { NoteSummarySkeleton } from "./skeleton/NoteSummarySkeleton";
import { NoteMetaBoxSkeleton } from "./skeleton/NoteMetaBoxSkeleton";
import HeadingOutlineSkeleton from "./skeleton/HeadingOutlineSkeleton";
import { useUI } from "../context/UIContext";
import { AIChatContainer } from "./Chat/AIChatContainer";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "../context/ChatContext";

export const CaptureDetail = () => {
  const { captureId } = useParams({ strict: false });
  const { setSelectedCapture } = useCaptureContext();
  const { setMessages } = useChat();
  const [capture, setCapture] = useState<Capture | null>(null);
  const { middlePanelCollapsed, openAiChat, expandAiChat, setExpandAiChat, setOpenAiChat } = useUI();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!captureId) {
      setCapture(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    CaptureService.getById(captureId)
      .then((data) => {
        setCapture(data);
        setSelectedCapture(data);
        setExpandAiChat(false); // Reset AI chat expansion when loading a new capture
        setOpenAiChat(false); // Reset action bar state
        setMessages([]); // Clear chat messages when loading a new capture
      })
      .catch(() => {
        setCapture(null);
      })
      .finally(() => setLoading(false));
  }, [captureId, setExpandAiChat, setMessages, setOpenAiChat, setSelectedCapture]);

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
      className={`${
        middlePanelCollapsed ? "w-full" : "w-0 md:w-full"
      } h-full overflow-hidden`}
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {capture ? (
        <motion.div
          className={`grid overflow-hidden h-screen ${
            expandAiChat
              ? "grid-cols-[0fr_1fr]":
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
