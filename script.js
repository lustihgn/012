const canvas = document.getElementById("heart");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

/* ===== CẤU HÌNH ===== */
const POINTS = 5000;
const BASE_SCALE = 18; // 👈 giảm còn ~1/2
let time = 0;

const particles = [];

/* Công thức trái tim – GIỮ NGUYÊN */
function heart(x, y) {
  return Math.pow(x*x + y*y - 1, 3) - x*x*y*y*y;
}

/* Tạo hạt: viền dày – vào trong thưa dần */
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
        size: Math.random() * 0.035 + 0.015,
        offset: Math.random() * Math.PI * 2
      });
    }
  }
}
generateHeart();

/* Vẽ & animate */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  time += 0.035;

  const beat = 1 + Math.sin(time) * 0.05;

  ctx.save();
  ctx.translate(
    canvas.width / 2,
    canvas.height / 2 + 80 // 👈 đẩy tim xuống thấp
  );

  // ❌ bỏ dấu âm → tim KHÔNG bị ngược
  ctx.scale(BASE_SCALE * beat, BASE_SCALE * beat);

  for (let p of particles) {
    const pulse = Math.sin(time + p.offset) * 0.015;

    ctx.fillStyle = "rgba(255,150,190,0.9)";
    ctx.fillRect(
      p.x + pulse,
      p.y + pulse,
      p.size,
      p.size
    );
  }

  ctx.restore();
  requestAnimationFrame(draw);
}

draw();
