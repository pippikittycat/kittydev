const canvas = document.getElementById('canvas-bg');
// FIXED: Prevent getContext from running before elemtn exists in DOM
const canvasContext = canvas ? canvas.getContext('2d') : null;

/*=====================================================
1. SET UP & RESIZING
=====================================================*/

// FIXED: Prevent getContext from running before elemtn exists in DOM
function resizeCanvas() {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvasContext.resetTransform();
  canvasContext.scale(dpr, dpr);
  generateStars(); // Re-seed static star positions on screen resize
  generateNebulae(); // Re-seed ambient cloud layers
}

window.addEventListener('resize', resizeCanvas);

/*=====================================================
2. CONFIGURATION & PALLETES
=====================================================*/
const lightPalette = [
  [14, 55, 48],  // classic terracotta
  [20, 60, 52],  // warm rust
  [8, 50, 44],   // deep clay
  [25, 48, 50],  // sandy sienna
  [18, 40, 38],  // dark earth
  [30, 55, 56],  // warm ochre-terra
  [10, 45, 42],  // muted brick
];

const darkPalette = [
  [260, 48, 80], // pastel lavender
  [265, 38, 68], // soft Sugar plum
  [270, 30, 55], // muted iris
  [260, 100, 80],// electric violet glow
  [250, 15, 85], // off-white pastel star-spark
];

const particles = []; // FIXED: Renamed arrau from circles to particles for better understanding
const nebulae = [];
let activeMeteor = null;

// STATIC STAR TIWNKLES CONFIG (--DARK MODE ONLY--)
const stars = [];
const STAR_COUNT = 600;
const HOVER_RADIUS = 120;
const mouse = { x: -9999, y: -9999 };

const settings = {
  intervalTime: 2000, // Universal setting -- Faster spawn rate for sparkles
  
  light: {
    lifeMin: 15000,
    lifeMax: 25000,
    opacityMin: 0.05,
    opacityMax: 0.15,
    radiusMin: 60,
    radiusMax: 200,
  },
  
  dark: {
    lifeMin: 2000,   // Faster life for sparkles
    lifeMax: 5000,
    opacityMin: 0.65, // Higher opacity so sparkles pop
    opacityMax: 0.95,
    radiusMin: 0.5,   // Smaller radius for crisp stars
    radiusMax: 2,
  }
};

// Standard helper: randomRange(max) OR randomRange(min, max)
function randomRange(min, max) {
  if (max === undefined) return Math.random() * min;
  return min + Math.random() * (max - min);
}

/*=====================================================
3. GENERATION HELPERS
=====================================================*/

// Generates radial ambient cloud pools in dark mode sky
function generateNebulae() {
  nebulae.length = 0;
  for (let i = 0; i < 4; i++) {
    nebulae.push({
      x: randomRange(window.innerWidth),
      y: randomRange(window.innerHeight),
      radius: randomRange(350, 650),
      color: ['270, 50%, 25%', '290, 45%, 20%', '240, 60%, 18%'][i % 3]
    });
  }
}

// DARK MODE ONLY: Render static twinkling starfield
// NEW: 3 star depth using background, midground and foreground stars
function generateStars() {
  stars.length = 0; // Clear array while maintaining reference
  for (let i = 0;  i < STAR_COUNT; i++) {
    const layer = Math.random();
    let size, baseAlpha, color;

    if (layer < 0.6) {
      // 60% background stars
      size = randomRange(0.25, 0.45);
      baseAlpha = randomRange(0.35, 0.55);
      color = '255, 255, 255';
    } else if (layer < 0.9) {
      // 30% midground stars
      size = randomRange(0.5, 0.85);
      baseAlpha = randomRange(0.55, 0.75);
      color = '240, 230, 255';
    } else {
      // 10% foreground stars
      size = randomRange(0.9, 1.3);
      baseAlpha = randomRange(0.75, 0.95);
      color = Math.random() > 0.5 ? '255, 240, 220' : '220, 240, 255';
    }

    stars.push({
      x: randomRange(window.innerWidth),
      y: randomRange(window.innerHeight),
      size,
      baseAlpha,
      color,
      twinkleSpeed: randomRange(0.005, 0.025),
      twinkleOffset: randomRange(Math.PI * 2)
    });
  }
}

