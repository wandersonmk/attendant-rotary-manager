import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

interface ConfettiEffectProps {
  duration?: number;
}

export const ConfettiEffect = ({ duration = 3000 }: ConfettiEffectProps) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, duration);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [duration]);

  if (!showConfetti) return null;

  return (
    <Confetti
      width={windowDimensions.width}
      height={windowDimensions.height}
      recycle={false}
      numberOfPieces={500}
      gravity={0.3}
      initialVelocityY={20}
      initialVelocityX={10}
      explosionSpeed={10}
      friction={0.99}
      wind={0.05}
      colors={['#FFD700', '#FFA500', '#FF6347', '#FF69B4', '#4169E1', '#32CD32', '#9370DB']}
    />
  );
};