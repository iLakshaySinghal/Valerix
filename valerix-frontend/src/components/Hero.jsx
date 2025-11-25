import React from "react";
import { motion } from "framer-motion";
import Button from "./ui/button.jsx";

export default function Hero() {
  return (
    <div className="mt-6 mb-10 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-10 max-w-3xl text-center neon-border rounded-3xl"
      >
        <h1 className="text-4xl font-bold neon-text mb-4">Discover the Future</h1>
        <p className="mb-6 opacity-80">Explore next-generation products curated for you</p>
        <Button onClick={() => (window.location = "/products")}>
          Browse Products
        </Button>
      </motion.div>
    </div>
  );
}
