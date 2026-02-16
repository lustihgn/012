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
const BASE_SCALE = 34;
let time = 0;

const particles = [];

/* Công thức trái tim chuẩn */
function heart(x, y) {
  return Math.pow(x*x + y*y - 1, 3) - x*x*y*y*y;
}

/* Tạo hạt: nhiều ở viền – ít dần vào tâm */
function generateHeart() {
  particles.length = 0;

  while (particles.length < POINTS) {
    let x = Math.random() * 2 - 1;
    let y = Math.random() * 2 - 1;

    const v = heart(x, y);

    // chỉ lấy điểm gần viền tim
    if (v <= 0 && v > -0.02) {
      const r = Math.sqrt(x*x + y*y);

      // giảm mật độ ở tâm
      if (Math.random() > r * 0.85) continue;

      particles.push({
        x,
        y,
        size: Math.random() * 0.045 + 0.015,
        offset: Math.random() * Math.PI * 2
      });
    }
  }
}
generateHeart();

/* Vẽ & animate */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  time += 0.04;

  // nhịp đập
  const beat = 1 + Math.sin(time) * 0.06;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(BASE_SCALE * beat, -BASE_SCALE * beat);

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

  ctx.restore();
  requestAnimationFrame(draw);
}

draw();
