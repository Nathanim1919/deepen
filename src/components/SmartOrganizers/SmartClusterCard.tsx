// import React from "react";
// import { Sparkles, Pencil, Pin, Layers3 } from "lucide-react";
// import { useNavigate } from "@tanstack/react-router";

// // --- Type ---
// export type SmartCluster = {
//   id: string;
//   title: string;
//   emoji?: string;
//   description?: string;
//   captures: number;
//   pinned?: boolean;
// };

// // --- Sample Clusters ---
// const sampleClusters: SmartCluster[] = [
//   {
//     id: "cluster-1",
//     title: "AI & Machine Learning",
//     emoji: "🤖",
//     description:
//       "Captures about transformers, LLMs, neural networks, and AI trends.",
//     captures: 21,
//     pinned: true,
//   },
//   {
//     id: "cluster-2",
//     title: "Productivity Systems",
//     emoji: "🧠",
//     description:
//       "Zettelkasten, time management, second brain, and Notion workflows.",
//     captures: 10,
//   },
//   {
//     id: "cluster-3",
//     title: "Startup Insights",
//     emoji: "🚀",
//     description:
//       "Captures about fundraising, MVPs, Y Combinator, and startup strategies.",
//     captures: 8,
//   },
// ];

// // --- Component ---
// type SmartClusterCardProps = {
//   cluster: SmartCluster;
//   onClick: (id: string) => void;
//   onRename?: (id: string) => void;
//   onPinToggle?: (id: string) => void;
// };

// export const SmartClusterCard: React.FC<SmartClusterCardProps> = ({
//   cluster,
//   onClick,
//   onRename,
//   onPinToggle,
// }) => {
//   return (
//     <div
//       className="flex flex-col gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-4 rounded-xl hover:shadow-md transition cursor-pointer group"
//       onClick={() => onClick(cluster.id)}
//     >
//       <div className="flex justify-between items-center">
//         <div className="flex items-center gap-3">
//           <span className="text-xl">{cluster.emoji || "🧠"}</span>
//           <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
//             {cluster.title}
//           </h3>
//         </div>

//         <div
//           className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <button
//             onClick={() => onRename?.(cluster.id)}
//             className="text-zinc-500 hover:text-blue-500"
//             title="Rename Cluster"
//           >
//             <Pencil className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => onPinToggle?.(cluster.id)}
//             className="text-zinc-500 hover:text-yellow-500"
//             title={cluster.pinned ? "Unpin" : "Pin Cluster"}
//           >
//             <Pin
//               className="w-4 h-4"
//               fill={cluster.pinned ? "currentColor" : "none"}
//             />
//           </button>
//         </div>
//       </div>

//       <p className="text-sm text-zinc-500 dark:text-zinc-400">
//         {cluster.description}
//       </p>
//       <span className="text-xs text-zinc-400">
//         {cluster.captures} {cluster.captures === 1 ? "capture" : "captures"}
//       </span>
//     </div>
//   );
// };

// // --- Preview Component ---
// export const SmartClusterListPreview = () => {
//   const navigate = useNavigate();

//   const openCluster = (id: string) => {
//     navigate({ to: "/clusters/$clusterId", params: { clusterId: id } });
//   };
//   const renameCluster = (id: string) => alert(`Rename Cluster ${id}`);
//   const togglePin = (id: string) => alert(`Toggle Pin on Cluster ${id}`);

//   return (
//     <div className="flex flex-col gap-4 p-4 items-center">
//       {sampleClusters.map((cluster) => (
//         <SmartClusterCard
//           key={cluster.id}
//           cluster={cluster}
//           onClick={openCluster}
//           onRename={renameCluster}
//           onPinToggle={togglePin}
//         />
//       ))}
//     </div>
//   );
// };

// export default SmartClusterCard;
