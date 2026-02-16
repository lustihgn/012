const BALLOON_COUNT = 16;
const images = [];
const balloons = [];
let ready = false;

/* preload ảnh */
(function(){
  let loaded = 0;
  for(let i=1;i<=12;i++){
    const img = new Image();
    img.onload = img.onerror = () => {
      loaded++;
      if(loaded === 12) ready = true;
    };
    img.src = `images/anh${i}.jpg`;
    images.push(img);
  }
})();

function createBalloon(){
  const size = 26 + Math.random()*20;
  return {
    img: images[Math.random()*images.length|0],
    x: innerWidth/2 + (Math.random()<0.5?-1:1)*(200+Math.random()*160),
    y: innerHeight + Math.random()*innerHeight,
    size,
    half: size/2,
    speed: 0.25 + Math.random()*0.35,
    sway: 0.2 + Math.random()*0.2,
    phase: Math.random()*Math.PI*2,
    alpha: 0.18+Math.random()*0.12
  };
}

function drawBalloons(ctx, t){
  if(!ready) return;

  if(!balloons.length){
    for(let i=0;i<BALLOON_COUNT;i++) balloons.push(createBalloon());
  }

  for(const b of balloons){
    b.y -= b.speed;
    b.x += Math.sin(t+b.phase)*b.sway;

    if(b.y < -80){
      Object.assign(b, createBalloon());
    }

    if(!b.img.complete || b.img.naturalWidth === 0) continue;

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
