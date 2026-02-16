/* ================= TRÁI TIM ================= */
const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let t = 0;

function drawHeart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "pink";

  for (let i = 0; i < 1200; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 16 * Math.sin(a) ** 3;
    const x = canvas.width / 2 + r * Math.cos(a) * 12;
    const y =
      canvas.height / 2 -
      (13 * Math.cos(a) -
        5 * Math.cos(2 * a) -
        2 * Math.cos(3 * a) -
        Math.cos(4 * a)) *
        12;

    ctx.globalAlpha = 0.6;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  requestAnimationFrame(drawHeart);
}
drawHeart();

/* ================= BÓNG BAY ================= */
const images = [
  "anh1.jpg","anh2.jpg","anh3.jpg","anh4.jpg","anh5.jpg",
  "anh6.jpg","anh7.jpg","anh8.jpg","anh9.jpg",
  "anh10.jpg","anh11.jpg","anh12.jpg"
];

function createBalloon() {
  const balloon = document.createElement("div");
  balloon.className = "balloon";

  // 🔥 ẢNH TO RÕ
  const size = Math.random() * 80 + 260; // 260–340px
  balloon.style.width = size + "px";
  balloon.style.height = size + "px";

  balloon.style.left =
    Math.random() * (window.innerWidth - size) + "px";

  const img = document.createElement("img");
  img.src = images[Math.floor(Math.random() * images.length)];
  balloon.appendChild(img);

  document.body.appendChild(balloon);

  let y = -400;
  const speed = Math.random() * 1.5 + 3.5;

  function fly() {
    y += speed;
    balloon.style.bottom = y + "px";

    if (y < window.innerHeight + 400) {
      requestAnimationFrame(fly);
    } else {
      balloon.remove();
    }
  }

  fly();
}

/* ⏱️ TẦN SUẤT THƯA – MỖI LẦN 1 BÓNG */
setInterval(createBalloon, 2800);
