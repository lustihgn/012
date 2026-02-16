const balloonImages = [
  "anh1.jpg", "anh2.jpg", "anh3.jpg", "anh4.jpg", "anh5.jpg",
  "anh6.jpg", "anh7.jpg", "anh8.jpg", "anh9.jpg",
  "anh10.jpg", "anh11.jpg", "anh12.jpg"
];

const container = document.body;

// ===== TẠO 1 BÓNG BAY =====
function createBalloon() {
  const balloon = document.createElement("div");
  balloon.className = "balloon";

  // 🔥 ẢNH TO RÕ (240–300px)
  const size = Math.random() * 60 + 240;

  balloon.style.width = size + "px";
  balloon.style.height = size + "px";

  // Vị trí ngang ngẫu nhiên
  balloon.style.left = Math.random() * (window.innerWidth - size) + "px";

  // Bắt đầu từ dưới màn hình
  balloon.style.bottom = "-350px";

  // Chọn ảnh ngẫu nhiên
  const img = document.createElement("img");
  img.src = balloonImages[Math.floor(Math.random() * balloonImages.length)];
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  img.style.borderRadius = "50%";

  balloon.appendChild(img);
  container.appendChild(balloon);

  // 🔥 BAY NHANH HƠN
  let position = -350;
  const speed = Math.random() * 1.5 + 3; // tốc độ cao

  function fly() {
    position += speed;
    balloon.style.bottom = position + "px";

    if (position < window.innerHeight + 400) {
      requestAnimationFrame(fly);
    } else {
      balloon.remove();
    }
  }

  fly();
}

// ⏱️ TẦN SUẤT BAY THƯA (1 bóng / 2.5 giây)
setInterval(createBalloon, 2500);
