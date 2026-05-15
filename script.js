function openGame(url){
  window.location.href = url;
}

/* ======================
   Background Particles
====================== */

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

let W,H;

function resize(){
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
}

resize();

addEventListener("resize",resize);

const particles=[];

for(let i=0;i<90;i++){

  particles.push({
    x:Math.random()*W,
    y:Math.random()*H,
    r:1+Math.random()*3,
    vx:(Math.random()-.5)*0.3,
    vy:(Math.random()-.5)*0.3,
    a:Math.random()
  });
}

function animate(){

  requestAnimationFrame(animate);

  ctx.clearRect(0,0,W,H);

  particles.forEach(p=>{

    p.x += p.vx;
    p.y += p.vy;

    if(p.x<0)p.x=W;
    if(p.x>W)p.x=0;

    if(p.y<0)p.y=H;
    if(p.y>H)p.y=0;

    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      p.r,
      0,
      Math.PI*2
    );

    ctx.fillStyle=
      `rgba(128,255,219,${p.a*.5})`;

    ctx.fill();
  });
}

animate();