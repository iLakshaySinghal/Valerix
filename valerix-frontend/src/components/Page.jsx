import React from "react";
import { motion } from "framer-motion";

export default function Page({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-[80vh]"
    >
      {children}
    </motion.div>
  );
}
