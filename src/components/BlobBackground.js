"use client";

import { motion } from "framer-motion";

export default function BlobBackground() {
  return (
    <motion.div
      initial={{ borderRadius: "42% 58% 63% 37% / 34% 34% 66% 66%" }}
      animate={{
        borderRadius: [
          "42% 58% 63% 37% / 34% 34% 66% 66%",
          "60% 40% 30% 70% / 60% 20% 80% 40%",
          "30% 70% 50% 50% / 50% 60% 40% 50%",
          "42% 58% 63% 37% / 34% 34% 66% 66%",
        ],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        repeatType: "mirror",
      }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600 border-[40px] border-fuchsia-700 opacity-50 z-[-1] blur-3xl
      lg:w-[800px] lg:h-[800px]
      "
    />
  );
}
