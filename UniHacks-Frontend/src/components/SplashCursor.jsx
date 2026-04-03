import { useEffect, useRef } from "react";

function SplashCursor() {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let isActive = true;
    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const splashes = [];
    let pointer = { x: 0, y: 0, active: false };

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function randomColor() {
      const palette = [
        "rgba(5, 150, 105, 0.18)",
        "rgba(16, 185, 129, 0.16)",
        "rgba(110, 231, 183, 0.14)",
        "rgba(250, 204, 21, 0.14)",
        "rgba(253, 224, 71, 0.12)",
        "rgba(255, 237, 160, 0.12)"
      ];
      return palette[Math.floor(Math.random() * palette.length)];
    }

    function spawnSplash(x, y, burst = 10) {
      for (let i = 0; i < burst; i++) {
        splashes.push({
          x,
          y,
          radius: Math.random() * 10 + 6,
          alpha: Math.random() * 0.35 + 0.08,
          color: randomColor(),
          vx: (Math.random() - 0.5) * 2.8,
          vy: (Math.random() - 0.5) * 2.8,
          growth: Math.random() * 0.35 + 0.08
        });
      }
    }

    function animate() {
      if (!isActive) return;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.globalCompositeOperation = "lighter";

      for (let i = splashes.length - 1; i >= 0; i--) {
        const splash = splashes[i];
        splash.x += splash.vx;
        splash.y += splash.vy;
        splash.radius += splash.growth;
        splash.alpha *= 0.96;

        if (splash.alpha < 0.01) {
          splashes.splice(i, 1);
          continue;
        }

        context.beginPath();
        context.fillStyle = splash.color.replace(/[\d.]+\)$/, `${splash.alpha})`);
        context.shadowColor = splash.color.replace(/[\d.]+\)$/, `${Math.min(splash.alpha + 0.1, 0.4)})`);
        context.shadowBlur = 20;
        context.arc(splash.x, splash.y, splash.radius, 0, Math.PI * 2);
        context.fill();
      }

      animationFrameId.current = requestAnimationFrame(animate);
    }

    function handleMove(event) {
      pointer = { x: event.clientX, y: event.clientY, active: true };
      spawnSplash(pointer.x, pointer.y, 3);
    }

    function handleDown(event) {
      spawnSplash(event.clientX, event.clientY, 16);
    }

    function handleTouchMove(event) {
      const touch = event.touches[0];
      if (!touch) return;
      pointer = { x: touch.clientX, y: touch.clientY, active: true };
      spawnSplash(pointer.x, pointer.y, 4);
    }

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("touchmove", handleTouchMove, false);

    return () => {
      isActive = false;
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none"
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100vw",
          height: "100vh",
          display: "block"
        }}
      />
    </div>
  );
}

export default SplashCursor;
