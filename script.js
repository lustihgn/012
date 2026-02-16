const canvas = document.getElementById("heart");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

/* ===== CẤU HÌNH ===== */
const HEART_POINTS = 6000;
const FLOAT_POINTS = 120; // 👈 hạt bay nền
const BASE_SCALE = 34;

let time = 0;

const heartParticles = [];
const floatParticles = [];

/* ===== CÔNG THỨC TRÁI TIM (GIỮ ĐÚNG HÌNH DẠNG ĐẸP) ===== */
function heart(t){
  return {
    x: 16 * Math.sin(t) ** 3,
    y: -(13 * Math.cos(t)
        - 5 * Math.cos(2*t)
        - 2 * Math.cos(3*t)
        - Math.cos(4*t))
  };
}

/* ===== TẠO HẠT TRÁI TIM ===== */
function generateHeart(){
  heartParticles.length = 0;

  while(heartParticles.length < HEART_POINTS){
    const a = Math.random() * Math.PI * 2;
    const k = Math.pow(Math.random(), 0.35);
    const p = heart(a);

    const center = Math.abs(p.x * k);
    if(Math.random() > Math.min(1, Math.pow(center / 1.0, 0.85))) continue;

    heartParticles.push({
      x: p.x * k,
      y: p.y * k,
      nx: p.x * k,
      ny: p.y * k,
      r: 0.03 + k * 0.085,
      o: 0.35 + k * 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.005 + Math.random() * 0.01
    });
  }
}

/* ===== TẠO HẠT BAY NỀN ===== */
function generateFloating(){
  floatParticles.length = 0;

  for(let i = 0; i < FLOAT_POINTS; i++){
    floatParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.6,
      vy: Math.random() * 0.25 + 0.15,
      o: Math.random() * 0.35 + 0.15
    });
  }
}

generateHeart();
generateFloating();

/* ===== ANIMATE ===== */
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  time += 0.025;

  /* 🌌 HẠT BAY NỀN */
  for(const f of floatParticles){
    ctx.globalAlpha = f.o;
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgb(255,140,170)";
    ctx.fill();

    f.y -= f.vy;
    if(f.y < -10){
      f.y = canvas.height + 10;
      f.x = Math.random() * canvas.width;
    }
  }

  ctx.globalAlpha = 1;

  /* 💓 TRÁI TIM */
  const beat = 1 + Math.sin(time) * 0.045;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(BASE_SCALE * beat, -BASE_SCALE * beat);

  for(const p of heartParticles){
    p.phase += p.speed;

    const sparkle = (Math.sin(p.phase) + 1) * 0.12;
    const pulse = (beat - 1) * 0.6;

    ctx.globalAlpha = p.o + sparkle;
    ctx.beginPath();
    ctx.arc(
      p.nx + p.nx * pulse,
      p.ny + p.ny * pulse,
      p.r,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "rgb(255,110,145)";
    ctx.fill();
  }

  ctx.restore();
  ctx.globalAlpha = 1;

  requestAnimationFrame(draw);
}

draw();
