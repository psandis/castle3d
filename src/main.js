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

// Existing textures
const stoneTexture = textureLoader.load('textures/bricks.jpg'); // Stone wall
stoneTexture.wrapS = stoneTexture.wrapT = THREE.RepeatWrapping;
stoneTexture.repeat.set(2, 2);

const roofTexture = textureLoader.load('textures/roof.jpg'); // Roof tiles
roofTexture.wrapS = roofTexture.wrapT = THREE.RepeatWrapping;
roofTexture.repeat.set(4, 4);

const groundTexture = textureLoader.load('textures/grass.jpg'); // Grass
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(10, 10);

// New textures (with fallback if files don't exist)
let woodTexture, metalTexture, cobblestoneTexture, darkStoneTexture;
let woodTextureLoaded = false, metalTextureLoaded = false, cobblestoneTextureLoaded = false, darkStoneTextureLoaded = false;

// Wood texture for gate/doors
woodTexture = textureLoader.load(
    'textures/wood.jpg',
    () => { woodTextureLoaded = true; },
    undefined,
    () => { console.log('Wood texture not found, using fallback'); woodTextureLoaded = false; }
);
woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
woodTexture.repeat.set(2, 2);

// Metal texture for decorations
metalTexture = textureLoader.load(
    'textures/metal.jpg',
    () => { metalTextureLoaded = true; },
    undefined,
    () => { console.log('Metal texture not found, using fallback'); metalTextureLoaded = false; }
);
metalTexture.wrapS = metalTexture.wrapT = THREE.RepeatWrapping;
metalTexture.repeat.set(1, 1);

// Cobblestone texture for paths
cobblestoneTexture = textureLoader.load(
    'textures/cobblestone.jpg',
    () => { cobblestoneTextureLoaded = true; },
    undefined,
    () => { console.log('Cobblestone texture not found, using fallback'); cobblestoneTextureLoaded = false; }
);
cobblestoneTexture.wrapS = cobblestoneTexture.wrapT = THREE.RepeatWrapping;
cobblestoneTexture.repeat.set(5, 5);

// Dark stone texture for variety
darkStoneTexture = textureLoader.load(
    'textures/dark_stone.jpg',
    () => { darkStoneTextureLoaded = true; },
    undefined,
    () => { console.log('Dark stone texture not found, using fallback'); darkStoneTextureLoaded = false; }
);
darkStoneTexture.wrapS = darkStoneTexture.wrapT = THREE.RepeatWrapping;
darkStoneTexture.repeat.set(2, 2);

// Materials
const stoneMaterial = new THREE.MeshStandardMaterial({ map: stoneTexture, roughness: 0.8, metalness: 0.2 });
const roofMaterial = new THREE.MeshStandardMaterial({ map: roofTexture, roughness: 0.7, metalness: 0.1 });
const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture, roughness: 0.9 });

// New materials (will use textures if loaded, otherwise fallback colors)
const woodMaterial = new THREE.MeshStandardMaterial({ map: woodTexture, roughness: 0.9, metalness: 0.0 });
const metalMaterial = new THREE.MeshStandardMaterial({ map: metalTexture, roughness: 0.3, metalness: 0.8 });
const cobblestoneMaterial = new THREE.MeshStandardMaterial({ map: cobblestoneTexture, roughness: 0.8, metalness: 0.1 });
const darkStoneMaterial = new THREE.MeshStandardMaterial({ map: darkStoneTexture, roughness: 0.8, metalness: 0.2 });

// Update materials when textures fail to load
setTimeout(() => {
    if (!woodTextureLoaded) {
        woodMaterial.map = null;
        woodMaterial.color.setHex(0x8B4513);
    }
    if (!metalTextureLoaded) {
        metalMaterial.map = null;
        metalMaterial.color.setHex(0x666666);
    }
    if (!cobblestoneTextureLoaded) {
        cobblestoneMaterial.map = null;
        cobblestoneMaterial.color.setHex(0x555555);
    }
    if (!darkStoneTextureLoaded) {
        darkStoneMaterial.map = null;
        darkStoneMaterial.color.setHex(0x444444);
    }
}, 1000);

// Build the Castle
export const castle = new THREE.Group();
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = false; // Don't receive shadows on the ground
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
// Front wall with archway - using two separate wall segments
const wallWidth = 20;
const wallHeight = 5;
const wallThickness = 0.5;
const entryWidth = 5;

// Left wall segment
const leftWallGeometry = new THREE.BoxGeometry((wallWidth - entryWidth) / 2, wallHeight, wallThickness);
const leftWall = new THREE.Mesh(leftWallGeometry, stoneMaterial);
leftWall.position.set(-wallWidth / 4 - entryWidth / 4, wallHeight / 2, 10 - wallThickness / 2);
castle.add(leftWall);

