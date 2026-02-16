const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

function resize(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

/* ================= ❤️ HEART ================= */
const HEART_PARTICLES = 6000;
const HEART_SCALE = 95; // to hơn, rõ hơn
let heartPoints = [];

function heartFn(x,y){
  const a = x*x + y*y - 1;
  return a*a*a - x*x*y*y*y;
}

function generateHeart(){
  heartPoints=[];
  while(heartPoints.length<HEART_PARTICLES){
    let x=(Math.random()*2-1)*1.3;
    let y=(Math.random()*2-1)*1.3;
    if(heartFn(x,y)<=0){
      heartPoints.push({
        x,y,
        r:0.004,
        phase:Math.random()*Math.PI*2
      });
    }
  }
}
generateHeart();

function drawHeart(t){
  const pulse=1+Math.sin(t)*0.06;
  ctx.save();
  ctx.translate(canvas.width/2,canvas.height/2);
  ctx.scale(HEART_SCALE*pulse,-HEART_SCALE*pulse);

  for(const p of heartPoints){
    const a=0.85+0.15*Math.sin(t*2+p.phase);
    ctx.fillStyle=`rgba(255,160,200,${a})`;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}

/* ================= 🎈 BALLOONS ================= */
const BALLOON_COUNT = 16;
const IMAGE_COUNT = 12;
const balloons=[];
const images=[];

/* load ảnh */
for(let i=1;i<=IMAGE_COUNT;i++){
  const img=new Image();
  img.src=`images/anh${i}.jpg`;
  images.push(img);
}

function newBalloon(){
  return{
    img: images[Math.floor(Math.random()*images.length)],
    x: Math.random()*canvas.width,
    y: canvas.height + Math.random()*300,
    r: 34 + Math.random()*10, // TO hơn
    speed: 0.4 + Math.random()*0.4,
    phase: Math.random()*Math.PI*2
  };
}

for(let i=0;i<BALLOON_COUNT;i++) balloons.push(newBalloon());

function drawBalloons(t){
  for(const b of balloons){
    b.y -= b.speed;
    b.x += Math.sin(t+b.phase)*0.4;

    if(b.y < -b.r*2){
      Object.assign(b,newBalloon());
      b.y = canvas.height + 50;
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
    ctx.closePath();
    ctx.clip();

    if(b.img.complete && b.img.naturalWidth>0){
      ctx.drawImage(b.img,b.x-b.r,b.y-b.r,b.r*2,b.r*2);
    }else{
      ctx.fillStyle="#f2a6c8";
      ctx.fill();
    }

    ctx.restore();

    /* viền bóng */
    ctx.strokeStyle="rgba(255,200,220,.8)";
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
    ctx.stroke();
  }
}

/* ================= 🎬 ANIMATE ================= */
let t=0;
function animate(){
  t+=0.02;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  drawBalloons(t);
  drawHeart(t);

  requestAnimationFrame(animate);
}
animate();
