import { moveCastle } from './controls.js'; // Import movement function

// Scene, Camera, Renderer
export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 10;
controls.maxDistance = 50;

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const stoneTexture = textureLoader.load('textures/bricks.jpg'); // Stone wall
stoneTexture.wrapS = stoneTexture.wrapT = THREE.RepeatWrapping;
stoneTexture.repeat.set(2, 2);

const roofTexture = textureLoader.load('textures/roof.jpg'); // Roof tiles
roofTexture.wrapS = roofTexture.wrapT = THREE.RepeatWrapping;
roofTexture.repeat.set(4, 4);

const groundTexture = textureLoader.load('textures/grass.jpg'); // Grass
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(10, 10);

// Materials
const stoneMaterial = new THREE.MeshStandardMaterial({ map: stoneTexture, roughness: 0.8, metalness: 0.2 });
const roofMaterial = new THREE.MeshStandardMaterial({ map: roofTexture, roughness: 0.7, metalness: 0.1 });
const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture, roughness: 0.9 });

// Build the Castle
export const castle = new THREE.Group();
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
castle.add(ground);

const wallGeometry = new THREE.BoxGeometry(20, 5, 0.5);
const battlementGeometry = new THREE.BoxGeometry(1, 1, 0.5);
for (let i = -9; i <= 9; i += 2) {
    const battlement = new THREE.Mesh(battlementGeometry, stoneMaterial);
    battlement.position.set(i, 5, 10);
    castle.add(battlement);
    const battlement2 = new THREE.Mesh(battlementGeometry, stoneMaterial);
    battlement2.position.set(i, 5, -10);
    castle.add(battlement2);
}
const wall1 = new THREE.Mesh(wallGeometry, stoneMaterial);
wall1.position.set(0, 2.5, 10);
castle.add(wall1);

const wall2 = new THREE.Mesh(wallGeometry, stoneMaterial);
wall2.position.set(0, 2.5, -10);
castle.add(wall2);

const wall3 = new THREE.Mesh(wallGeometry, stoneMaterial);
wall3.rotation.y = Math.PI / 2;
wall3.position.set(10, 2.5, 0);
castle.add(wall3);

const wall4 = new THREE.Mesh(wallGeometry, stoneMaterial);
wall4.rotation.y = Math.PI / 2;
wall4.position.set(-10, 2.5, 0);
castle.add(wall4);

const gateGeometry = new THREE.BoxGeometry(4, 3, 0.6);
const gate = new THREE.Mesh(gateGeometry, stoneMaterial);
gate.position.set(0, 1.5, 10.1);
castle.add(gate);

const towerGeometry = new THREE.CylinderGeometry(2, 2, 12, 32);
const tower1 = new THREE.Mesh(towerGeometry, stoneMaterial);
tower1.position.set(10, 6, 10);
castle.add(tower1);

const tower2 = new THREE.Mesh(towerGeometry, stoneMaterial);
tower2.position.set(-10, 6, 10);
castle.add(tower2);

const tower3 = new THREE.Mesh(towerGeometry, stoneMaterial);
tower3.position.set(10, 6, -10);
castle.add(tower3);

const tower4 = new THREE.Mesh(towerGeometry, stoneMaterial);
tower4.position.set(-10, 6, -10);
castle.add(tower4);

const roofGeometry = new THREE.ConeGeometry(2.5, 4, 32);
const roof1 = new THREE.Mesh(roofGeometry, roofMaterial);
roof1.position.set(10, 10, 10);
castle.add(roof1);

const roof2 = new THREE.Mesh(roofGeometry, roofMaterial);
roof2.position.set(-10, 10, 10);
castle.add(roof2);

const roof3 = new THREE.Mesh(roofGeometry, roofMaterial);
roof3.position.set(10, 10, -10);
castle.add(roof3);

const roof4 = new THREE.Mesh(roofGeometry, roofMaterial);
roof4.position.set(-10, 10, -10);
castle.add(roof4);

const keepGeometry = new THREE.BoxGeometry(10, 10, 10);
const keep = new THREE.Mesh(keepGeometry, stoneMaterial);
keep.position.set(0, 5, 0);
castle.add(keep);

const keepRoofGeometry = new THREE.BoxGeometry(11, 1, 11);
const keepRoof = new THREE.Mesh(keepRoofGeometry, roofMaterial);
keepRoof.position.set(0, 10.5, 0);
castle.add(keepRoof);

const windowGeometry = new THREE.PlaneGeometry(1, 1.5);
const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
window1.position.set(0, 7, 5.1);
castle.add(window1);

scene.add(castle);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(20, 30, 20);
directionalLight.castShadow = true;
scene.add(directionalLight);
renderer.shadowMap.enabled = true;
castle.traverse(obj => { if (obj.isMesh) obj.castShadow = obj.receiveShadow = true; });

// Camera Position
camera.position.set(20, 15, 20);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});