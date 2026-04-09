import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

const BASE = import.meta.env.BASE_URL;

// Scene, Camera, Renderer
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Performance monitor - top right, custom styled
const perfDiv = document.createElement('div');
perfDiv.id = 'perf-monitor';
perfDiv.style.cssText = 'position:absolute;top:12px;right:12px;background-color:rgba(30,18,8,0.85);color:#d4a843;font-family:monospace;font-size:11px;padding:8px 12px;border-radius:4px;border:1px solid #8b6914;pointer-events:none;line-height:1.6;';
document.body.appendChild(perfDiv);

let perfFrames = 0;
let perfLastTime = performance.now();
let perfFps = 0;

function updatePerfMonitor() {
    perfFrames++;
    const now = performance.now();
    if (now - perfLastTime >= 1000) {
        perfFps = Math.round(perfFrames * 1000 / (now - perfLastTime));
        perfFrames = 0;
        perfLastTime = now;
    }
    const info = renderer.info;
    const mem = performance.memory ? (performance.memory.usedJSHeapSize / 1048576).toFixed(1) : '--';
    perfDiv.innerHTML = `FPS: ${perfFps}<br>Draw: ${info.render.calls}<br>Tri: ${(info.render.triangles / 1000).toFixed(1)}k<br>Mem: ${mem}MB`;
    camDiv.innerHTML = `X: ${camera.position.x.toFixed(1)} Y: ${camera.position.y.toFixed(1)} Z: ${camera.position.z.toFixed(1)}<br>Rot: ${(camera.rotation.y * 180 / Math.PI).toFixed(0)}°`;
}

// Camera coordinates - bottom right
const camDiv = document.createElement('div');
camDiv.style.cssText = 'position:absolute;bottom:12px;right:12px;background-color:rgba(30,18,8,0.85);color:#d4a843;font-family:monospace;font-size:11px;padding:8px 12px;border-radius:4px;border:1px solid #8b6914;pointer-events:none;line-height:1.6;';
document.body.appendChild(camDiv);

// Toggle stats with P key
let statsVisible = true;

export function toggleStatsDisplay() {
    statsVisible = !statsVisible;
    perfDiv.style.display = statsVisible ? 'block' : 'none';
    camDiv.style.display = statsVisible ? 'block' : 'none';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'p' || e.key === 'P') toggleStatsDisplay();
});

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 10;
controls.maxDistance = 80;
controls.target.set(6, 3, 22);

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// Existing textures
const stoneTexture = textureLoader.load(BASE + 'textures/bricks.jpg'); // Stone wall
stoneTexture.wrapS = stoneTexture.wrapT = THREE.RepeatWrapping;
stoneTexture.repeat.set(2, 2);

const roofTexture = textureLoader.load(BASE + 'textures/roof.jpg'); // Roof tiles
roofTexture.wrapS = roofTexture.wrapT = THREE.RepeatWrapping;
roofTexture.repeat.set(4, 4);

const groundTexture = textureLoader.load(BASE + 'textures/grass.jpg'); // Grass
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
// Large flat ground with fog to hide edges
const groundGeometry = new THREE.PlaneGeometry(300, 300);
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = false;
castle.add(ground);

// Fog blends ground into sky evenly on all sides
scene.fog = new THREE.Fog(0x87CEEB, 60, 140);

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

// Drawbridge - positioned at the arch opening
const drawbridgeWidth = entryWidth - 0.2;
const drawbridgeLength = 5; // Slightly smaller height
const drawbridgeThickness = 0.25; // Slightly thinner

// Create pivot group at the bottom of the archway opening (outside the wall)
export const drawbridgePivot = new THREE.Group();
// Position slightly outside the front face of the wall, ground level, centered in arch opening
// When raised, drawbridge will touch the wall from outside
drawbridgePivot.position.set(0, 0, 10 + 0.1);
castle.add(drawbridgePivot);

// Create drawbridge geometry - pivot at the bottom edge
const drawbridgeGeometry = new THREE.BoxGeometry(drawbridgeWidth, drawbridgeThickness, drawbridgeLength);
// Offset geometry so it rotates from the bottom edge (at the pivot point)
drawbridgeGeometry.translate(0, 0, drawbridgeLength / 2);

