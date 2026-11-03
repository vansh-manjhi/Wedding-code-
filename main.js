const $ = s => document.querySelector(s);
const C = CONFIG;

document.title = `${C.bride} & ${C.groomShort} | Wedding Invitation`;
document.querySelectorAll('.door .img').forEach(d => d.style.backgroundImage = `url(${C.images.gate})`);
$('#hero .bg').style.backgroundImage = `url(${C.images.hero})`;
$('#gateWho').textContent = `${C.bride.toUpperCase()}  &  ${C.groomShort.toUpperCase()}`;
$('#heroTag').textContent = "TOGETHER WITH THEIR FAMILIES";

const splitLetters = (el, txt, base) => { el.innerHTML = [...txt].map((c,i)=>`<span class="letter" style="transition-delay:${base+i*0.07}s">${c===' '?'&nbsp;':c}</span>`).join(''); };
splitLetters($('#heroBride'), C.bride, 0.3);
splitLetters($('#heroGroom'), C.groomShort, 0.9);

$('#heroDate').textContent = C.weddingDateText.toUpperCase();
$('#invLine').textContent = C.inviteLine;
$('#invNames').innerHTML = `${C.bride} <br>&amp;<br> ${C.groom}`;
$('#invDate').textContent = C.weddingDateText;
$('#invVenue').textContent = C.venueShort;
$('#sealTxt').textContent = C.bride[0] + C.groomShort[0];
$('#scDate').textContent = C.weddingDateText.replace(',', '').toUpperCase().split(' ').slice(1).join(' ');
$('#scText').innerHTML = `${C.weddingDateText.split(',')[0]} &middot; ${C.events[C.events.length-1].time}<br>${C.venueShort}`;
$('#brideImg').src = C.images.bride; $('#groomImg').src = C.images.groom;
$('#brideName').textContent = C.bride; $('#groomName').textContent = C.groom;
$('#brideInfo').textContent = C.brideInfo; $('#groomInfo').textContent = C.groomInfo;

$('#families').innerHTML = C.families.map((f,i)=>`<div class="fam reveal d${i+1}"><h4>${f.side.toUpperCase()}</h4>${f.names.map(n=>`<div>${n}</div>`).join('')}</div>`).join('');
$('#banners').innerHTML = C.events.map((e,i)=>`
  <div class="hang reveal d${i+1}"><div class="knob"></div>
    <div class="scroll-top"></div>
    <div class="banner"><div class="ph" style="background-image:url(${e.img})"></div>
      <div class="in"><h3>${e.name}</h3><div class="when">${e.date}<br>${e.time}</div><p>${e.note}</p><p style="margin-top:8px">&#127968; ${C.venue.name}</p></div></div>
    <div class="scroll-bot"></div><div class="tassel a"></div><div class="tassel b"></div>
  </div>`).join('');

