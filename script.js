/* ================== CANVAS TRÁI TIM ================== */
const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

function drawHeart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "pink";

  const scale = 11; // kích thước trái tim
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  for (let i = 0; i < 2000; i++) {
    const t = Math.random() * Math.PI * 2;
    const x =
      16 * Math.pow(Math.sin(t), 3);
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);

    ctx.globalAlpha = 0.6;
    ctx.fillRect(
      cx + x * scale,
      cy - y * scale,
      1.5,
      1.5
    );
  }

  requestAnimationFrame(drawHeart);
}
drawHeart();

/* ================== BÓNG BAY ẢNH ================== */
const images = [
  "anh1.jpg","anh2.jpg","anh3.jpg","anh4.jpg","anh5.jpg",
  "anh6.jpg","anh7.jpg","anh8.jpg","anh9.jpg",
  "anh10.jpg","anh11.jpg","anh12.jpg"
];

// vùng cấm (trái tim)
const heartZone = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  r: 220
};

function createBalloon() {
  const balloon = document.createElement("div");
  balloon.className = "balloon";

  const size = 260 + Math.random() * 80; // ảnh TO
  balloon.style.width = size + "px";
  balloon.style.height = size + "px";

  let x;
  do {
    x = Math.random() * (window.innerWidth - size);
  } while (
    Math.abs(x + size / 2 - heartZone.x) < heartZone.r
  );

  let y = -350;
  let angle = Math.random() * Math.PI * 2;
  let speed = 1.8 + Math.random() * 1.2;

  balloon.style.left = x + "px";
  balloon.style.bottom = y + "px";

  const img = document.createElement("img");
  img.src = images[Math.floor(Math.random() * images.length)];
  balloon.appendChild(img);

  document.body.appendChild(balloon);

  function fly() {
    y += speed;
    angle += 0.02;

    const drift = Math.sin(angle) * 30;

    balloon.style.bottom = y + "px";
    balloon.style.transform = `translateX(${drift}px)`;

    if (y < window.innerHeight + 400) {
      requestAnimationFrame(fly);
    } else {
      balloon.remove();
    }
  }

  fly();
}

// ⏱️ Tần suất THƯA – mỗi lần 1 bóng
setInterval(createBalloon, 3000);
