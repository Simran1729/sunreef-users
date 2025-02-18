import { useEffect, useRef } from "react";

export default function AudioVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bars = 50;
    const barWidth = canvas.width / bars;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < bars; i++) {
        const height = Math.random() * 50;
        const x = i * barWidth;
        const y = canvas.height - height;
        
        const gradient = ctx.createLinearGradient(x, y, x, canvas.height);
        gradient.addColorStop(0, "hsl(var(--primary))");
        gradient.addColorStop(1, "hsl(var(--primary) / 0.3)");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 2, height);
      }
      
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
