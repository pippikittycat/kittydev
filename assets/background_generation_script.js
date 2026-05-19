const canvas = document.getElementById('circle-bg');
const canvasContext = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const background = '#fef7ea';

const colorPalette = [
  [14, 55, 48],  // classic terracotta
  [20, 60, 52],  // warm rust
  [8, 50, 44],  // deep clay
  [25, 48, 50],  // sandy sienna
  [18, 40, 38],  // dark earth
  [30, 55, 56],  // warm ochre-terra
  [10, 45, 42],  // muted brick
];

const circles = [];

const settings = {
  lifeMin: 15000, //4s
  lifeMax: 25000, //10s
  opacityMin: 0.05, //18%
  opacityMax: 0.15, //50%
  radiusMin: 60,
  radiusMax: 100,
  intervalTime: 3500
};

function randomValue(minOrMax, maxValue) {
  if (maxValue === undefined) {
    return Math.random() * minOrMax;
  }
  return minOrMax + Math.random() * maxValue;
}

function spawnCircle() {
  const circleLife = randomValue(settings.lifeMin, settings.lifeMax);
  const peakOpacity = randomValue(settings.opacityMin, settings.opacityMax);
  const color = colorPalette[Math.floor(randomValue(colorPalette.length))];
  circles.push({
    x: randomValue(canvas.width), // 0 through canvas width
    y: randomValue(canvas.height), // 0 through canvas height
    radius: randomValue(settings.radiusMin, settings.radiusMax), // radius min to radius max
    hue: color[0],
    sat: color[1],
    lig: color[2],
    born: performance.now(),
    circleLife,
    peakOpacity,
  });
}

function drawCircle() {
  const now = performance.now();

  canvasContext.fillStyle = background;
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = circles.length - 1; i >= 0; i--) {
  const indivCircle = circles[i];
  const time = Math.min((now - indivCircle.born) / indivCircle.circleLife, 1);
  const scale = Math.sin(time * Math.PI);
  const opacity = indivCircle.peakOpacity;

  canvasContext.beginPath();
  canvasContext.arc(indivCircle.x, indivCircle.y, indivCircle.radius * scale, 0, Math.PI * 2);
  canvasContext.fillStyle = `hsla(${indivCircle.hue}, ${indivCircle.sat}%, ${indivCircle.lig}%, ${opacity})`;
  canvasContext.fill();

  if (time >= 1) circles.splice(i, 1);
  }
  requestAnimationFrame(drawCircle);
}

export function draw() {
setInterval(spawnCircle, settings.intervalTime);
spawnCircle();
spawnCircle();
requestAnimationFrame(drawCircle);
}