const drawbridge = new THREE.Mesh(drawbridgeGeometry, stoneMaterial);
// Start vertical (blocking the arch opening)
drawbridge.rotation.x = -Math.PI / 2;
drawbridge.castShadow = true;
drawbridge.receiveShadow = true;
drawbridgePivot.add(drawbridge);

// Drawbridge state - rotation is relative to the mesh's initial -PI/2 rotation
const drawbridgeRaisedAngle = 0; // Vertical (blocking entrance) - mesh is already rotated -PI/2, so pivot at 0 = vertical
const drawbridgeLoweredAngle = Math.PI / 2; // Horizontal (bridge lowered outward) - pivot rotates +PI/2, mesh becomes horizontal
let drawbridgeOpen = false;

export function toggleDrawbridge() {
    drawbridgeOpen = !drawbridgeOpen;
}

// Drawbridge chains - connect from top of wall to far end of drawbridge
const chainRadius = 0.06;
const chainSegments = 8;

// Chain anchor points on the wall (above the archway)
const chainAnchorHeight = wallHeight + 0.5;
const chainAnchorZ = 10 - wallThickness / 2;
const chainOffsetX = drawbridgeWidth / 2 - 0.3; // Position chains near the edges

// Create attachment points on the drawbridge (at the far end)
const leftChainAttach = new THREE.Object3D();
leftChainAttach.position.set(-chainOffsetX, 0, drawbridgeLength);
drawbridge.add(leftChainAttach);

const rightChainAttach = new THREE.Object3D();
rightChainAttach.position.set(chainOffsetX, 0, drawbridgeLength);
drawbridge.add(rightChainAttach);

// Create chain meshes
const chainGeometry = new THREE.CylinderGeometry(chainRadius, chainRadius, 1, chainSegments);
const leftChain = new THREE.Mesh(chainGeometry, metalMaterial);
const rightChain = new THREE.Mesh(chainGeometry, metalMaterial);
leftChain.castShadow = true;
rightChain.castShadow = true;
castle.add(leftChain);
castle.add(rightChain);

// Store chain data for animation
export const drawbridgeChains = [
    {
        mesh: leftChain,
        anchor: new THREE.Vector3(-chainOffsetX, chainAnchorHeight, chainAnchorZ),
        attachObject: leftChainAttach
    },
    {
        mesh: rightChain,
        anchor: new THREE.Vector3(chainOffsetX, chainAnchorHeight, chainAnchorZ),
        attachObject: rightChainAttach
    }
];

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

// Tower battlements - add crenellations around the top of each tower
const towerBattlementGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.4);
const towerRadius = 2;
const towerTop = 12;
const battlementsPerTower = 8;
const towerPositions = [
    { x: 10, z: 10 },   // tower1
    { x: -10, z: 10 },  // tower2
    { x: 10, z: -10 },  // tower3
    { x: -10, z: -10 }  // tower4
];

towerPositions.forEach(towerPos => {
    for (let i = 0; i < battlementsPerTower; i++) {
        const angle = (i / battlementsPerTower) * Math.PI * 2;
        const battlement = new THREE.Mesh(towerBattlementGeometry, stoneMaterial);

        // Position battlement on the rim of the tower
        const x = towerPos.x + Math.cos(angle) * towerRadius;
        const z = towerPos.z + Math.sin(angle) * towerRadius;
        battlement.position.set(x, towerTop + 0.4, z);

        // Rotate battlement to face outward
        battlement.rotation.y = angle;

        castle.add(battlement);
    }
});


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

// Flags on top of each tower
// Tower height: y=6, height=12, so top at y=12
// Roof: y=10, cone height=4, so top of roof at y=12
const flagPoleHeight = 2.5;
const flagPoleGeometry = new THREE.CylinderGeometry(0.08, 0.08, flagPoleHeight, 8);
const flagPoleMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5 });
const flagGeometry = new THREE.PlaneGeometry(1.2, 0.8);
const flagMaterial = new THREE.MeshStandardMaterial({
    color: 0xcc0000, // Red flag
    side: THREE.DoubleSide,
    roughness: 0.7
});

