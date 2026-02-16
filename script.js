const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

function resize(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

/* ================= PRELOAD IMAGES ================= */
const IMAGE_COUNT = 12;
const images = [];
let imagesReady = 0;

for(let i=1;i<=IMAGE_COUNT;i++){
  const img = new Image();
  img.onload = ()=> imagesReady++;
  img.src = `anh${i}.jpg`;
  images.push(img);
}

/* ================= ❤️ HEART (GIỮ NGUYÊN) ================= */
const HEART_PARTICLES = 7200;
const HEART_SCALE = 165;
let heartPoints = [];

function heartFn(x,y){
  const a = x*x + y*y - 1;
  return a*a*a - x*x*y*y*y;
}

function generateHeart(){
  heartPoints=[];
  while(heartPoints.length < HEART_PARTICLES){
    let x=(Math.random()*2-1)*1.3;
    let y=(Math.random()*2-1)*1.3;
    if(heartFn(x,y)<=0){
      heartPoints.push({
        x,y,
        r:0.0034,
        phase:Math.random()*Math.PI*2
      });
    }
  }
}
generateHeart();

function drawHeart(t){
  const pulse = 1 + Math.sin(t)*0.05;
  ctx.save();
  ctx.translate(canvas.width/2, canvas.height/2);
  ctx.scale(HEART_SCALE*pulse, -HEART_SCALE*pulse);

  for(const p of heartPoints){
    const a = 0.9 + 0.1*Math.sin(t*2 + p.phase);
    ctx.fillStyle = `rgba(255,165,205,${a})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}

/* ================= 🎈 BALLOONS (TỪNG QUẢ – TỪ DƯỚI LÊN) ================= */
const balloons = [];
const SPAWN_DELAY = 45; // ⏱ sinh từng quả (frame)
let spawnCounter = 0;

function newBalloon(){
  const side = Math.random() < 0.5 ? -1 : 1; // trái / phải
  return{
    img: images[Math.floor(Math.random()*images.length)],
    x: canvas.width/2 + side * (160 + Math.random()*120), // né tim
    y: canvas.height + 80,
    r: 60 + Math.random()*15,   // 🔥 TO RÕ
    speed: 0.6 + Math.random()*0.4,
    sway: Math.random()*Math.PI*2
  };
}

function drawBalloons(t){
  if(imagesReady < IMAGE_COUNT) return;

  /* sinh bóng TỪNG QUẢ */
  spawnCounter++;
  if(spawnCounter > SPAWN_DELAY){
    balloons.push(newBalloon());
    spawnCounter = 0;
  }

  for(let i=balloons.length-1;i>=0;i--){
    const b = balloons[i];
    b.y -= b.speed;
    b.x += Math.sin(t + b.sway) * 0.4;

    /* ra khỏi màn hình thì xoá */
    if(b.y < -b.r*2){
      balloons.splice(i,1);
      continue;
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
    ctx.clip();

    ctx.drawImage(b.img, b.x-b.r, b.y-b.r, b.r*2, b.r*2);
    ctx.restore();

    ctx.strokeStyle = "rgba(255,210,230,.95)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
    ctx.stroke();
  }
}

/* ================= 🎬 ANIMATION ================= */
let t = 0;
function animate(){
  t += 0.02;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  drawBalloons(t);
  drawHeart(t);

  requestAnimationFrame(animate);
}
animate();
