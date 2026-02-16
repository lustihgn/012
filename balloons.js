const BALLOON_COUNT = 14;
const IMAGE_COUNT = 12;

const balloons = [];
const balloonImages = [];

let loaded = 0;
let ready = false;
let frame = 0;

/* preload */
for(let i=1;i<=IMAGE_COUNT;i++){
  const img = new Image();
  img.onload = () => {
    loaded++;
    if(loaded === IMAGE_COUNT) ready = true;
  };
  img.src = `images/anh${i}.jpg`;
  balloonImages.push(img);
}

function createBalloon(canvas){
  const side = Math.random()<0.5?-1:1;
  const size = 24+Math.random()*20;

  return{
    img: balloonImages[Math.random()*IMAGE_COUNT|0],
    x: canvas.width/2 + side*(200+Math.random()*160),
    y: canvas.height + Math.random()*canvas.height,
    size,
    half:size/2,
    speed:0.18+Math.random()*0.3,
    sway:0.12+Math.random()*0.12,
    phase:Math.random()*Math.PI*2,
    alpha:0.16
  };
}

function drawBalloons(ctx, canvas, t){
  if(!ready) return;

  if(!balloons.length){
    for(let i=0;i<BALLOON_COUNT;i++){
      balloons.push(createBalloon(canvas));
    }
  }

  frame++;
  const update = frame%3===0;

  for(const b of balloons){

    if(update){
      b.y -= b.speed;
      b.x += Math.sin(t+b.phase)*b.sway;

      if(b.y < -60){
        Object.assign(b, createBalloon(canvas));
        continue;
      }
    }

    if(
      b.x < -b.size ||
      b.x > canvas.width + b.size ||
      b.y > canvas.height + b.size
    ) continue;

    ctx.globalAlpha = b.alpha;
    ctx.drawImage(
      b.img,
      b.x-b.half,
      b.y-b.half,
      b.size,
      b.size
    );
  }
  ctx.globalAlpha = 1;
}
