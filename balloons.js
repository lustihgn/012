const BALLOON_COUNT = 24;
const IMAGE_COUNT = 12;
const balloons = [];
const balloonImages = [];

/* load ảnh */
for(let i=1;i<=IMAGE_COUNT;i++){
  const img = new Image();
  img.src = `images/anh${i}.jpg`;
  balloonImages.push(img);
}

function createBalloon(canvas){
  const side = Math.random() < 0.5 ? -1 : 1;

  return {
    img: balloonImages[Math.floor(Math.random()*IMAGE_COUNT)],
    x: canvas.width/2 + side*(260 + Math.random()*220),
    y: canvas.height + Math.random()*canvas.height,
    size: 28 + Math.random()*26,
    speed: 0.25 + Math.random()*0.45,
    phase: Math.random()*Math.PI*2,
    alpha: 0.12 + Math.random()*0.18
  };
}

function drawBalloons(ctx, canvas, t){
  if(!balloons.length){
    for(let i=0;i<BALLOON_COUNT;i++){
      balloons.push(createBalloon(canvas));
    }
  }

  for(const b of balloons){
    b.y -= b.speed;
    b.x += Math.sin(t + b.phase) * 0.25;

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