// Right wall segment
const rightWallGeometry = new THREE.BoxGeometry((wallWidth - entryWidth) / 2, wallHeight, wallThickness);
const rightWall = new THREE.Mesh(rightWallGeometry, stoneMaterial);
rightWall.position.set(wallWidth / 4 + entryWidth / 4, wallHeight / 2, 10 - wallThickness / 2);
castle.add(rightWall);

// Top arch piece
const archTopHeight = wallHeight - 3.5;
const archTopGeometry = new THREE.BoxGeometry(entryWidth, archTopHeight, wallThickness);
const archTop = new THREE.Mesh(archTopGeometry, stoneMaterial);
archTop.position.set(0, wallHeight - archTopHeight / 2, 10 - wallThickness / 2);
castle.add(archTop);

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

// Keep with original stone material
const keepGeometry = new THREE.BoxGeometry(10, 10, 10);
const keep = new THREE.Mesh(keepGeometry, stoneMaterial);
keep.position.set(0, 5, 0);
keep.castShadow = false; // Don't cast shadow to avoid black rectangle on ground
castle.add(keep);

const keepRoofGeometry = new THREE.BoxGeometry(11, 1, 11);
const keepRoof = new THREE.Mesh(keepRoofGeometry, roofMaterial);
keepRoof.position.set(0, 10.5, 0);
castle.add(keepRoof);

// Windows with metal frames
const windowGeometry = new THREE.PlaneGeometry(1, 1.5);
const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    side: THREE.DoubleSide
});
const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
window1.position.set(0, 7, 5.1);
castle.add(window1);

const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
window2.position.set(0, 7, -5.1);
castle.add(window2);



// Water moat around the castle walls with rounded corners
const moatWidth = 3; // Width of the moat
const castleSize = 20; // Castle is 20x20
const moatOuterSize = castleSize + moatWidth * 2;
const cornerRadius = 2; // Radius for rounded corners

// Create moat using a shape with rounded corners (outer rounded rectangle minus inner rounded rectangle)
const moatShape = new THREE.Shape();
const halfOuter = moatOuterSize / 2;
const halfInner = castleSize / 2;

// Outer rounded rectangle
moatShape.moveTo(-halfOuter + cornerRadius, -halfOuter);
moatShape.lineTo(halfOuter - cornerRadius, -halfOuter);
moatShape.quadraticCurveTo(halfOuter, -halfOuter, halfOuter, -halfOuter + cornerRadius);
moatShape.lineTo(halfOuter, halfOuter - cornerRadius);
moatShape.quadraticCurveTo(halfOuter, halfOuter, halfOuter - cornerRadius, halfOuter);
moatShape.lineTo(-halfOuter + cornerRadius, halfOuter);
moatShape.quadraticCurveTo(-halfOuter, halfOuter, -halfOuter, halfOuter - cornerRadius);
moatShape.lineTo(-halfOuter, -halfOuter + cornerRadius);
moatShape.quadraticCurveTo(-halfOuter, -halfOuter, -halfOuter + cornerRadius, -halfOuter);

// Inner rounded rectangle (hole)
const hole = new THREE.Path();
hole.moveTo(-halfInner + cornerRadius, -halfInner);
hole.lineTo(halfInner - cornerRadius, -halfInner);
hole.quadraticCurveTo(halfInner, -halfInner, halfInner, -halfInner + cornerRadius);
hole.lineTo(halfInner, halfInner - cornerRadius);
hole.quadraticCurveTo(halfInner, halfInner, halfInner - cornerRadius, halfInner);
hole.lineTo(-halfInner + cornerRadius, halfInner);
hole.quadraticCurveTo(-halfInner, halfInner, -halfInner, halfInner - cornerRadius);
hole.lineTo(-halfInner, -halfInner + cornerRadius);
hole.quadraticCurveTo(-halfInner, -halfInner, -halfInner + cornerRadius, -halfInner);
moatShape.holes.push(hole);

const moatGeometry = new THREE.ShapeGeometry(moatShape);
const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x006994,
    roughness: 0.1,
    metalness: 0.3,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
});
const water = new THREE.Mesh(moatGeometry, waterMaterial);
water.rotation.x = -Math.PI / 2;
water.position.y = 0.01;
scene.add(water);

scene.add(castle);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(20, 30, 20);
directionalLight.castShadow = true;
scene.add(directionalLight);
renderer.shadowMap.enabled = true;
castle.traverse(obj => {
    if (obj.isMesh) {
        obj.castShadow = obj.receiveShadow = true;
        // Don't cast shadow from keep or receive on ground
        if (obj === keep) obj.castShadow = false;
        if (obj === ground) obj.receiveShadow = false;
    }
});

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