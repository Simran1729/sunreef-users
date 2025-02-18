import { useEffect, useRef } from "react";

export default function AudioVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heightsRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(0);
  const FPS = 30; // Limit to 30 frames per second
  const frameInterval = 1000 / FPS;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bars = 50;
    const barWidth = canvas.width / bars;

    // Initialize heights array
    heightsRef.current = Array(bars).fill(0);

    const animate = (currentTime: number) => {
      // Check if enough time has passed since last frame
      if (currentTime - lastFrameTimeRef.current < frameInterval) {
        requestAnimationFrame(animate);
        return;
      }

      lastFrameTimeRef.current = currentTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update heights with smooth transitions
      heightsRef.current = heightsRef.current.map(currentHeight => {
        const targetHeight = Math.random() * 30; // Reduced max height
        const step = 2; // Smaller step for smoother transitions
        if (currentHeight < targetHeight) {
          return Math.min(currentHeight + step, targetHeight);
        }
        return Math.max(currentHeight - step, targetHeight);
      });

      // Draw bars
      heightsRef.current.forEach((height, i) => {
        const x = i * barWidth;
        const y = canvas.height - height;

        const gradient = ctx.createLinearGradient(x, y, x, canvas.height);
        gradient.addColorStop(0, "hsl(222.2, 47.4%, 11.2%)");
        gradient.addColorStop(1, "hsla(222.2, 47.4%, 11.2%, 0.3)");

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 2, height);
      });

      requestAnimationFrame(animate);
    };

    const animation = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animation);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={60}
      className="mb-4"
    />
  );
}