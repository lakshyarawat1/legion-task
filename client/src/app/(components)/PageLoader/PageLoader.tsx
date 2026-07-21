"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface PageLoaderProps {
  message?: string;
}

export default function PageLoader({ message = "Loading..." }: PageLoaderProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center gap-6"
      >
        <div className="relative flex h-24 w-24 items-center justify-center">
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-primary/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          />
          
          {/* Animated spinner ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          {/* Inner icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7] 
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </motion.div>
        </div>
        
        {/* Loading text with pulse effect */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-lg font-medium tracking-widest text-muted-foreground uppercase"
        >
          {message}
        </motion.div>
      </motion.div>
    </div>
  );
}
