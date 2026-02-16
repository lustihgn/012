const HEART_PARTICLES = 6500;
const HEART_SCALE = 85; // 👈 nhỏ hơn để chừa 2 bên
const heartPoints = [];

function heartFn(x,y){
  const a = x*x + y*y - 1;
  return a*a*a - x*x*y*y*y;
}

(function generate(){
  while(heartPoints.length < HEART_PARTICLES){
    const x = (Math.random()*2-1)*1.35;
    const y = (Math.random()*2-1)*1.35;
    if(heartFn(x,y)<=0){
      const d = Math.sqrt(x*x+y*y);
      if(Math.random()<Math.pow(d,1.6)){
        heartPoints.push({
          x,y,
          r:0.003+Math.random()*0.0014,
          dir:Math.random()*Math.PI*2,
          speed:0.4+Math.random()*0.5,
          phase:Math.random()*Math.PI*2,
          sparkle:Math.random()<0.06,
          edge:d
        });
      }
    }
  }
})();

function drawHeart(ctx,t){
  const cx = innerWidth/2;
  const cy = innerHeight/2;
  const pulse = 1 + Math.sin(t)*0.04;

  ctx.save();
  ctx.translate(cx,cy);
  ctx.scale(HEART_SCALE*pulse,-HEART_SCALE*pulse);

  for(const p of heartPoints){
    const dx = Math.cos(p.dir+t*p.speed)*0.002;
    const dy = Math.sin(p.dir+t*p.speed)*0.002;
    let a = 0.55 + p.edge*0.3;
    if(p.sparkle) a += (Math.sin(t*2+p.phase)+1)*0.18;

    ctx.fillStyle = `rgba(255,170,210,${a})`;
    ctx.beginPath();
    ctx.arc(p.x+dx,p.y+dy,p.r,0,Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}
