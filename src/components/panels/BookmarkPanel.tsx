// src/components/panels/BookmarkPanel.tsx
import React from "react";
import { useCaptureContext } from "../../context/CaptureContext";
import NotesList from "../NotesList";

export const BookmarkPanel: React.FC = () => {
  const { bookmarkCapture } = useCaptureContext();

  if (!bookmarkCapture || bookmarkCapture.length === 0) {
    return <div className="p-4 text-gray-500">No bookmarks found.</div>;
  }

  return (
    <div className="">
      <NotesList filter="bookmarks"/>
    </div>
  );
};

export default BookmarkPanel;