// Meteor that randomly generates every so often
function spawnMeteor() {
  activeMeteor = {
    x: randomRange(window.innerWidth * 0.8),
    y: randomRange(window.innerHeight * 0.3),
    length: randomRange(90, 160),
    speed: randomRange(12, 18),
    angle: Math.PI / 4, // 45 degree trajectory
    progress: 0
  };
}

// Track mouse position globally for proximity interactions
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
  mouse.x = -9999;
  mouse.y = -9999;
});

/*=====================================================
4. DRAWING HELPERS
=====================================================*/

function drawSparkle(ctx, x, y, radius) {
  const innerRadius = radius * 0.2;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const r = (i % 2 === 0) ? radius : innerRadius;
    const angle = (i * Math.PI) / 4;
    const px = x + r * Math.cos(angle);
    const py = y + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawBackground(ctx, isDark) {
  const bgGradient = ctx.createRadialGradient(
    window.innerWidth / 2, 0, 10,
    window.innerWidth / 2, 0, Math.max(window.innerWidth, window.innerHeight)
  );
  
  if (isDark) {
    bgGradient.addColorStop(0, '#3a2f49'); 
    bgGradient.addColorStop(1, '#1a131d');
  } else {
    bgGradient.addColorStop(0, '#f3efe7'); 
    bgGradient.addColorStop(1, '#f6dfc2');
  }

  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  if (isDark) {
    nebulae.forEach(n => {
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
      grad.addColorStop(0, `hsla(${n.color}, 0.12)`);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
    });
  }
}

/*=====================================================
5. ISOLATED RENDERS
=====================================================*/

// LIGHT MODE: Warm soft circles
function drawLightParticle(ctx, particle, radius, opacity) {
  // Always use lightPalette, regardless of what colorIndex/palette was active at spawn
  const color = lightPalette[particle.colorIndex % lightPalette.length];
  const [hue, sat, lig] = color;

  // Cap opacity to light mode's maximum setting (0.15) so dark mode opacity never bleeds over
  const safeOpacity = Math.min(opacity, settings.light.opacityMax);

  ctx.save();
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, Math.max(0, radius), 0, Math.PI * 2);
  ctx.fillStyle = `hsla(${hue}, ${sat}%, ${lig}%, ${safeOpacity})`;
  ctx.fill();
  ctx.restore();
}

// DARK MODE: Cool purple/charcoal sparkles
function drawDarkParticle(ctx, particle, radius, opacity) {
  const color = darkPalette[particle.colorIndex % darkPalette.length];
  const [hue, sat, lig] = color;

  ctx.save(); // 1. Save pristine canvas state
  ctx.fillStyle = `hsla(${hue}, ${sat}%, ${lig}%, ${opacity})`;
  ctx.shadowColor = `hsla(${hue}, ${sat}%, 90%, 0.8)`; // Very bright core color
  ctx.shadowBlur = 8;                                 // Soft intense halo
  // drawSparkle already calls beginPath() internally!
  drawSparkle(ctx, particle.x, particle.y, Math.max(0, radius * 0.2));
  ctx.fill();
  ctx.restore(); // 3. Restore canvas state
}