towerPositions.forEach(towerPos => {
    // Flag pole - starts at top of tower roof (y=12), extends upward
    const flagPole = new THREE.Mesh(flagPoleGeometry, flagPoleMaterial);
    flagPole.position.set(towerPos.x, 12 + flagPoleHeight / 2, towerPos.z); // Base at roof top, center at midpoint
    castle.add(flagPole);

    // Flag - attached directly to top of pole, calculate direction to face outward from center
    const flag = new THREE.Mesh(flagGeometry.clone(), flagMaterial); // Clone geometry so we can modify it
    // Calculate angle to face outward from castle center
    const angle = Math.atan2(towerPos.x, towerPos.z);
    const poleTopY = 12 + flagPoleHeight; // Top of the pole
    // Position flag directly at top of pole (no offset)
    flag.position.set(towerPos.x, poleTopY, towerPos.z);
    flag.rotation.y = angle; // Face outward from center
    // Translate flag geometry so it extends from the pole (flag attaches at its left edge to pole)
    flag.geometry.translate(0.6, 0, 0); // Move flag geometry to extend from pole center
    castle.add(flag);
});


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

// Center tower on top of the keep
const centerTowerGeometry = new THREE.CylinderGeometry(1.5, 1.5, 8, 32);
const centerTower = new THREE.Mesh(centerTowerGeometry, stoneMaterial);
centerTower.position.set(0, 15, 0); // On top of the keep roof (10.5 + 8/2)
castle.add(centerTower);

const centerRoofGeometry = new THREE.ConeGeometry(2, 3, 32);
const centerRoof = new THREE.Mesh(centerRoofGeometry, roofMaterial);
centerRoof.position.set(0, 20.5, 0);
castle.add(centerRoof);

// Center tower battlements
for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const battlement = new THREE.Mesh(towerBattlementGeometry, stoneMaterial);
    battlement.position.set(
        Math.cos(angle) * 1.5,
        19 + 0.4,
        Math.sin(angle) * 1.5
    );
    battlement.rotation.y = angle;
    castle.add(battlement);
}

// Flag on center tower
const centerPole = new THREE.Mesh(flagPoleGeometry, flagPoleMaterial);
centerPole.position.set(0, 20.5 + flagPoleHeight / 2, 0);
castle.add(centerPole);
const centerFlag = new THREE.Mesh(flagGeometry.clone(), flagMaterial);
centerFlag.position.set(0, 20.5 + flagPoleHeight, 0);
centerFlag.geometry.translate(0.6, 0, 0);
castle.add(centerFlag);

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
camera.position.set(40, 35, 60);
controls.update();

// Models
const mixers = [];
const gltfLoader = new GLTFLoader();

const fbxLoader = new FBXLoader();

// Character system - each character has a model, animation, and motion path
const characters = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const pathPosition = new THREE.Vector3();
const pathLookAhead = new THREE.Vector3();
const routeTargetPosition = new THREE.Vector3();
const KNIGHT_FACING_OFFSET = 0;
const KNIGHT_WALK_REFERENCE_SPEED = 4;
const KNIGHT_TURN_SPEED = 6;

function scaleAndGround(model, targetHeight) {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    model.scale.setScalar(targetHeight / size.y);
    const scaledBox = new THREE.Box3().setFromObject(model);
    return -scaledBox.min.y;
}

function buildRoutePoints(start, waypoints, y) {
    return [start, ...waypoints].map(point => new THREE.Vector3(point.x, y, point.z));
}

function buildRouteCurve(points) {
    return new THREE.CatmullRomCurve3(points, false, 'centripetal');
}

function normalizeAngle(angle) {
    return Math.atan2(Math.sin(angle), Math.cos(angle));
}

function syncCharacterToRoute(char) {
    if (char.routeMode === 'segments') {
        const targetPoint = char.routePoints[Math.min(char.routeIndex + 1, char.routePoints.length - 1)];
        char.model.position.copy(char.routePoints[char.routeIndex]);
        const dx = targetPoint.x - char.model.position.x;
        const dz = targetPoint.z - char.model.position.z;

        if (dx !== 0 || dz !== 0) {
            char.model.rotation.y = Math.atan2(dx, dz) + char.facingOffset;
        }
        return;
    }

    char.routeCurve.getPointAt(char.routeProgress, pathPosition);
    char.model.position.copy(pathPosition);

    const lookAheadT = Math.min(char.routeProgress + 0.0025, 1);
    char.routeCurve.getPointAt(lookAheadT, pathLookAhead);
    const dx = pathLookAhead.x - pathPosition.x;
    const dz = pathLookAhead.z - pathPosition.z;

    if (dx !== 0 || dz !== 0) {
        char.model.rotation.y = Math.atan2(dx, dz) + char.facingOffset;
    }
}

