import { useState, useEffect } from 'react';

const loadingPhrases = [
  'Analyzing...',
  'Junkifying...',
  'Estimation wizardry...',
];

export default function AnimatedLoadingText() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Cycle through phrases every 2 seconds
    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false);

      // Wait for fade out, then change text and fade in
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % loadingPhrases.length);
        setIsVisible(true);
      }, 300); // 300ms fade out duration
    }, 2000); // 2 second cycle

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {loadingPhrases[currentIndex]}
    </span>
  );
}
