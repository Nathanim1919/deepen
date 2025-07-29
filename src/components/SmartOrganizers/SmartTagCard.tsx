import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

// --- Type ---
export type SmartTag = {
  id: string;
  name: string;
  color: string;
  captures: number;
};

// --- Sample Tags ---
const sampleTags: SmartTag[] = [
  {
    id: "1",
    name: "AI",
    color: "#10B981", // emerald
    captures: 14,
  },
  {
    id: "2",
    name: "Design",
    color: "#F59E0B", // amber
    captures: 7,
  },
  {
    id: "3",
    name: "Marketing",
    color: "#3B82F6", // blue
    captures: 3,
  },
];

// --- Component ---
type SmartTagCardProps = {
  tag: SmartTag;
  onClick: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export const SmartTagCard: React.FC<SmartTagCardProps> = ({
  tag,
  onClick,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-4 py-3 rounded-xl hover:shadow-md transition group cursor-pointer"
      onClick={() => onClick(tag.id)}
    >
      <div className="flex items-center gap-3">
        {/* Color dot */}
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: tag.color }}
        />
        {/* Tag name */}
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          {tag.name}
        </span>
        {/* Tag count */}
        <span className="text-xs text-zinc-400">
          ({tag.captures} {tag.captures === 1 ? "capture" : "captures"})
        </span>
      </div>

      {/* Action buttons */}
      <div
        className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onEdit?.(tag.id)}
          className="text-zinc-500 hover:text-blue-500"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete?.(tag.id)}
          className="text-zinc-500 hover:text-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// --- Preview Component ---
export const SmartTagListPreview = () => {
  const navigate = useNavigate();
  const openTag = (id: string) => {
    navigate({ to: `/tags/${id}` }); // Navigate to tag route
  };
  const editTag = (id: string) => alert(`Edit tag ${id}`);
  const deleteTag = (id: string) => alert(`Delete tag ${id}`);

  return (
    <div className="flex flex-col gap-2 p-3 max-w-md">
      {sampleTags.map((tag) => (
        <SmartTagCard
          key={tag.id}
          tag={tag}
          onClick={openTag}
          onEdit={editTag}
          onDelete={deleteTag}
        />
      ))}
    </div>
  );
};

export default SmartTagCard;