function createCharacter(model, start, waypoints, speed, groundY) {
    const routePoints = buildRoutePoints(start, waypoints, groundY);
    const routeCurve = buildRouteCurve(routePoints);
    const routeLength = routeCurve.getLength();
    const char = {
        model,
        routePoints,
        routeCurve,
        routeLength,
        speed,
        groundY,
        routeProgress: 0,
        routeIndex: 0,
        moving: false,
        walkAction: null,
        mixer: null,
        facingOffset: 0,
        routeMode: 'curve'
    };

    syncCharacterToRoute(char);
    return char;
}

// Spawn a knight - loads directly, no cloning
function spawnKnight(id, config, path, speed = 4, group = 'north') {
    fbxLoader.load(BASE + 'textures/knights/knight-walk.fbx', (knight) => {
        // Center the model on its local origin
        const box = new THREE.Box3().setFromObject(knight);
        const center = box.getCenter(new THREE.Vector3());
        knight.position.set(-center.x, -box.min.y, -center.z);

        // Wrap in a group so position/rotation applies to the group, not the offset model
        const wrapper = new THREE.Group();
        wrapper.add(knight);

        const wrapperBox = new THREE.Box3().setFromObject(wrapper);
        const size = wrapperBox.getSize(new THREE.Vector3());
        wrapper.scale.setScalar(3 / size.y);
        const groundY = 0;
        const mixer = new THREE.AnimationMixer(knight);
        mixers.push(mixer);

        const char = createCharacter(wrapper, config, path, speed, groundY);
        char.mixer = mixer;
        char.facingOffset = KNIGHT_FACING_OFFSET;
        char.routeMode = 'segments';
        char.group = group;
        scene.add(wrapper);

        if (knight.animations.length > 0) {
            const clip = knight.animations[0].clone();
            clip.tracks = clip.tracks.filter(t => !t.name.includes('.position'));
            const action = mixer.clipAction(clip);
            action.setLoop(THREE.LoopRepeat);
            action.timeScale = char.speed / KNIGHT_WALK_REFERENCE_SPEED;
            action.play();
            action.paused = !char.moving;
            action.time = 0;
            char.walkAction = action;
        }

        console.log(`Knight ${id} [${group}] pos(${knight.position.x.toFixed(1)}, ${knight.position.y.toFixed(1)}, ${knight.position.z.toFixed(1)}) → waypoints:`, path.map(p => `(${p.x},${p.z})`).join(' → '));
        characters.push(char);
        knightGroups[group].push(char);
    });
}

// Place a defender archer on a tower (static, no path)
function spawnTowerArcher(towerX, towerZ) {
    gltfLoader.load(BASE + 'textures/archer/archer.glb', (gltf) => {
        const archer = gltf.scene;
        const box = new THREE.Box3().setFromObject(archer);
        const size = box.getSize(new THREE.Vector3());
        const s = 2.5 / size.y;
        archer.scale.setScalar(s);
        // Place on top of tower (tower top = 12)
        // Offset inward from tower center to avoid flag pole
        const offsetX = towerX > 0 ? -1 : 1;
        archer.position.set(towerX + offsetX, 12, towerZ - 1);
        // Face toward the attacking knights (positive z)
        archer.rotation.y = 0;
        scene.add(archer);
    });
}

// Defenders on the two front towers
spawnTowerArcher(10, 10);
spawnTowerArcher(-10, 10);

// Spawn an attacker archer (GLB, with path)
function spawnArcher(id, config, path, speed = 3) {
    gltfLoader.load(BASE + 'textures/archer/archer.glb', (gltf) => {
        const archer = gltf.scene;
        const groundY = scaleAndGround(archer, 3);
        const char = createCharacter(archer, config, path, speed, groundY);
        scene.add(archer);
        characters.push(char);
    });
}

// Spawn a catapult (GLB, static)
function spawnCatapult(id, config, path, speed = 2) {
    gltfLoader.load(BASE + 'textures/catapult/catapult.glb', (gltf) => {
        const catapult = gltf.scene;
        const groundY = scaleAndGround(catapult, 3);
        // Rotate GLB model 180 degrees inside a wrapper
        const wrapper = new THREE.Group();
        catapult.rotation.y = Math.PI;
        wrapper.add(catapult);

        const char = createCharacter(wrapper, config, path, speed, groundY);
        char.facingOffset = 0;
        char.isCatapult = true;

        // Store catapult model ref for fire animation
        char.catapultModel = catapult;

        scene.add(wrapper);
        characters.push(char);
        catapultChars.push(char);
    });
}

