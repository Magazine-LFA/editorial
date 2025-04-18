"use client";
import React from "react";
import { motion } from "framer-motion";

export const TypingAnimation = ({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: delay + index * 0.1,
            ease: "easeOut",
          }}
          className="inline-block"
          style={{ 
            width: char === " " ? "0.5em" : "auto",
            whiteSpace: "pre"
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};