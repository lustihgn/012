const HEART_PARTICLES = 8000;
const HEART_SCALE = 115;
let heartPoints = [];

function heartFn(x,y){
  const a = x*x + y*y - 1;
  return a*a*a - x*x*y*y*y;
}

function generateHeart(){
  heartPoints = [];
  while(heartPoints.length < HEART_PARTICLES){
    let x = (Math.random()*2-1)*1.35;
    let y = (Math.random()*2-1)*1.35;

    if(heartFn(x,y) <= 0){
      const d = Math.sqrt(x*x + y*y);
      if(Math.random() < Math.pow(d,1.6)){
        heartPoints.push({
          x, y,
          r: 0.003 + Math.random()*0.0016,
          dir: Math.random()*Math.PI*2,
          speed: 0.5 + Math.random()*0.6,
          phase: Math.random()*Math.PI*2,
          sparkle: Math.random() < (d > 0.75 ? 0.1 : 0.05),
          edge: d
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
    const amp = 0.002;
    const dx = Math.cos(p.dir + t*p.speed) * amp;
    const dy = Math.sin(p.dir + t*p.speed) * amp;

    let alpha = 0.55 + p.edge*0.3;
    if(p.sparkle){
      alpha += (Math.sin(t*2 + p.phase)+1)*0.18;
    }

    ctx.fillStyle = `rgba(255,170,210,${alpha})`;
    ctx.beginPath();
    ctx.arc(p.x+dx, p.y+dy, p.r, 0, Math.PI*2);
    ctx.fill();
  }

  ctx.restore();
}