// Load motion paths from data and spawn characters
import pathData from './paths.json';

// Track knight groups separately
const knightGroups = { north: [], east: [], west: [] };

Object.entries(pathData.knightGroups).forEach(([groupName, knights]) => {
    knights.forEach((k, i) => {
        spawnKnight(`${groupName}-${i}`, k.start, k.waypoints, k.speed, groupName);
    });
});

pathData.archers.forEach((a, index) => spawnArcher(`archer-${index}`, a.start, a.waypoints, a.speed));
pathData.catapults.forEach((c, index) => spawnCatapult(`catapult-${index}`, c.start, c.waypoints, c.speed));

// Click any character to start/stop its motion path
renderer.domElement.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    for (const char of characters) {
        const intersects = raycaster.intersectObject(char.model, true);
        if (intersects.length > 0) {
            if (char.isCatapult) {
                fireFromCatapult(char);
            } else {
                char.moving = !char.moving;
                if (char.walkAction) {
                    char.walkAction.paused = !char.moving;
                }
            }
            break;
        }
    }
});

// March sound
const marchAudio = new Audio(BASE + 'sounds/freesound_community-marching-loop-32908.mp3');
marchAudio.loop = true;
let marchingSoundCount = 0;

function startMarchSound() {
    marchingSoundCount++;
    if (marchAudio.paused) marchAudio.play();
}

function stopMarchSound() {
    marchingSoundCount = Math.max(0, marchingSoundCount - 1);
    if (marchingSoundCount === 0) {
        marchAudio.pause();
        marchAudio.currentTime = 0;
    }
}

// March knight groups — toggle on/off
function toggleGroup(group) {
    const anyMoving = group.some(c => c.moving);
    group.forEach(char => {
        char.moving = !anyMoving;
        if (char.walkAction) char.walkAction.paused = anyMoving;
    });
    if (!anyMoving) {
        startMarchSound();
    } else {
        stopMarchSound();
    }
}

export function marchNorth() {
    toggleGroup(knightGroups.north);
}

export function marchEast() {
    toggleGroup(knightGroups.east);
}

export function marchWest() {
    toggleGroup(knightGroups.west);
}

// Boulder projectile system
const boulders = [];
const boulderGeometry = new THREE.SphereGeometry(0.5, 8, 8);
const boulderMaterial = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.9 });

// Track catapult characters
const catapultChars = [];

const catapultSound = new Audio(BASE + 'sounds/freesound_community-falling-bomb-41038.mp3');

// Catapult swing animations in progress
const catapultSwings = [];

function fireFromCatapult(cat) {
    const sfx = catapultSound.cloneNode();
    sfx.play();

    // Swing animation - tilt the catapult model forward and back
    if (cat.catapultModel) {
        catapultSwings.push({
            model: cat.catapultModel,
            time: 0,
            duration: 0.4
        });
    }

    const startPos = cat.model.position.clone();
    startPos.y += 3;

    const boulder = new THREE.Mesh(boulderGeometry, boulderMaterial);
    boulder.position.copy(startPos);
    scene.add(boulder);

    // Random target within castle walls
    const targetX = (Math.random() - 0.5) * 16;
    const targetZ = (Math.random() - 0.5) * 16;

    boulders.push({
        mesh: boulder,
        start: startPos.clone(),
        target: new THREE.Vector3(targetX, 0, targetZ),
        time: 0,
        duration: 2 + Math.random() * 0.5,
        active: true
    });
}

