'use client';

import { useEffect, useRef, useState } from 'react';

export const BackgroundRippleEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; radius: number; opacity: number }>>([]);
  const rippleIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop
    const animate = () => {
      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#052c22');
      gradient.addColorStop(1, '#285531');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid pattern
      ctx.strokeStyle = 'rgba(173, 240, 66, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw ripples
      setRipples((prevRipples) => {
        const newRipples = prevRipples
          .map((ripple) => ({
            ...ripple,
            radius: ripple.radius + 2,
            opacity: Math.max(0, ripple.opacity - 0.02),
          }))
          .filter((ripple) => ripple.opacity > 0);

        newRipples.forEach((ripple) => {
          ctx.strokeStyle = `rgba(173, 240, 66, ${ripple.opacity * 0.5})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
          ctx.stroke();
        });

        return newRipples;
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Create ripples automatically
    rippleIntervalRef.current = setInterval(() => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      setRipples((prev) => [
        ...prev,
        { x, y, radius: 0, opacity: 1 },
      ]);
    }, 2000);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (rippleIntervalRef.current) {
        clearInterval(rippleIntervalRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
    />
  );
};
