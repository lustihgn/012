/* =====================================================
   ❤️ HEART
===================================================== */
const HEART_PARTICLES = 6000;
const HEART_SCALE = 85;
let heartPoints = [];

function heartFn(x,y){
  const a = x*x + y*y - 1;
  return a*a*a - x*x*y*y*y;
}

function generateHeart(){
  heartPoints = [];
  while(heartPoints.length < HEART_PARTICLES){
    const x = (Math.random()*2-1)*1.35;
    const y = (Math.random()*2-1)*1.35;
    if(heartFn(x,y) <= 0){
      const d = Math.sqrt(x*x+y*y);
      if(Math.random() < Math.pow(d,1.6)){
        heartPoints.push({
          x,y,
          r:0.003+Math.random()*0.0015,
          dir:Math.random()*Math.PI*2,
          speed:0.4+Math.random()*0.5,
          phase:Math.random()*Math.PI*2,
          sparkle:Math.random()<0.06,
          edge:d
        });
      }
    }
  }
}
generateHeart();

function drawHeart(ctx, canvas, t){
  const pulse = 1 + Math.sin(t)*0.045;
  ctx.save();
  ctx.translate(canvas.width/2, canvas.height/2);
  ctx.scale(HEART_SCALE*pulse, -HEART_SCALE*pulse);

  for(const p of heartPoints){
    const dx = Math.cos(p.dir+t*p.speed)*0.002;
    const dy = Math.sin(p.dir+t*p.speed)*0.002;
    let a = 0.55+p.edge*0.25;
    if(p.sparkle) a += (Math.sin(t*2+p.phase)+1)*0.18;

    ctx.fillStyle = `rgba(255,170,210,${a})`;
    ctx.beginPath();
    ctx.arc(p.x+dx,p.y+dy,p.r,0,Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}

/* =====================================================
   🎈 BALLOONS (ẢNH – FIX CHẮC CHẮN HIỆN)
===================================================== */
const BALLOON_COUNT = 16;
const IMAGE_COUNT = 12;
const balloons = [];
const images = [];
let ready = false;

/* load ảnh an toàn */
let loaded = 0;
for(let i=1;i<=IMAGE_COUNT;i++){
  const img = new Image();
  img.src = `images/anh${i}.jpg`;
  img.onload = ()=>{
    loaded++;
    if(loaded === IMAGE_COUNT) ready = true;
  };
  images.push(img);
}

function createBalloon(canvas){
  const left = Math.random()<0.5;
  return {
    img: images[Math.floor(Math.random()*IMAGE_COUNT)],
    x: left
      ? Math.random()*canvas.width*0.25
      : canvas.width*0.75 + Math.random()*canvas.width*0.25,
    y: canvas.height + Math.random()*canvas.height,
    size: 26 + Math.random()*28,
    speed: 0.5 + Math.random()*0.6,
    phase: Math.random()*Math.PI*2,
    alpha: 0.45 + Math.random()*0.35
  };
}

function drawBalloons(ctx, canvas, t){
  if(!ready) return;

  if(!balloons.length){
    for(let i=0;i<BALLOON_COUNT;i++){
      balloons.push(createBalloon(canvas));
    }
  }

  for(const b of balloons){
    b.y -= b.speed;
    b.x += Math.sin(t + b.phase)*0.4;

    if(b.y < -80){
      Object.assign(b, createBalloon(canvas));
    }

    ctx.globalAlpha = b.alpha;
    ctx.drawImage(
      b.img,
      b.x - b.size/2,
      b.y - b.size/2,
      b.size,
      b.size
    );
  }
  ctx.globalAlpha = 1;
}
