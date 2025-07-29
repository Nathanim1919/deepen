import React from "react";
import { Calendar, Clock, FileText, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type NoteMetaBoxProps = {
  domain: string;
  savedAt: string;
  wordCount: number;
};

export const NoteMetaBox: React.FC<NoteMetaBoxProps> = ({
  domain,
  savedAt,
  wordCount,
}) => {
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="rounded-2xl my-6 p-5 bg-white/70 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-sm transition-all">
      <div className="flex flex-wrap gap-3 md:gap-6 text-sm">
        <MetaItem
          icon={<Globe className="w-4 h-4 text-blue-500" />}
          label="Source"
          value={domain.length > 30 ? `${domain.slice(0, 30)}...` : domain}
        />
        <MetaItem
          icon={<Calendar className="w-4 h-4 text-emerald-500" />}
          label="Saved"
          value={`${formatDistanceToNow(new Date(savedAt))} ago`}
        />
        <MetaItem
          icon={<FileText className="w-4 h-4 text-violet-500" />}
          label="Words"
          value={`${wordCount}`}
        />
        <MetaItem
          icon={<Clock className="w-4 h-4 text-yellow-500" />}
          label="Read Time"
          value={`${readingTime} min`}
        />
      </div>
    </div>
  );
};

type MetaItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const MetaItem: React.FC<MetaItemProps> = ({ icon, label, value }) => (
  <div className="flex items-center gap-1 md:gap-3">
    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800/50">
      {icon}
    </div>
    <div className="flex flex-col leading-tight text-zinc-700 dark:text-zinc-300">
      <span className="text-xs text-zinc-400 dark:text-zinc-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  </div>
);
