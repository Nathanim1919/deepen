// // GlobalSearch.tsx
// import { useEffect, useState, useRef } from "react";
// import { IoSearch, IoClose } from "react-icons/io5";
// import { MdHistory, MdOutlineTag, MdOutlinePictureAsPdf } from "react-icons/md";
// import { AnimatePresence, motion } from "framer-motion";
// import { useUI } from "../context/UIContext"; // ✅ Use your shared UI context

// export const GlobalSearch = () => {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState<any[]>([]);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const { openGlobalSearch = false, setOpenGlobalSearch } = useUI(); // ✅ from context

//   const mockResults = [
//     { type: "note", label: "Deep Work by Cal Newport", icon: <MdHistory /> },
//     { type: "pdf", label: "Stoicism Summary.pdf", icon: <MdOutlinePictureAsPdf /> },
//     { type: "tag", label: "#productivity", icon: <MdOutlineTag /> },
//   ];

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if ((e.ctrlKey || e.metaKey) && e.key === "k") {
//         e.preventDefault();
//         setOpenGlobalSearch?.(true);
//         setTimeout(() => inputRef.current?.focus(), 100);
//       }
//       if (e.key === "Escape") {
//         setOpenGlobalSearch?.(false);
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [setOpenGlobalSearch]);

//   useEffect(() => {
//     if (query.trim()) {
//       setResults(
//         mockResults.filter((item) =>
//           item.label.toLowerCase().includes(query.toLowerCase())
//         )
//       );
//     } else {
//       setResults(mockResults);
//     }
//   }, [query]);

//   return (
//     <AnimatePresence>
//       {openGlobalSearch && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-999 bg-black/60 backdrop-blur-sm flex items-center justify-center"
//         >
//           <motion.div
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.95, opacity: 0 }}
//             className="bg-[#1d1f1d] text-white w-[70%] h-[95%] rounded-xl p-4 shadow-xl"
//           >
//             {/* Search Input */}
//             <div className="flex items-center gap-2 border border-white/10 rounded-lg px-3 py-2 mb-4">
//               <IoSearch className="text-xl text-white/50" />
//               <input
//                 ref={inputRef}
//                 type="text"
//                 placeholder="Search notes, PDFs, tags, anything..."
//                 className="w-full bg-transparent outline-none placeholder:text-white/30"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//               />
//               {query && (
//                 <button
//                   onClick={() => setQuery("")}
//                   className="text-white/50 hover:text-white transition"
//                 >
//                   <IoClose className="text-lg" />
//                 </button>
//               )}
//             </div>

//             {/* Results */}
//             <div className="max-h-72 overflow-y-auto">
//               {results.length === 0 ? (
//                 <p className="text-sm text-white/50 text-center py-4">
//                   No results found.
//                 </p>
//               ) : (
//                 <ul className="flex flex-col gap-2">
//                   {results.map((result, index) => (
//                     <li
//                       key={index}
//                       className="flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition"
//                     >
//                       <span className="text-lg">{result.icon}</span>
//                       <span>{result.label}</span>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             {/* Footer */}
//             <div className="mt-4 text-xs text-white/40 text-center">
//               Press <kbd className="bg-white/10 px-1 rounded">Esc</kbd> to close or <kbd className="bg-white/10 px-1 rounded">Cmd + K</kbd> to toggle
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default GlobalSearch;
