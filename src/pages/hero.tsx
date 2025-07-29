import { motion } from "framer-motion";
import Image from "../assets/img1.png";
import { CallToAction } from "./CallToAction";
import { Features } from "./features";
// import { TestimonialsPage } from "./TestimonialsPage";

const HeroPage = () => {
  return (
    <>
    <div
      className="w-full h-full bg-black relative overflow-hidden
    before:absolute before:w-full before:h-[90%] before:transform before:top-[95%] before:rotate-90  before:content-[''] before:bg-violet-600
        after:absolute after:w-full after:h-[100%]  after:transform after:bottom-[0%]  after:content-[''] after:bg-gradient-to-t after:from-black
    "
    >
      <div className="md:min-h-screen w-full backdrop-blur-[7rem]  text-white relative overflow-hidden isolate">
        {/* Ultra-minimal background with dynamic lighting */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-violet-900/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01)_0%,transparent_70%)]" />
        </div>

        {/* Content with precise Apple-like spacing */}
        <div className="container mx-auto md:px-6 flex flex-col items-center mt-24 gap-6 md:gap-0 md:mt-0 md:justify-center min-h-screen md:py-4">
          {/* Headline with refined typography */}
          <motion.div
            className="text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl mb-5 font-bold tracking-tight leading-[1.1]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="block">Capture. Organize.</span>
              <span
               style={{
                backgroundImage:
                  "linear-gradient(90deg, #06d1ff, #efff12, #ffffff)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
               className="text-transparent bg-clip-text bg-gradient-to-r from-white to-violet-200">
                Understand Instantly.
              </span>
            </motion.h1>

            <motion.p
              className="md:text-xl text-gray-400 max-w-[95%] md:max-w-[70%] mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Capture web content with precision. Organize with intelligence.
              <span className="text-violet-300"> Retrieve with ease.</span>
            </motion.p>
          </motion.div>

          {/* Product showcase with refined animation */}
          <motion.div
            className="w-full max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, type: "spring" }}
          >
            <div className="relative">
              {/* Subtle glow effect */}
              <div className="absolute -inset-4 bg-violet-500/10 rounded-3xl blur-xl -z-10" />

              {/* Product image with refined border */}
              <img
                src={Image}
                alt="App interface"
                className="w-full h-auto rounded-2xl border border-white/10 shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
    <CallToAction/>
    <Features/>
    {/* <TestimonialsPage/> */}
    </>
  );
};

export default HeroPage;
