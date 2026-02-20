/* ================= CANVAS ================= */
const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
const openBtn = document.getElementById("openBtn");
const music = document.getElementById("bgMusic");
const birthdayText = document.getElementById("birthdayText");

let w, h;
function resize(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* ================= HEART (GIỮ NGUYÊN TUYỆT ĐỐI) ================= */
const COUNT = 6000;
const particles = [];

function heart(t){
  return {
    x: 16 * Math.sin(t)**3,
    y: -(13*Math.cos(t)
        - 5*Math.cos(2*t)
        - 2*Math.cos(3*t)
        - Math.cos(4*t))
  };
}

function generate(){
  particles.length = 0;
  while(particles.length < COUNT){
    const a = Math.random() * Math.PI * 2;
    const k = Math.pow(Math.random(), 0.35);
    const p = heart(a);
    const center = Math.abs(p.x * k);
    if(Math.random() > Math.min(1, Math.pow(center / 1.0, 0.85))) continue;

    particles.push({
      nx: p.x * k,
      ny: p.y * k,
      r: 0.028 + k * 0.085,
      baseO: 0.25 + k * 0.55,
      phase: Math.random() * Math.PI * 2,
      speed: 0.006 + Math.random() * 0.01
    });
  }
}
generate();

/* ================= BUILD ================= */
let build = 0;
let building = false;
let started = false;
const buildSpeed = 0.004;

function ease(t){
  return t * t * (3 - 2 * t);
}

/* ================= 12 ẢNH ================= */
const images = [];
for(let i = 1; i <= 12; i++){
  const img = new Image();
  img.src = `anh${i}.jpg`;
  images.push(img);
}

const photoParticles = [];

function spawnPhoto(){
  const img = images[Math.floor(Math.random()*images.length)];
  photoParticles.push({
    img,
    x: (Math.random() < 0.5 ? -1 : 1) * (1.6 + Math.random() * 0.8),
    y: (Math.random() - 0.5) * 2.2,
    z: -10,
    vz: 0.1 + Math.random() * 0.05,
    rot: (Math.random() - 0.5) * 0.3,
    vr: (Math.random() - 0.5) * 0.01
  });
}

/* ================= CHỮ BAY ================= */
const texts = ["I Love You", "Anh Yêu Em", "Forever", "My Love", "💖"];
const textParticles = [];

function spawnText(){
  const text = texts[Math.floor(Math.random()*texts.length)];
  textParticles.push({
    text,
    x: 0,
    y: 2.6 + Math.random() * 1.2,
    z: -10,
    vz: 0.08 + Math.random() * 0.05
  });
}

/* ================= DRAW ================= */
let lastTime = 0;
function draw(now){
  requestAnimationFrame(draw);
  if(!started) return;
  if(now - lastTime < 16) return;
  lastTime = now;

  ctx.clearRect(0,0,w,h);

  if(building){
    build += buildSpeed;
    if(build >= 1){
      build = 1;
      building = false;
    }
  }

  const a = ease(build);
  const t = now * 0.0025;
  const beat = 1 + Math.sin(t)*0.03 + Math.sin(t*2)*0.012;

  ctx.save();
  ctx.translate(w/2, h/2);
  ctx.scale(13 * beat, 13 * beat);

  /* HEART */
  for(const p of particles){
    p.phase += p.speed;
    const sparkle = (Math.sin(p.phase) + 1) * 0.12;
    const pulse = (beat - 1) * 0.6;
    const x = p.nx * a;
    const y = p.ny * a;
    ctx.globalAlpha = (p.baseO + sparkle) * a;
    ctx.beginPath();
    ctx.arc(x + x*pulse, y + y*pulse, p.r, 0, Math.PI*2);
    ctx.fillStyle = "rgb(255,105,135)";
    ctx.fill();
  }

  /* SPAWN */
  if(!building){
    if(Math.random() < 0.012) spawnPhoto();
    if(Math.random() < 0.007) spawnText();
  }

  /* PHOTOS */
  for(let i = photoParticles.length - 1; i >= 0; i--){
    const p = photoParticles[i];
    p.z += p.vz;
    p.rot += p.vr;

    const s = 1 / (1 + p.z * 0.28);
    if(s > 6){ photoParticles.splice(i,1); continue; }

    ctx.save();
    ctx.translate(p.x * 13, p.y * 13);
    ctx.scale(s, s);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.min(1, s * 0.75);
    ctx.filter = s < 0.9 ? "blur(1.2px)" : "none";
    ctx.drawImage(p.img, -2.2, -2.2, 4.4, 4.4);
    ctx.restore();
    ctx.filter = "none";
  }

  /* TEXT */
  for(let i = textParticles.length - 1; i >= 0; i--){
    const p = textParticles[i];
    p.z += p.vz;
    const s = 1 / (1 + p.z * 0.35);
    if(s > 4){ textParticles.splice(i,1); continue; }

    ctx.save();
    ctx.translate(p.x * 13, p.y * 13);
    ctx.scale(s, s);
    ctx.globalAlpha = Math.min(1, s * 0.9);
    ctx.fillStyle = "rgba(255,190,210,0.95)";
    ctx.font = "bold 1px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(p.text, 0, 0);
    ctx.restore();
  }

  ctx.restore();
  ctx.globalAlpha = 1;
}

/* ================= OPEN ================= */
openBtn.onclick = () => {
  openBtn.style.opacity = 0;
  openBtn.style.pointerEvents = "none";

  birthdayText.style.opacity = 1;
  music.play();

  build = 0;
  building = true;
  started = true;

  requestAnimationFrame(draw);
};
