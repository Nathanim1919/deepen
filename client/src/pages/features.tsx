import React from "react";
import { motion } from "framer-motion";
import Image from "../assets/f1.png";
import Image2 from "../assets/f2.png";

export const Features: React.FC = () => {
  const features = [
    {
      title: "Semantic Search",
      description: "Search for content by meaning, not just keywords. Deepen uses advanced AI to understand the context of your content and return results that are more relevant to your query.",
      image: Image
    },
    {
      title: "Clean Interface",
      description: "A clean and intuitive interface that makes it easy to use Deepen. It is a tool that helps you capture the web as you browse, organize it into collections, and use AI to answer questions about your content.",
      image: Image2 
    },
    {
      title: "Semantic Search",
      description: "Search for content by meaning, not just keywords. Deepen uses advanced AI to understand the context of your content and return results that are more relevant to your query.",
      image: Image
    },
    {
      title: "Clean Interface",
      description: "A clean and intuitive interface that makes it easy to use Deepen. It is a tool that helps you capture the web as you browse, organize it into collections, and use AI to answer questions about your content.",
      image: Image2 
    }
  ]
  return (
    <div className="w-[100%] mx-auto grid gap-30 bg-[#0e0e0e]">

    <div className="w-[80%] mx-auto mt-10 grid gap-30">
      <div className="w-[80%] grid gap-1">
        <h1 className="text-7xl font-bold serif">What can you do with Deepen?</h1>
        <p className="text-gray-400">Deepen is a modern knowledge management platform that helps you capture, organize, and understand web content using AI. It is a tool that helps you capture the web as you browse, organize it into collections, and use AI to answer questions about your content.</p>
      </div>
      <div className="flex flex-col gap-50">
          {
            features.map((feature, index) => (
              <div className={`grid grid-cols-[.6fr_.4fr] gap-10 w-[80%] relative ${index % 2 === 0 ? "self-start" : "self-end"}`}>
            <div>
              <h1 className="text-4xl font-bold serif">{feature.title}</h1>
              
              <div className="w-full">
              <img
              className="w-full h-full object-cover shadow-2xl rounded-2xl"
              src={feature.image} alt={feature.title} />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold">{feature.title}</h1>
              <p className="text-gray-400">{feature.description}</p>
              </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
};