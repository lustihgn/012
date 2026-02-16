const canvas = document.getElementById("heart");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

/* ===== HEART SETTINGS ===== */
const POINTS = 5200;
const BASE_SCALE = 34;   // kích thước tim (đẹp nhất ở 32–38)
let time = 0;

const particles = [];

/* Công thức trái tim đẹp */
function heart(x, y) {
  return Math.pow(x*x + y*y - 1, 3) - x*x*y*y*y;
}

/* Tạo particle phủ ĐẦY tim */
function generateHeart() {
  particles.length = 0;
  while (particles.length < POINTS) {
    let x = Math.random() * 2 - 1;
    let y = Math.random() * 2 - 1;
    if (heart(x, y) <= 0) {
      particles.push({ x, y });
    }
  }
}
generateHeart();

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  time += 0.05;

  /* Nhịp đập */
  const beat = 1 + Math.sin(time) * 0.06;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(BASE_SCALE * beat, -BASE_SCALE * beat);

  ctx.fillStyle = "rgba(255,150,200,0.95)";
  for (let p of particles) {
    ctx.fillRect(p.x, p.y, 0.04, 0.04);
  }

  ctx.restore();
  requestAnimationFrame(draw);
}

draw();
