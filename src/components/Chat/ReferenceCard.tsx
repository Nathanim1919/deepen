import { motion } from "framer-motion";




export const ReferenceCard = () => {
  const reference = {
    id: "1",
    title: "Understanding React Components",
    excerpt: "A deep dive into the world of React components, their lifecycle, and best practices.",
    image: "https://example.com/image.jpg", // Example image URL
  };
    return (
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="flex-shrink-0 w-40 overflow-hidden rounded-lg bg-gray-800/50 border border-gray-700/30"
      >
        {reference.image && (
          <div className="h-20 bg-gray-700 overflow-hidden">
            <img 
              src={reference.image} 
              className="w-full h-full object-cover" 
              alt="Reference preview"
            />
          </div>
        )}
        <div className="p-2">
          <h4 className="text-xs font-medium text-white truncate">{reference.title}</h4>
          <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{reference.excerpt}</p>
        </div>
      </motion.div>
    );
  };