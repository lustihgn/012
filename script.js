const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* ================= HEART ================= */
const HEART_POINTS = 7000;
const HEART_SCALE = 130;
let heart = [];

function heartFn(x, y){
  const a = x*x + y*y - 1;
  return a*a*a - x*x*y*y*y;
}

function createHeart(){
  heart = [];
  while(heart.length < HEART_POINTS){
    const x = (Math.random()*2 - 1)*1.4;
    const y = (Math.random()*2 - 1)*1.4;
    if(heartFn(x,y) <= 0){
      heart.push({
        x, y,
        r: 0.0025 + Math.random()*0.0015,
        a: 0.5 + Math.random()*0.4
      });
    }
  }
}
createHeart();

/* ================= BALLOONS ================= */
const BALLOON_COUNT = 16;
const IMAGE_COUNT = 12;
const balloons = [];
const images = [];
let imagesReady = false;

let loaded = 0;
for(let i=1;i<=IMAGE_COUNT;i++){
  const img = new Image();
  img.src = `images/anh${i}.jpg`;
  img.onload = () => {
    loaded++;
    if(loaded === IMAGE_COUNT) imagesReady = true;
  };
  images.push(img);
}

function createBalloon(side){
  return {
    img: images[Math.floor(Math.random()*images.length)],
    x: side === "left"
      ? Math.random()*canvas.width*0.25
      : canvas.width*0.75 + Math.random()*canvas.width*0.25,
    y: canvas.height + Math.random()*canvas.height,
    size: 40 + Math.random()*35,
    speed: 0.6 + Math.random()*0.8,
    sway: Math.random()*Math.PI*2
  };
}

function initBalloons(){
  balloons.length = 0;
  for(let i=0;i<BALLOON_COUNT;i++){
    balloons.push(createBalloon(i%2===0?"left":"right"));
  }
}
initBalloons();

/* ================= DRAW ================= */
let t = 0;
function animate(){
  t += 0.02;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  /* Balloons */
  balloons.forEach(b=>{
    b.y -= b.speed;
    b.x += Math.sin(t + b.sway)*0.5;

    if(b.y < -100){
      Object.assign(b, createBalloon(Math.random()<0.5?"left":"right"));
    }

    if(imagesReady && b.img.complete && b.img.naturalWidth){
      ctx.drawImage(b.img, b.x-b.size/2, b.y-b.size/2, b.size, b.size);
    }else{
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.size/2, 0, Math.PI*2);
      ctx.fillStyle = "rgba(255,190,215,0.85)";
      ctx.fill();
    }
  });

  /* Heart */
  const pulse = 1 + Math.sin(t*2)*0.04;
  ctx.save();
  ctx.translate(canvas.width/2, canvas.height/2);
  ctx.scale(HEART_SCALE*pulse, -HEART_SCALE*pulse);

  heart.forEach(p=>{
    ctx.fillStyle = `rgba(255,170,210,${p.a})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();
  });
  ctx.restore();

  requestAnimationFrame(animate);
}
animate();
