const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("solarCanvas") });
renderer.setSize(window.innerWidth, window.innerHeight);

// Sun
const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFDB813 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Lighting
const light = new THREE.PointLight(0xffffff, 1.5, 300);
light.position.set(0, 0, 0);
scene.add(light);

// Planets data
const planetsData = [
  { name: "Mercury", radius: 0.5, distance: 6, speed: 0.04, color: 0xaaaaaa },
  { name: "Venus", radius: 0.6, distance: 8, speed: 0.02, color: 0xffcc66 },
  { name: "Earth", radius: 0.7, distance: 10, speed: 0.01, color: 0x2233ff },
  { name: "Mars", radius: 0.6, distance: 12, speed: 0.008, color: 0xff3300 },
  { name: "Jupiter", radius: 1.2, distance: 16, speed: 0.005, color: 0xff9966 },
  { name: "Saturn", radius: 1.1, distance: 20, speed: 0.003, color: 0xffcc99 },
  { name: "Uranus", radius: 0.9, distance: 24, speed: 0.002, color: 0x66ffff },
  { name: "Neptune", radius: 0.9, distance: 28, speed: 0.001, color: 0x3333ff },
];

const planets = [];

planetsData.forEach(data => {
  const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: data.color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = { angle: Math.random() * Math.PI * 2, speed: data.speed, distance: data.distance };
  scene.add(mesh);
  planets.push(mesh);

  // Speed controls
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = 0.001;
  slider.max = 0.1;
  slider.step = 0.001;
  slider.value = data.speed;
  slider.oninput = e => mesh.userData.speed = parseFloat(e.target.value);

  const label = document.createElement("label");
  label.textContent = `${data.name}: `;
  label.appendChild(slider);

  document.getElementById("speedSliders").appendChild(label);
  document.getElementById("speedSliders").appendChild(document.createElement("br"));
});

// Camera
camera.position.z = 50;

// Animation Loop
let isPaused = false;
function animate() {
  requestAnimationFrame(animate);
  if (!isPaused) {
    planets.forEach(p => {
      p.userData.angle += p.userData.speed;
      p.position.x = Math.cos(p.userData.angle) * p.userData.distance;
      p.position.z = Math.sin(p.userData.angle) * p.userData.distance;
    });
  }
  renderer.render(scene, camera);
}
animate();

// Pause / Resume
document.getElementById("pauseBtn").onclick = () => isPaused = true;
document.getElementById("resumeBtn").onclick = () => isPaused = false;

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
