const BALLOON_COUNT = 18;
const balloons = [];
let frame = 0;

function createBalloon(canvas){
  const side = Math.random() < 0.5 ? -1 : 1;
  return {
    x: canvas.width/2 + side*(200+Math.random()*180),
    y: canvas.height + Math.random()*canvas.height,
    r: 10 + Math.random()*8,
    speed: 0.2 + Math.random()*0.35,
    sway: 0.2 + Math.random()*0.2,
    phase: Math.random()*Math.PI*2,
    alpha: 0.18 + Math.random()*0.12,
    color: `hsl(${330 + Math.random()*30},80%,70%)`
  };
}

function drawBalloonShape(ctx, b){
  ctx.beginPath();
  ctx.ellipse(b.x, b.y, b.r*0.9, b.r*1.15, 0, 0, Math.PI*2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(b.x, b.y + b.r*1.15);
  ctx.lineTo(b.x, b.y + b.r*1.5);
  ctx.stroke();
}

function drawBalloons(ctx, canvas, t){
  if(!balloons.length){
    for(let i=0;i<BALLOON_COUNT;i++){
      balloons.push(createBalloon(canvas));
    }
  }

  frame++;
  const update = frame % 2 === 0;

  ctx.lineWidth = 1;

  for(const b of balloons){
    if(update){
      b.y -= b.speed;
      b.x += Math.sin(t + b.phase) * b.sway;

      if(b.y < -60){
        Object.assign(b, createBalloon(canvas));
      }
    }

    ctx.globalAlpha = b.alpha;
    ctx.fillStyle = b.color;
    ctx.strokeStyle = b.color;

    drawBalloonShape(ctx, b);
  }
  ctx.globalAlpha = 1;
}
