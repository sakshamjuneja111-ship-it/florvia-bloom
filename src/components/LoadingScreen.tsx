import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 800);
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{ zIndex: 9999, background: "hsl(var(--foreground))" }}
        >
          {/* Botanical F monogram */}
          <motion.svg
            width="80"
            height="80"
            viewBox="0 0 100 100"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          >
            <path
              d="M30 85 L30 25 Q30 15 40 15 L70 15 M30 48 L58 48"
              fill="none"
              stroke="hsl(var(--gold))"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Leaf accents */}
            <path
              d="M62 15 Q72 8 75 18 Q68 14 62 15Z"
              fill="none"
              stroke="hsl(var(--gold))"
              strokeWidth="0.8"
            />
            <path
              d="M52 48 Q62 38 68 45 Q58 42 52 48Z"
              fill="none"
              stroke="hsl(var(--gold))"
              strokeWidth="0.8"
            />
          </motion.svg>

          {/* Wordmark */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
            className="font-body font-light text-[13px] tracking-[0.5em] uppercase mt-8"
            style={{ color: "hsl(var(--cream) / 0.6)" }}
          >
            Florvia
          </motion.p>

          {/* Loading line */}
          <motion.div
            className="mt-6 h-[1px] rounded-full"
            style={{ background: "hsl(var(--gold) / 0.4)" }}
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ duration: 1.8, ease: "easeInOut", delay: 0.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
