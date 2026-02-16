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

/* ================= ❤️ HEART (GIỮ NGUYÊN HÌNH) ================= */
const HEART_PARTICLES = 7200;
const HEART_SCALE = 165; // 🔥 CHỈ PHÓNG TO
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

/* ================= 🎈 BALLOONS (BAY TỪ TIM) ================= */
const BALLOON_COUNT = 22;
const balloons = [];

function newBalloon(){
  return{
    img: images[Math.floor(Math.random()*images.length)],
    x: canvas.width/2 + (Math.random()*100 - 50),
    y: canvas.height/2 + 60,
    r: 48 + Math.random()*12,
    speed: 0.55 + Math.random()*0.45,
    phase: Math.random()*Math.PI*2
  };
}

for(let i=0;i<BALLOON_COUNT;i++){
  balloons.push(newBalloon());
}

function drawBalloons(t){
  if(imagesReady < IMAGE_COUNT) return;

  for(const b of balloons){
    b.y -= b.speed;
    b.x += Math.sin(t + b.phase) * 0.7;

    if(b.y < -b.r*2){
      Object.assign(b, newBalloon());
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
    ctx.clip();

    ctx.drawImage(b.img, b.x-b.r, b.y-b.r, b.r*2, b.r*2);
    ctx.restore();

    ctx.strokeStyle="rgba(255,210,230,.9)";
    ctx.lineWidth=2;
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
