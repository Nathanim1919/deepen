// src/components/panels/BookmarkPanel.tsx
import React from "react";
import NotesList from "../NotesList";

export const BookmarkPanel: React.FC = () => {
  return (
    <div className="">
      <NotesList filter="bookmarks"/>
    </div>
  );
};

export default BookmarkPanel;
