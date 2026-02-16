const canvas = document.getElementById("heart");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

/* ================= TRÁI TIM ================= */
const POINTS = 5000;
const HEART_SCALE = Math.min(innerWidth, innerHeight) * 0.035;
let time = 0;
const particles = [];

function heart(x, y) {
  return Math.pow(x*x + y*y - 1, 3) - x*x*y*y*y;
}

function generateHeart() {
  particles.length = 0;
  while (particles.length < POINTS) {
    let x = Math.random() * 2 - 1;
    let y = Math.random() * 2 - 1;
    const v = heart(x, y);

    if (v <= 0 && v > -0.02) {
      const r = Math.sqrt(x*x + y*y);
      if (Math.random() > r * 0.9) continue;

      particles.push({
        x,
        y,
        size: Math.random() * 1.4 + 0.6,
        offset: Math.random() * Math.PI * 2
      });
    }
  }
}
generateHeart();

/* ================= ẢNH BAY ================= */
const imageFiles = Array.from({ length: 12 }, (_, i) => `anh${i+1}.jpg`);
const images = imageFiles.map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

const balloons = [];

function spawnBalloon() {
  const side = Math.random() < 0.5 ? -1 : 1;
  balloons.push({
    img: images[Math.floor(Math.random() * images.length)],
    x: canvas.width / 2 + side * (canvas.width * 0.28 + Math.random() * 120),
    y: canvas.height + 100,
    speed: 0.6 + Math.random() * 0.4,
    size: 80 + Math.random() * 30,
    sway: Math.random() * Math.PI * 2,
    alpha: 0.9
  });
}

images[0].onload = () => {
  for (let i = 0; i < 6; i++) spawnBalloon();
};

/* ================= VẼ ================= */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  time += 0.04;

  /* ---- TRÁI TIM ---- */
  const beat = 1 + Math.sin(time) * 0.05;
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(HEART_SCALE * beat, -HEART_SCALE * beat);

  for (const p of particles) {
    const pulse = Math.sin(time + p.offset) * 0.02;
    ctx.fillStyle = "rgba(255,150,200,0.9)";
    ctx.fillRect(
      p.x + pulse,
      p.y + pulse,
      p.size,
      p.size
    );
  }
  ctx.restore();

  /* ---- ẢNH BAY (KHÔNG SCALE) ---- */
  for (let i = balloons.length - 1; i >= 0; i--) {
    const b = balloons[i];
    b.y -= b.speed;
    b.sway += 0.01;

    const x = b.x + Math.sin(b.sway) * 15;
    ctx.globalAlpha = b.alpha;
    ctx.drawImage(b.img, x, b.y, b.size, b.size);

    if (b.y < -150) {
      balloons.splice(i, 1);
      spawnBalloon();
    }
  }

  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}

draw();
