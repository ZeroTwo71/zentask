"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import ReactConfetti from "react-confetti";

interface UseConfettiProps {
  duration?: number;
}

export function useConfetti({ duration = 2500 }: UseConfettiProps = {}) {
  const [isActive, setIsActive] = useState(false);
  const [isLeavingScreen, setIsLeavingScreen] = useState(false);
  const timerRefs = useRef<{main: NodeJS.Timeout | null, cleanup: NodeJS.Timeout | null}>({main: null, cleanup: null});

  // Cleanup function to clear any existing timers
  const cleanupTimers = useCallback(() => {
    if (timerRefs.current.main) {
      clearTimeout(timerRefs.current.main);
      timerRefs.current.main = null;
    }
    if (timerRefs.current.cleanup) {
      clearTimeout(timerRefs.current.cleanup);
      timerRefs.current.cleanup = null;
    }
  }, []);

  // Clean up timers when component unmounts
  useEffect(() => {
    return () => cleanupTimers();
  }, [cleanupTimers]);

  const triggerConfetti = useCallback(() => {
    // Clean up any existing timers first
    cleanupTimers();
    
    // Reset states and start fresh
    setIsLeavingScreen(false);
    setIsActive(true);
    
    // First phase: active confetti generation (2.5 detik)
    timerRefs.current.main = setTimeout(() => {
      // Enter the "leaving screen" phase where confetti stops generating
      setIsLeavingScreen(true);
      
      // Second phase: allow existing pieces to fall off screen (1.5 detik)
      timerRefs.current.cleanup = setTimeout(() => {
        setIsActive(false);
      }, 1500);
    }, duration);
  }, [duration, cleanupTimers]);

  const ConfettiComponent = useCallback(() => {
    if (!isActive) return null;

    // Calculate the safe width to prevent horizontal scrolling
    const safeWidth = Math.min(window.innerWidth, document.body.clientWidth) - 20; // 20px safety margin

    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-50" 
           style={{ 
             width: '100%', 
             height: '100%', 
             maxWidth: '100vw'
           }}>
        <ReactConfetti
          width={safeWidth}
          height={window.innerHeight * 1.3} // Higher height so confetti can fall below screen
          recycle={false}
          numberOfPieces={isLeavingScreen ? 0 : 250} // Fewer pieces for shorter animation
          gravity={0.9} // Higher gravity makes confetti fall faster
          initialVelocityY={-0.5} // Slight upward initial motion
          tweenDuration={2000} // Shorter tween duration for quicker animation
          colors={['#4299e1', '#38b2ac', '#ed8936', '#9f7aea', '#ed64a6', '#48bb78']} // Colorful confetti
          // Distribusi merata dari seluruh area atas
          confettiSource={{
            x: 0,
            y: 0,
            w: safeWidth, // Full width as source
            h: 10 // Small height at top
          }}
          run={true} // Always run the animation until component unmounts
          opacity={0.9} // Slightly transparent for better visual
        />
      </div>
    );
  }, [isActive, isLeavingScreen]);

  return {
    triggerConfetti,
    isActive,
    Confetti: ConfettiComponent,
  };
}
