import confetti from "canvas-confetti";

export function fireHeartBurst() {
  if (typeof window === "undefined") return;

  try {
    // Custom Heart SVG Path
    const heartPath = confetti.shapeFromPath({
      path: "M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z",
    });

    const heartColors = [
      "#FF2A85", // Neon Pink
      "#FF6584", // Coral Pink
      "#FF1493", // Deep Pink
      "#F43F5E", // Rose
      "#FB7185", // Soft Rose
      "#FF80BF", // Pastel Heart
      "#FFD700", // Gold sparkle
    ];

    // 1. Center burst of floating hearts
    confetti({
      shapes: [heartPath],
      scalar: 2.2,
      particleCount: 28,
      spread: 90,
      origin: { y: 0.65, x: 0.5 },
      colors: heartColors,
      ticks: 200,
      gravity: 0.65,
      drift: 0,
      startVelocity: 35,
    });

    // 2. Left side cannon
    setTimeout(() => {
      confetti({
        shapes: [heartPath],
        scalar: 1.8,
        particleCount: 16,
        angle: 60,
        spread: 55,
        origin: { x: 0.05, y: 0.75 },
        colors: heartColors,
        ticks: 220,
        gravity: 0.6,
        startVelocity: 40,
      });
    }, 100);

    // 3. Right side cannon
    setTimeout(() => {
      confetti({
        shapes: [heartPath],
        scalar: 1.8,
        particleCount: 16,
        angle: 120,
        spread: 55,
        origin: { x: 0.95, y: 0.75 },
        colors: heartColors,
        ticks: 220,
        gravity: 0.6,
        startVelocity: 40,
      });
    }, 200);

    // 4. Sparkling glow particles
    setTimeout(() => {
      confetti({
        shapes: ["circle"],
        scalar: 0.9,
        particleCount: 24,
        spread: 110,
        origin: { y: 0.55, x: 0.5 },
        colors: ["#FFF", "#FFE4E6", "#FFD700", "#F472B6"],
        ticks: 140,
        gravity: 0.75,
        startVelocity: 26,
      });
    }, 150);
  } catch {
    // Fallback standard confetti if custom shapes aren't supported
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FF2A85", "#FF6584", "#FF1493", "#FFD700"],
    });
  }
}
