/* ===================== TRÁI TIM ĐẬP ===================== */
const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

let t = 0;
const HEART_SCALE = 13;
const PARTICLES = 3200;

function heartFn(x, y) {
  const a = x*x + y*y - 1;
  return a*a*a - x*x*y*y*y;
}

let heartPoints = [];

function generateHeart() {
  heartPoints = [];
  while (heartPoints.length < PARTICLES) {
    let x = (Math.random()*2 - 1) * 1.3;
    let y = (Math.random()*2 - 1) * 1.3;
    if (heartFn(x,y) <= 0) {
      heartPoints.push({x,y});
    }
  }
}
generateHeart();

function drawHeart() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  t += 0.04;

  const pulse = 1 + Math.sin(t) * 0.08;

  ctx.save();
  ctx.translate(canvas.width/2, canvas.height*0.6);
  ctx.scale(HEART_SCALE*pulse, -HEART_SCALE*pulse);

  for (const p of heartPoints) {
    ctx.fillStyle = "rgba(255,170,210,0.85)";
    ctx.fillRect(p.x, p.y, 0.04, 0.04);
  }

  ctx.restore();
  requestAnimationFrame(drawHeart);
}
drawHeart();

/* ===================== BÓNG BAY ẢNH ===================== */
const images = [
  "anh1.jpg","anh2.jpg","anh3.jpg","anh4.jpg","anh5.jpg",
  "anh6.jpg","anh7.jpg","anh8.jpg","anh9.jpg",
  "anh10.jpg","anh11.jpg","anh12.jpg"
];

function createBalloon() {
  const balloon = document.createElement("div");
  balloon.className = "balloon";

  const size = Math.random()*60 + 240; // 🔥 ẢNH TO
  balloon.style.width = size+"px";
  balloon.style.height = size+"px";

  // Tránh vùng trái tim (giữa màn hình)
  let x;
  do {
    x = Math.random()*(innerWidth-size);
  } while (Math.abs(x + size/2 - innerWidth/2) < 220);

  balloon.style.left = x + "px";
  balloon.style.bottom = "-350px";

  const img = document.createElement("img");
  img.src = images[Math.floor(Math.random()*images.length)];
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  img.style.borderRadius = "50%";

  balloon.appendChild(img);
  document.body.appendChild(balloon);

  let y = -350;
  let angle = Math.random()*Math.PI*2;
  const speed = 2.8 + Math.random()*1.2;

  function fly() {
    y += speed;
    angle += 0.02;
    balloon.style.bottom = y + "px";
    balloon.style.transform = `translateX(${Math.sin(angle)*25}px)`;

    if (y < innerHeight + 400) {
      requestAnimationFrame(fly);
    } else {
      balloon.remove();
    }
  }
  fly();
}

// ⏱️ Tần suất thưa – 1 bóng / 2.5s
setInterval(createBalloon, 2500);
