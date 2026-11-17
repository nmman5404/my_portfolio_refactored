import { drawDoodle, DOODLE_COUNT } from './doodle-drawings.js';

/** Soft notebook marginalia and little toy celebrations. The page owns the clock. */
export function createAtmosphere(canvas, atlas = null) {
  const context = canvas.getContext('2d', { alpha: true });
  const empty = { render() {}, resize() {}, destroy() {} };
  if (!context) return empty;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const tau = Math.PI * 2;
  const clamp = (value, low = 0, high = 1) => Math.max(low, Math.min(high, value));
  let width = 1, height = 1, ratio = 1, destroyed = false, doodleLayer = null;
  let randomState = 7226;
  const random = () => {
    randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
    return randomState / 4294967296;
  };
  const dust = Array.from({ length: 32 }, () => ({
    x: random(), y: random(), size: 0.45 + random() * 0.75,
    phase: random() * tau, speed: 0.07 + random() * 0.08,
  }));
  const particles = Array.from({ length: 16 }, () => ({
    angle: random() * tau, speed: 75 + random() * 115,
    spin: (random() - 0.5) * 3, size: 10 + random() * 4, delay: random() * 0.12,
  }));
  const toyColors = ['#ccb88d', '#92aaba', '#b2a4bf', '#ded5c1'];
  const cannonPieces = Array.from({ length: 60 }, (_, index) => ({
    side: index % 2 ? 1 : -1,
    horizontal: 0.12 + random() * 0.13,
    upward: 0.76 + random() * 0.25,
    gravity: 0.64 + random() * 0.12,
    delay: random() * 0.16,
    size: 22 + random() * 8,
    spin: (random() < 0.5 ? -1 : 1) * (1.4 + random() * 3.6),
    flutter: random() * tau, shape: Math.floor(index / 2) % 4, color: toyColors[Math.floor(index / 2) % 4],
  }));
  canvas.style.pointerEvents = 'none';
  canvas.setAttribute('aria-hidden', 'true');

  function buildDoodleLayer() {
    const doc = canvas.ownerDocument || (typeof document === 'undefined' ? null : document);
    if (!doc?.createElement) {doodleLayer = null;return;}
    const layer = doc.createElement('canvas');
    layer.width = Math.ceil(width * ratio);layer.height = Math.ceil(height * ratio);
    const ctx = layer.getContext('2d');
    if (!ctx) {doodleLayer = null;return;}
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    let seed = (2948 ^ Math.imul(Math.round(width), 73856093) ^ Math.imul(Math.round(height), 19349663)) >>> 0;
    const rand = () => {seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;return seed / 4294967296;};
    const mobile=width<650;
    const count=Math.round(clamp(width*height/(mobile?10000:16500),mobile?30:height<500?32:56,mobile?45:110));
    const order=Array.from({length:DOODLE_COUNT},(_,i)=>i);
    const shuffle=()=>{for(let i=order.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[order[i],order[j]]=[order[j],order[i]];}};
    const placed=[];
    const opacityAt=(x,y)=>{
      const distance=Math.sqrt(((x/width-.5)/.26)**2+((y/height-.49)/.36)**2);
      return (.025+.065*clamp((distance-.5)/.85))*(.72+rand()*.48);
    };
    const style=(x,y)=>{
      ctx.globalAlpha=opacityAt(x,y);
      ctx.strokeStyle=rand()<.22?'#bfb6a7':'#acbdc8';ctx.fillStyle=ctx.strokeStyle;
      ctx.lineWidth=1.55;ctx.lineCap='round';ctx.lineJoin='round';ctx.textAlign='left';
    };
    for(let index=0;index<count;index++) {
      if(index%DOODLE_COUNT===0)shuffle();
      const kind=order[index%DOODLE_COUNT];
      const size=(mobile?36:43)+Math.pow(rand(),.8)*(mobile?52:88);
      // Pick spacious random positions, never rows or columns. A small amount
      // of overlap is intentional, like sketches in the margin of a notebook.
      let best=null,bestScore=-Infinity;
      for(let attempt=0;attempt<14;attempt++) {
        const x=rand()*(width+size*.35)-size*.175;
        const y=rand()*(height+size*.35)-size*.175;
        let score=Infinity;
        for(const previous of placed) {
          const distance=Math.hypot(x-previous.x,y-previous.y);
          const spacing=distance/((size+previous.size)*.43);
          score=Math.min(score,spacing*(previous.kind===kind?.46:1));
        }
        if(score>bestScore){best={x,y};bestScore=score;}
      }
      const {x,y}=best;
      const angle=(rand()-.5)*1.25+(rand()<.12?(rand()<.5?-1:1)*.5:0);
      const variant=Math.floor(rand()*10000);
      placed.push({x,y,size,kind});
      ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(size/100,size/100);
      style(x,y);drawDoodle(ctx,kind,variant);ctx.restore();
    }
    // Loose, smaller clusters and short pen marks break up the remaining gaps.
    for(let index=0;index<Math.round(count*.3);index++) {
      const anchor=placed[Math.floor(rand()*placed.length)];
      const angle=rand()*tau;
      const radius=anchor.size*(.55+rand()*.35);
      const x=anchor.x+Math.cos(angle)*radius,y=anchor.y+Math.sin(angle)*radius;
      const size=12+rand()*25;
      ctx.save();ctx.translate(x,y);ctx.rotate(rand()*tau);style(x,y);
      ctx.scale(size/30,size/30);ctx.globalAlpha*=.75;
      ctx.beginPath();
      if(index%4===0) {
        ctx.moveTo(-9,4);ctx.bezierCurveTo(-4,-12,3,13,11,-5);
      } else if(index%4===1) {
        ctx.moveTo(-8,0);ctx.lineTo(8,0);ctx.moveTo(0,-8);ctx.lineTo(0,8);
        ctx.moveTo(-4,-4);ctx.lineTo(4,4);
      } else if(index%4===2) {
        ctx.arc(0,0,5+rand()*5,0,tau*.84);
      } else {
        ctx.moveTo(-12,-5);ctx.lineTo(-8,2);ctx.moveTo(0,-8);ctx.lineTo(0,0);ctx.moveTo(9,-4);ctx.lineTo(6,3);
      }
      ctx.stroke();ctx.restore();
    }
    doodleLayer = layer;
  }

  function resize() {
    if (destroyed) return;
    const box = canvas.getBoundingClientRect();
    const nextWidth = Math.max(1, box.width || window.innerWidth), nextHeight = Math.max(1, box.height || window.innerHeight);
    const nextRatio = clamp(window.devicePixelRatio || 1, 1, 1.8);
    const changed = width !== nextWidth || height !== nextHeight || ratio !== nextRatio || !doodleLayer;
    width = nextWidth;height = nextHeight;ratio = nextRatio;
    const pixelWidth = Math.round(width * ratio), pixelHeight = Math.round(height * ratio);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {canvas.width = pixelWidth;canvas.height = pixelHeight;}
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (changed) buildDoodleLayer();
  }

  function glow(x, y, radius, color, opacity) {
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color);gradient.addColorStop(1, 'rgba(0,0,0,0)');
    context.globalAlpha = opacity;context.fillStyle = gradient;
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  function drawToy(shape, size, color) {
    if (atlas?.complete && atlas.naturalWidth > 0 && atlas.naturalHeight > 0) {
      const sw = atlas.naturalWidth / 2, sh = atlas.naturalHeight / 2;
      const dw = sw >= sh ? size : size * sw / sh, dh = sw >= sh ? size * sh / sw : size;
      context.drawImage(atlas, (shape % 2) * sw, Math.floor(shape / 2) * sh, sw, sh, -dw / 2, -dh / 2, dw, dh);
      return;
    }
    // The optional atlas never makes a slow or failed image a broken animation.
    const gradient = context.createLinearGradient(-size / 2, -size / 2, size / 2, size / 2);
    gradient.addColorStop(0, '#ede4d2');gradient.addColorStop(0.35, color);gradient.addColorStop(1, '#596879');
    context.fillStyle = gradient;context.beginPath();
    context.roundRect(-size / 2, -size * 0.32, size, size * 0.64, size * 0.25);context.fill();
  }

  function drawBurst(time, phase, burst) {
    if (phase === 'idle' || reduceMotion.matches) return;
    const elapsed = time - (Number.isFinite(burst?.at) ? burst.at : 7);
    if (elapsed < 0 || elapsed >= 1.9) return;
    const bx = clamp(Number.isFinite(burst?.x) ? burst.x : 0.5) * width, by = clamp(Number.isFinite(burst?.y) ? burst.y : 0.3) * height;
    const scale = width < 650 ? 0.78 : 1;
    for (const particle of particles) {
      const life = elapsed - particle.delay;if (life < 0) continue;
      const distance = particle.speed * (1 - Math.exp(-life * 1.9)) * scale;
      context.save();context.translate(bx + Math.cos(particle.angle) * distance, by + Math.sin(particle.angle) * distance + life * life * 30 * scale);
      context.rotate(life * particle.spin);context.globalAlpha = clamp(1 - life / 1.8) ** 1.5 * 0.58;
      drawToy(0, particle.size * scale, toyColors[0]);context.restore();
    }
  }

  function drawCannons(time, phase, burst) {
    if (phase === 'idle' || reduceMotion.matches) return;
    const elapsed = time - (Number.isFinite(burst?.at) ? burst.at : 7);
    if (elapsed < 0 || elapsed >= 3.4) return;
    const sizeScale = width < 650 ? 0.77 : 1;
    for (const piece of cannonPieces) {
      const life = elapsed - piece.delay;if (life < 0) continue;
      const inward = piece.side === -1 ? 1 : -1;
      const x = width * (piece.side === -1 ? 0.06 : 0.94) + inward * width * piece.horizontal * life + Math.sin(life * 3.5 + piece.flutter) * 4 * life;
      const y = height * (1.02 - piece.upward * life + 0.5 * piece.gravity * life * life);
      const size = piece.size * sizeScale;
      if (y > height + size * 3 || x < -35 || x > width + 35) continue;
      context.save();context.translate(x, y);context.rotate(life * piece.spin + piece.flutter);
      context.scale(0.48 + Math.abs(Math.cos(life * 3.5 + piece.flutter)) * 0.52, 1);
      context.globalAlpha = clamp(life / 0.09) * clamp((3.4 - elapsed) / 0.85) * 0.84;
      drawToy(piece.shape, size, piece.color);context.restore();
    }
  }

  function render(timeSeconds, phase = 'idle', burst = { x: 0.5, y: 0.3, at: 7 }, ambientTime = timeSeconds) {
    if (destroyed) return;
    const time = Number.isFinite(timeSeconds) ? timeSeconds : 0;
    const motionTime = reduceMotion.matches ? 0 : Number.isFinite(ambientTime) ? ambientTime : time;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);context.clearRect(0, 0, width, height);
    const end = phase === 'end' ? 1 : 0.66;
    glow(width * (0.11 + Math.sin(motionTime * 0.08) * 0.03), height * 0.34,
      width * 0.48, 'rgba(80,145,181,0.35)', end * (0.7 + 0.3 * Math.sin(motionTime * 0.35 + 1)));
    glow(width * 0.91, height * (0.71 + Math.cos(motionTime * 0.11) * 0.03),
      width * 0.4, 'rgba(226,175,91,0.23)', end * (0.75 + 0.25 * Math.sin(motionTime * 0.3 + 3)));
    if (doodleLayer) {
      const driftX = Math.sin(motionTime * 0.065) * 3, driftY = Math.cos(motionTime * 0.055) * 3;
      context.globalAlpha = ['idle', 'celebration', 'end'].includes(phase) ? 1 : 0.78;
      context.drawImage(doodleLayer, driftX, driftY, width, height);
    }
    for (const point of dust) {
      if (point.x > 0.25 && point.x < 0.75 && point.y > 0.18 && point.y < 0.85) continue;
      context.fillStyle = '#a9bdcb';context.globalAlpha = (0.55 + Math.sin(motionTime * point.speed + point.phase) * 0.2) * 0.18;
      context.beginPath();context.arc(point.x * width, point.y * height, point.size, 0, tau);context.fill();
    }
    drawBurst(time, phase, burst);drawCannons(time, phase, burst);context.globalAlpha = 1;
  }

  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
  observer?.observe(canvas);window.addEventListener('resize', resize, { passive: true });resize();
  function destroy() {
    if (destroyed) return;
    destroyed = true;observer?.disconnect();window.removeEventListener('resize', resize);
    context.clearRect(0, 0, width, height);doodleLayer = null;
  }
  return { render, resize, destroy };
}
