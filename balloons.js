const BALLOON_COUNT = 18;
const balloons = [];
const images = [];
let ready = false;

/* preload ảnh */
(function(){
  let loaded = 0;
  for(let i=1;i<=12;i++){
    const img = new Image();
    img.onload = img.onerror = () => {
      loaded++;
      if(loaded===12) ready = true;
    };
    img.src = `images/anh${i}.jpg`;
    images.push(img);
  }
})();

function createBalloon(){
  const size = 26 + Math.random()*22;
  const side = Math.random()<0.5 ? "left":"right";

  return{
    img: images[Math.random()*images.length|0],
    x: side==="left"
      ? Math.random()*innerWidth*0.25
      : innerWidth*0.75 + Math.random()*innerWidth*0.25,
    y: innerHeight + Math.random()*innerHeight,
    size,
    half:size/2,
    speed:0.3+Math.random()*0.4,
    sway:0.3+Math.random()*0.3,
    phase:Math.random()*Math.PI*2,
    alpha:0.4+Math.random()*0.3
  };
}

function drawBalloons(ctx,t){
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

    if(!b.img.complete || b.img.naturalWidth===0) continue;

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