function drawStarfield(ctx, now) {
  for(let i = 0; i < stars.length; i++) {
    const star = stars[i];

    //Natural twinkle wave using sine
    const twinkle = Math.sin(now * 0.001 * (star.twinkleSpeed * 100) + star.twinkleOffset) * 0.2;
    let alpha = Math.max(0.65, star.baseAlpha + twinkle);
    
    // Distance calculation relative to cursor position
    const dx = mouse.x - star.x;
    const dy = mouse.y - star.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let renderSize = star.size;

    // Mouse proximity brightness & scale boost
    if (dist < HOVER_RADIUS) {
      const proximityRatio = 1 - (dist / HOVER_RADIUS);
      alpha = Math.min(1.0, alpha + proximityRatio * 0.15);
      renderSize = star.size * (1 + proximityRatio * 0.35); // Proportional scale boost
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, renderSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${star.color}, ${alpha})`;
    ctx.fill();

    // Soft core halo for stars directly under mouse cursor
    if (dist < HOVER_RADIUS * 0.4) {
      const haloRatio = 1 - (dist / (HOVER_RADIUS * 0.4));
      ctx.beginPath();
      ctx.arc(star.x, star.y, renderSize * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230, 215, 255, ${haloRatio * 0.15})`;
      ctx.fill();
    }
  }
}

function drawMeteors(ctx) {
  if (!activeMeteor && Math.random() < 0.0025) {
    spawnMeteor();
  }

  if (activeMeteor) {
    activeMeteor.progress += activeMeteor.speed;
    const endX = activeMeteor.x + Math.cos(activeMeteor.angle) * activeMeteor.progress;
    const endY = activeMeteor.y + Math.sin(activeMeteor.angle) * activeMeteor.progress;
    const startX = endX - Math.cos(activeMeteor.angle) * activeMeteor.length;
    const startY = endY - Math.sin(activeMeteor.angle) * activeMeteor.length;

    const grad = ctx.createLinearGradient(startX, startY, endX, endY);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.85)');

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();

    if (activeMeteor.progress > window.innerWidth * 0.7) {
      activeMeteor = null;
    }
  }
}

/*=====================================================
5. CORE ENGINE & ANIMATION LOOP
=====================================================*/

// FIXED: Renamed function spawnCircle to spawnParticle
function spawnParticle(isInitial = false) {
  // Check active theme
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const activeSettings = isDark ? settings.dark : settings.light;

  const particleLife = randomRange(activeSettings.lifeMin, activeSettings.lifeMax);
  const peakOpacity = randomRange(activeSettings.opacityMin, activeSettings.opacityMax);
  const radius = randomRange(activeSettings.radiusMin, activeSettings.radiusMax);
  
  // Pick from the appropriate palette
  const activePalette = isDark ? darkPalette : lightPalette;
  const colorIndex = Math.floor(randomRange(activePalette.length));
  
  const ageOffset = isInitial ? randomRange(0, particleLife * 0.5) : 0;

  particles.push({
    x: randomRange(window.innerWidth), 
    y: randomRange(window.innerHeight), 
    radius,
    colorIndex,
    born: performance.now() - ageOffset,
    particleLife, // Store particle's individual life span
    peakOpacity,
  });
}

// FIXED: Changes from drawCircle to animateBackground
function animateBackground() {
  const now = performance.now();
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  drawBackground(canvasContext, isDark);

  // 1. Render starfield ONLY during darkmode
  if (isDark) {
    drawStarfield(canvasContext, now);
    drawMeteors(canvasContext);
  }

  // 2. Render backgorund floaters (circles in lightmode, stars in dark mode)
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    
    // Uses the particle's custom life span calculated at spawn
    const time = Math.min((now - particle.born) / particle.particleLife, 1);
    
    const lifeProgress = Math.sin(time * Math.PI);
    const currentRadius = particle.radius * lifeProgress;
    const currentOpacity = particle.peakOpacity * lifeProgress;

    if (isDark) {
      drawDarkParticle(canvasContext, particle, currentRadius, currentOpacity);
    } else {
      drawLightParticle(canvasContext, particle, currentRadius, currentOpacity);
    }

    if (time >= 1) particles.splice(i, 1);
  }

  requestAnimationFrame(animateBackground);
}

export function initCanvasAnimation() {
  if (!canvas || !canvasContext) return;

  resizeCanvas(); // Ensure canvas matches viewport upon explicit initialization

  const initialParticleCount = 15;
  for (let i = 0; i < initialParticleCount; i++) {
    spawnParticle(true);
  }

  setInterval(spawnParticle, settings.intervalTime);
  requestAnimationFrame(animateBackground);
}