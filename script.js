const canvas = document.getElementById("heart");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

/* ================== TRÁI TIM ================== */
const POINTS = 5000;
const BASE_SCALE = 18; // nhỏ còn ~1/2
let time = 0;

const particles = [];

/* công thức tim */
function heart(x, y) {
  return Math.pow(x*x + y*y - 1, 3) - x*x*y*y*y;
}

/* tạo hạt tim */
function generateHeart() {
  particles.length = 0;

  while (particles.length < POINTS) {
    let x = Math.random() * 2 - 1;
    let y = Math.random() * 2 - 1;

    const v = heart(x, y);
    if (v <= 0 && v > -0.02) {
      const r = Math.sqrt(x*x + y*y);
      if (Math.random() > r * 0.85) continue;

      particles.push({
        x,
        y,
        size: Math.random() * 0.04 + 0.015,
        offset: Math.random() * Math.PI * 2
      });
    }
  }
}
generateHeart();

/* ================== ẢNH BAY ================== */
const imageFiles = [
  "anh1.jpg","anh2.jpg","anh3.jpg","anh4.jpg",
  "anh5.jpg","anh6.jpg","anh7.jpg","anh8.jpg",
  "anh9.jpg","anh10.jpg","anh11.jpg","anh12.jpg"
];

const images = imageFiles.map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

const balloons = [];
const BALLOON_COUNT = 6; // ít để mượt

function spawnBalloon() {
  const side = Math.random() < 0.5 ? -1 : 1;

  balloons.push({
    img: images[Math.floor(Math.random() * images.length)],
    x: side * (0.9 + Math.random() * 0.4), // ngoài vùng tim
    y: -1.3 - Math.random(),
    speed: 0.0015 + Math.random() * 0.001,
    size: 0.22 + Math.random() * 0.06,
    sway: Math.random() * Math.PI * 2,
    alpha: 0.9
  });
}

images[0].onload = () => {
  for (let i = 0; i < BALLOON_COUNT; i++) spawnBalloon();
};

/* ================== VẼ ================== */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  time += 0.04;

  const beat = 1 + Math.sin(time) * 0.05;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(BASE_SCALE * beat, -BASE_SCALE * beat);

  /* ---- TRÁI TIM ---- */
  for (let p of particles) {
    const pulse = Math.sin(time + p.offset) * 0.015;
    ctx.fillStyle = "rgba(255,150,200,0.9)";
    ctx.fillRect(
      p.x + pulse,
      p.y + pulse,
      p.size,
      p.size
    );
  }

  /* ---- ẢNH BAY NGOÀI TIM ---- */
  for (let b of balloons) {
    b.y += b.speed;
    b.sway += 0.01;

    const bx = b.x + Math.sin(b.sway) * 0.05;
    const by = b.y;

    ctx.globalAlpha = b.alpha;
    ctx.drawImage(
      b.img,
      bx - b.size / 2,
      by - b.size / 2,
      b.size,
      b.size
    );

    if (b.y > 1.3) {
      balloons.splice(balloons.indexOf(b), 1);
      spawnBalloon();
    }
  }

  ctx.restore();
  ctx.globalAlpha = 1;

  requestAnimationFrame(draw);
}

draw();