// Fire all catapults from button
export function fireCatapult() {
    catapultChars.forEach((cat, i) => {
        setTimeout(() => fireFromCatapult(cat), i * 300);
    });
}

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    updatePerfMonitor();
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    controls.update();

    // Update animation mixers
    mixers.forEach(mixer => mixer.update(delta));

    // Move characters along their curves using arc-length progress.
    characters.forEach(char => {
        if (!char.moving || char.routeLength <= 0) return;

        if (char.routeMode === 'segments') {
            if (char.routeIndex >= char.routePoints.length - 1) {
                char.moving = false;
                if (char.walkAction) char.walkAction.paused = true;
                return;
            }

            const fromPoint = char.routePoints[char.routeIndex];
            const targetPoint = char.routePoints[char.routeIndex + 1];
            routeTargetPosition.copy(targetPoint);
            const dx = routeTargetPosition.x - char.model.position.x;
            const dz = routeTargetPosition.z - char.model.position.z;
            const distance = Math.hypot(dx, dz);
            const step = char.speed * delta;

            if (distance <= step) {
                char.model.position.copy(routeTargetPosition);
                char.routeIndex += 1;

                if (char.routeIndex >= char.routePoints.length - 1) {
                    char.moving = false;
                    if (char.walkAction) char.walkAction.paused = true;
                    return;
                }
            } else {
                char.model.position.x += (dx / distance) * step;
                char.model.position.z += (dz / distance) * step;
            }

            const heading = Math.atan2(
                char.routePoints[Math.min(char.routeIndex + 1, char.routePoints.length - 1)].x - char.model.position.x,
                char.routePoints[Math.min(char.routeIndex + 1, char.routePoints.length - 1)].z - char.model.position.z
            ) + char.facingOffset;
            const angleDelta = normalizeAngle(heading - char.model.rotation.y);
            const turnStep = Math.min(Math.abs(angleDelta), KNIGHT_TURN_SPEED * delta);
            char.model.rotation.y += Math.sign(angleDelta) * turnStep;
            return;
        }

        const nextProgress = Math.min(char.routeProgress + (char.speed * delta) / char.routeLength, 1);
        char.routeProgress = nextProgress;
        syncCharacterToRoute(char);

        if (nextProgress >= 1) {
            char.moving = false;
            if (char.walkAction) char.walkAction.paused = true;
        }
    });

    // Check if any marching group has fully stopped — update sound
    const groupsMarching = Object.values(knightGroups).filter(g => g.some(c => c.moving)).length;
    if (groupsMarching !== marchingSoundCount) {
        marchingSoundCount = groupsMarching;
        if (marchingSoundCount === 0) {
            marchAudio.pause();
            marchAudio.currentTime = 0;
        }
    }

    // Animate catapult swings
    for (let i = catapultSwings.length - 1; i >= 0; i--) {
        const swing = catapultSwings[i];
        swing.time += delta;
        const t = swing.time / swing.duration;
        if (t >= 1) {
            swing.model.rotation.x = 0;
            catapultSwings.splice(i, 1);
        } else {
            // Quick forward kick then return
            swing.model.rotation.x = Math.sin(t * Math.PI) * -0.5;
        }
    }

    // Animate boulders in parabolic arc
    boulders.forEach(b => {
        if (!b.active) return;
        b.time += delta;
        const t = Math.min(b.time / b.duration, 1);

        // Lerp x and z
        b.mesh.position.x = b.start.x + (b.target.x - b.start.x) * t;
        b.mesh.position.z = b.start.z + (b.target.z - b.start.z) * t;

        // Parabolic arc for y: peaks at midpoint
        const arcHeight = 20;
        b.mesh.position.y = b.start.y + (b.target.y - b.start.y) * t + arcHeight * 4 * t * (1 - t);

        // Spin the boulder
        b.mesh.rotation.x += delta * 5;
        b.mesh.rotation.z += delta * 3;

        if (t >= 1) {
            b.active = false;
            scene.remove(b.mesh);
        }
    });

    // Animate drawbridge rotation
    const targetRotation = drawbridgeOpen ? drawbridgeLoweredAngle : drawbridgeRaisedAngle;
    drawbridgePivot.rotation.x += (targetRotation - drawbridgePivot.rotation.x) * 0.05;

    // Update chain positions to connect anchors to drawbridge attachment points
    const upVector = new THREE.Vector3(0, 1, 0);
    const chainAttachTemp = new THREE.Vector3();
    const chainDirection = new THREE.Vector3();
    const chainMidpoint = new THREE.Vector3();

    drawbridgeChains.forEach(chain => {
        chain.attachObject.getWorldPosition(chainAttachTemp);
        chainDirection.copy(chainAttachTemp).sub(chain.anchor);
        const length = chainDirection.length();
        chainMidpoint.copy(chainAttachTemp).add(chain.anchor).multiplyScalar(0.5);
        chain.mesh.position.copy(chainMidpoint);
        chain.mesh.scale.set(1, length, 1);
        chain.mesh.quaternion.setFromUnitVectors(upVector, chainDirection.normalize());
    });

    renderer.render(scene, camera);
}
animate();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
