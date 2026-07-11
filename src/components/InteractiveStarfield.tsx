import React, { useEffect, useRef } from 'react';

export const InteractiveStarfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    interface Star {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      phase: number;
      phaseSpeed: number;
    }

    const stars: Star[] = [];
    const starCount = Math.min(120, Math.floor((width * height) / 10000));

    // Initialize stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.05,
        speedY: (Math.random() * 0.08) + 0.02, // Drift downward slowly
        opacity: Math.random() * 0.7 + 0.3,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.02 + 0.005, // twinkling speed
      });
    }

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Track mouse position for subtle parallax tilt
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.02;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.02;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach(star => {
        // Move star
        star.y += star.speedY;
        star.x += star.speedX;

        // Apply mouse inertia
        const currentX = star.x + mouseX * (star.size * 0.3);
        const currentY = star.y + mouseY * (star.size * 0.3);

        // Twinkle
        star.phase += star.phaseSpeed;
        const twinkle = Math.sin(star.phase) * 0.3 + 0.7;

        // Draw star
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.beginPath();
        ctx.arc(currentX, currentY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Wrap boundaries
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
        if (star.x < 0) {
          star.x = width;
        } else if (star.x > width) {
          star.x = 0;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};
