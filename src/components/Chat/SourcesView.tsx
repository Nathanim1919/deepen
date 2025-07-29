import { CiStickyNote } from "react-icons/ci";
import { useCaptureContext } from "../../context/CaptureContext";
import type { Capture } from "../../types/Capture";
import { useUI } from "../../context/UIContext";

export const SourcesView = () => {
  const { selectedCapture } = useCaptureContext();
  return (
    <div className="h-full overflow-y-auto p-6">
      <h2 className="text-lg font-semibold mb-4">Available Context</h2>
      <div className="gap-4">
        <SourceCard source={selectedCapture!} />
      </div>
    </div>
  );
};

const SourceCard = ({ source }: { source: Capture }) => {
  const {setOpenAiChat} = useUI();
  return (
    <div
     onClick={()=>setOpenAiChat(false)}
     className="border hover:shadow-2xl cursor-pointer border-[#242323] rounded-xl overflow-hidden bg-[#141313]">
      <h3 className="font-medium px-2 py-3 text-white flex  gap-2">
        {" "}
        <CiStickyNote className="w-10 h-10 text-gray-400" />
        <span>
          {source?.title?.length > 50
            ? source?.title.slice(0, 50) + "..."
            : source?.title}
        </span>
      </h3>
      <p className="text-sm px-3 text-gray-400 mt-1">
        {source?.metadata.description}
      </p>
      <div className="flex justify-between bg-[#111010]  border-t border-[#242323] px-2 py-4 items-center mt-3 text-xs text-gray-500 space-x-3">
        <div className="flex flex-col">
         <span className="m-0 hover:text-violet-500 hover:underline flex items-center gap-1"><img className="w-4 h-4" src={source.metadata.favicon} alt=""/><a href={source.url}>{source.metadata.siteName}</a></span>   
        {/* <span className="m-0">{source?.metadata.type}</span> */}
        </div>
        <span>
          {new Date(source?.metadata.capturedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
};
