import { useEffect, useState } from "react";

interface TypingAnimationProps {
  text: string;
  speed?: number;
}

export const TypingAnimation = ({ text, speed = 30 }: TypingAnimationProps) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayedText}
      {displayedText.length < text.length && (
        <span className="animate-pulse">▌</span>
      )}
    </span>
  );
};