$('#track').innerHTML = C.gallery.map(g=>`<figure class="gframe"><img src="${g.src}" alt="${g.cap}" draggable="false"><figcaption>${g.cap}</figcaption></figure>`).join('');
$('#vName').textContent = C.venue.name; $('#vAddr').textContent = C.venue.address; $('#vNote').textContent = C.venue.note;
$('#vMap').src = `https://maps.google.com/maps?q=${encodeURIComponent(C.venue.mapQuery)}&z=15&output=embed`;
$('#vBtn').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(C.venue.mapQuery)}`;
$('#fNames').textContent = `${C.bride} & ${C.groomShort}`;
$('#fFrom').textContent = C.footerFrom;
const bgm = $('#bgm'); bgm.src = C.music; bgm.volume = 0.55;

/* ================= FX CANVAS ================= */
const cv = $('#fx'), ctx = cv.getContext('2d');
let W, H, DPR = Math.min(window.devicePixelRatio || 1, 2);
function resize(){ W = innerWidth; H = innerHeight; cv.width = W*DPR; cv.height = H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
resize(); addEventListener('resize', resize);
const mouse = {x:-999,y:-999};
const petalColors = ['#e91e63','#f06292','#c2185b','#ff8a80','#ffb3c1','#d81b60'];
const petals = []; const sparks = [];
function newPetal(top){ return {x:Math.random()*W, y: top ? -20 : Math.random()*H, s:6+Math.random()*9, vy:.6+Math.random()*1.2, vx:(Math.random()-.5)*.6, r:Math.random()*6.28, vr:(Math.random()-.5)*.05, sw:Math.random()*6.28, c:petalColors[Math.random()*petalColors.length|0]}; }
let petalsOn = false;
function startPetals(){ petalsOn = true; for(let i=0;i<(W<700?28:48);i++) petals.push(newPetal(false)); }
addEventListener('pointermove', e => {
  mouse.x = e.clientX; mouse.y = e.clientY;
  for(let i=0;i<2;i++) sparks.push({x:e.clientX,y:e.clientY,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2-0.5,life:1,s:1+Math.random()*2.5});
});
function burst(x,y,n=120){
  for(let i=0;i<n;i++){ const a=Math.random()*6.28, sp=3+Math.random()*9;
    sparks.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-4,life:1.6,s:2+Math.random()*4,conf:true,c:['#d4a845','#f3d98b','#e91e63','#ffffff','#7a1022'][Math.random()*5|0]}); }
}
function drawPetal(p){
  ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.scale(1, Math.abs(Math.sin(p.sw))*0.6+0.4);
  const g = ctx.createRadialGradient(-p.s*.3,-p.s*.3,1,0,0,p.s); g.addColorStop(0,'#ffd1dc'); g.addColorStop(1,p.c);
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0,-p.s);
  ctx.bezierCurveTo(p.s,-p.s,p.s,p.s*.6,0,p.s); ctx.bezierCurveTo(-p.s,p.s*.6,-p.s,-p.s,0,-p.s); ctx.fill(); ctx.restore();
}
function loop(){
  ctx.clearRect(0,0,W,H);
  if(petalsOn) for(const p of petals){
    p.sw += .03; p.x += p.vx + Math.sin(p.sw)*.6; p.y += p.vy; p.r += p.vr;
    const dx = p.x-mouse.x, dy = p.y-mouse.y, d = Math.hypot(dx,dy);
    if(d < 110){ p.x += dx/d*3; p.y += dy/d*3; p.vr += .002; }
    if(p.y > H+20){ Object.assign(p, newPetal(true)); }
    drawPetal(p);
  }
  for(let i=sparks.length-1;i>=0;i--){ const s = sparks[i];
    s.x += s.vx; s.y += s.vy; if(s.conf){ s.vy += .25; s.vx *= .98; } s.life -= s.conf ? .012 : .03;
    if(s.life <= 0){ sparks.splice(i,1); continue; }
    ctx.globalAlpha = Math.min(1,s.life);
    if(s.conf){ ctx.fillStyle = s.c; ctx.fillRect(s.x,s.y,s.s,s.s*1.6); }
    else { ctx.fillStyle = '#f3d98b'; ctx.shadowColor = '#d4a845'; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(s.x,s.y,s.s,0,6.28); ctx.fill(); ctx.shadowBlur = 0; }
    ctx.globalAlpha = 1;
  }
  requestAnimationFrame(loop);
}
loop();

/* ================= GATE & AUDIO ================= */
let musicOn = false;
const mBtn = $('#musicBtn');
function setMusic(on){ musicOn = on; if(on){ bgm.play().catch(()=>{}); mBtn.classList.add('playing'); mBtn.innerHTML='&#9835;'; } else { bgm.pause(); mBtn.classList.remove('playing'); mBtn.innerHTML='&#128263;'; } }
mBtn.onclick = () => setMusic(!musicOn);
$('#openBtn').addEventListener('click', () => {
  $('#gate').classList.add('open'); setMusic(true); mBtn.style.display = 'flex';
  burst(innerWidth/2, innerHeight*.6, 160);
  setTimeout(()=>{ document.body.classList.remove('locked'); $('#hero .hero-text').classList.add('go'); startPetals(); }, 900);
  setTimeout(()=>{ $('#gate').style.display='none'; }, 3000);
});

/* ================= HERO PARALLAX ================= */
const heroBg = $('#hero .bg'), heroTx = $('#hero .hero-text');
$('#hero').addEventListener('pointermove', e => {
  const x = e.clientX/innerWidth - .5, y = e.clientY/innerHeight - .5;
  heroBg.style.transform = `scale(1.08) translate(${x*-30}px,${y*-20}px)`;
  heroTx.style.transform = `translate(${x*20}px,${y*14}px)`;
});

/* ================= SCROLL REVEAL ================= */
const io = new IntersectionObserver(es => es.forEach(en => { if(en.isIntersecting){ en.target.classList.add('show'); io.unobserve(en.target);} }), {threshold:.18});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ================= ENVELOPE ================= */
$('#envelope').addEventListener('click', function(){
  if(this.classList.contains('open')) return;
  this.classList.add('open'); $('#envHint').style.visibility='hidden';
  const r = this.getBoundingClientRect(); setTimeout(()=>burst(r.left+r.width/2, r.top, 90), 900);
});

/* ================= COUNTDOWN ================= */
const target = new Date(C.countdownTo).getTime(); const last = {};
function tick(){
  let diff = Math.max(0, target - Date.now());
  const v = { d: Math.floor(diff/864e5), h: Math.floor(diff/36e5)%24, m: Math.floor(diff/6e4)%60, s: Math.floor(diff/1e3)%60 };
  for(const k in v){ const el = $('#cd-'+k), t = String(v[k]).padStart(2,'0');
    if(last[k] !== t){ el.textContent = t; el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); last[k] = t; } }
}
tick(); setInterval(tick, 1000);

/* ================= SCRATCH CARD ================= */
(function(){
  const c = $('#scratch'), x = c.getContext('2d'); let drawing = false, done = false, moves = 0;
  function paint(){
    const r = c.getBoundingClientRect(); c.width = r.width; c.height = r.height;
    const g = x.createLinearGradient(0,0,c.width,c.height);
    g.addColorStop(0,'#b8862b'); g.addColorStop(.25,'#f6dc8e'); g.addColorStop(.5,'#c9962f'); g.addColorStop(.75,'#f3d98b'); g.addColorStop(1,'#9c6d1a');
    x.fillStyle = g; x.fillRect(0,0,c.width,c.height);
    x.globalAlpha = .18; for(let i=0;i<500;i++){ x.fillStyle = Math.random()>.5?'#fff':'#5a3a00'; x.fillRect(Math.random()*c.width,Math.random()*c.height,2,2); } x.globalAlpha = 1;
    x.fillStyle = '#5a0a18'; x.textAlign = 'center'; x.font = '600 26px Cinzel, serif'; x.fillText('SCRATCH TO REVEAL', c.width/2, c.height/2 - 6);
    x.font = '30px "Great Vibes", cursive'; x.fillText('our special day', c.width/2, c.height/2 + 34);
  }
  document.fonts.ready.then(paint);
  function pos(e){ const r = c.getBoundingClientRect(); return {x:e.clientX-r.left, y:e.clientY-r.top}; }
  let prev = null;
  function scratch(e){
    if(!drawing || done) return; const p = pos(e);
    x.globalCompositeOperation = 'destination-out'; x.lineWidth = 56; x.lineCap = 'round';
    x.beginPath(); x.moveTo((prev||p).x,(prev||p).y); x.lineTo(p.x,p.y); x.stroke(); prev = p;
    if(++moves % 12 === 0) check();
  }
  function check(){
    const d = x.getImageData(0,0,c.width,c.height).data; let clear = 0;
    for(let i=3;i<d.length;i+=64) if(d[i]===0) clear++;
    if(clear/(d.length/64) > .5){ done = true; c.style.opacity = 0; const r = c.getBoundingClientRect(); burst(r.left+r.width/2, r.top+r.height/2, 200); setTimeout(()=>c.style.display='none',1000); }
  }
  c.addEventListener('pointerdown', e => { drawing = true; prev = null; c.setPointerCapture(e.pointerId); scratch(e); });
  c.addEventListener('pointermove', scratch);
  c.addEventListener('pointerup', () => { drawing = false; prev = null; });
})();

/* ================= 3D TILT ================= */
document.querySelectorAll('.tilt').forEach(f => {
  f.addEventListener('pointermove', e => { const r = f.getBoundingClientRect(); const x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5;
    f.style.transform = `rotateY(${x*22}deg) rotateX(${-y*22}deg) scale(1.03)`; f.style.setProperty('--sx', (1-(x+.5))*100+'%'); });
  f.addEventListener('pointerleave', () => { f.style.transform = ''; });
});

/* ================= SWINGING BANNERS ================= */
document.querySelectorAll('.hang').forEach((h,i) => {
  let ang = 0, vel = 0, drag = false, t0 = i;
  h.addEventListener('pointerdown', e => { drag = true; h.setPointerCapture(e.pointerId); });
  h.addEventListener('pointermove', e => { if(!drag) return;
    const r = h.getBoundingClientRect(); const px = r.left + r.width/2, py = r.top - 90;
    const a = -Math.atan2(e.clientX - px, e.clientY - py) * 180/Math.PI;
    const na = Math.max(-45, Math.min(45, a)); vel = na - ang; ang = na; h.style.transform = `rotate(${ang}deg)`; });
  const up = () => { drag = false; }; h.addEventListener('pointerup', up); h.addEventListener('pointercancel', up);
  (function step(){
    if(!drag){ t0 += .016; const idle = Math.sin(t0*1.6)*1.8; vel += (idle - ang)*0.012; vel *= .985; ang += vel; h.style.transform = `rotate(${ang}deg)`; }
    requestAnimationFrame(step);
  })();
});

/* ================= GALLERY & LIGHTBOX ================= */
(function(){
  const wrap = $('#trackWrap'), track = $('#track'); let x = 0, v = 0, down = false, lastX = 0, moved = 0;
  const limit = () => Math.min(0, wrap.clientWidth - track.scrollWidth);
  wrap.addEventListener('pointerdown', e => { down = true; lastX = e.clientX; moved = 0; v = 0; wrap.setPointerCapture(e.pointerId); });
  wrap.addEventListener('pointermove', e => { if(!down) return; const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx); x += dx; v = dx; });
  wrap.addEventListener('pointerup', e => { down = false;
    if(moved < 6){ const el = document.elementFromPoint(e.clientX, e.clientY); const img = el && el.closest('.gframe');
      if(img){ $('#lightbox img').src = img.querySelector('img').src; $('#lightbox').classList.add('on'); } } });
  let auto = -0.4;
  (function step(){
    if(!down){ x += v; v *= .94; if(Math.abs(v) < .1) x += auto; }
    const lim = limit(); if(x > 0){ x *= .9; auto = -0.4; } if(x < lim){ x = lim + (x-lim)*.9; auto = 0.4; }
    track.style.transform = `translateX(${x}px)`; requestAnimationFrame(step);
  })();
  $('#lightbox').onclick = () => $('#lightbox').classList.remove('on');
})();

/* ================= RSVP ================= */
$('#rsvpForm').addEventListener('submit', e => {
  e.preventDefault();
  const msg = `RSVP for ${C.bride} & ${C.groomShort}'s wedding%0AName: ${$('#rName').value}%0APhone: ${$('#rPhone').value}%0AAttending: ${$('#rCome').value}%0AGuests: ${$('#rCount').value}`;
  const f = $('#rsvpForm'); f.classList.add('fly');
  const r = f.getBoundingClientRect(); burst(r.left+r.width/2, r.top+r.height/2, 120);
  setTimeout(()=>{ f.style.display='none'; $('#thanks').style.display='block'; }, 1100);
  if(C.whatsappNumber) window.open(`https://wa.me/${C.whatsappNumber}?text=${msg}`, '_blank');
});

/* ================= WISHES WALL ================= */
const KEY = 'wishes_' + C.bride + C.groomShort;
let wishes = JSON.parse(localStorage.getItem(KEY) || 'null') || [
  { n: "Priya", m: "Wishing you both a lifetime of love and laughter!" },
  { n: "Rohit", m: "Congratulations Neeraj and Sanjana! See you at the wedding." }
];
const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function renderWishes(){ $('#wishList').innerHTML = wishes.slice().reverse().map(w=>`<div class="wish"><b>${esc(w.n)}</b><div>${esc(w.m)}</div></div>`).join(''); }
renderWishes();
$('#wishForm').addEventListener('submit', e => {
  e.preventDefault(); wishes.push({ n: $('#wName').value, m: $('#wMsg').value });
  localStorage.setItem(KEY, JSON.stringify(wishes)); renderWishes(); e.target.reset();
  const r = $('#wishList').getBoundingClientRect(); burst(r.left+r.width/2, r.top, 60);
});