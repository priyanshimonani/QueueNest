import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./TrueFocus.css";

const TrueFocus = ({
  sentence = "True Focus",
  separator = " ",
  manualMode = false,
  blurAmount = 5,
  borderColor = "#10b981",
  glowColor = "rgba(16, 185, 129, 0.35)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1
}) => {
  const words = separator === "" ? sentence.split("") : sentence.split(separator);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (manualMode || words.length <= 1) return undefined;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % words.length);
    }, (animationDuration + pauseBetweenAnimations) * 1000);

    return () => clearInterval(interval);
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (currentIndex == null || currentIndex < 0) return;

    const activeWord = wordRefs.current[currentIndex];
    const container = containerRef.current;

    if (!activeWord || !container) return;

    const parentRect = container.getBoundingClientRect();
    const activeRect = activeWord.getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height
    });
  }, [currentIndex, words.length]);

  const handleMouseEnter = index => {
    if (!manualMode) return;
    setLastActiveIndex(index);
    setCurrentIndex(index);
  };

  const handleMouseLeave = () => {
    if (!manualMode) return;
    setCurrentIndex(lastActiveIndex);
  };

  return (
    <div className="focus-container" ref={containerRef}>
      {words.map((word, index) => {
        const isActive = index === currentIndex;

        return (
          <span
            key={`${word}-${index}`}
            ref={element => {
              wordRefs.current[index] = element;
            }}
            className={`focus-word ${manualMode ? "manual" : ""} ${isActive && !manualMode ? "active" : ""}`}
            style={{
              filter: isActive ? "blur(0px)" : `blur(${blurAmount}px)`,
              "--border-color": borderColor,
              "--glow-color": glowColor,
              transition: `filter ${animationDuration}s ease`
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word === " " ? "\u00A0" : word}
          </span>
        );
      })}

      <motion.div
        className="focus-frame"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0
        }}
        transition={{ duration: animationDuration }}
        style={{
          "--border-color": borderColor,
          "--glow-color": glowColor
        }}
      >
        <span className="corner top-left"></span>
        <span className="corner top-right"></span>
        <span className="corner bottom-left"></span>
        <span className="corner bottom-right"></span>
      </motion.div>
    </div>
  );
};

export default TrueFocus;
