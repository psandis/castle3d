import { camera, toggleDrawbridge, marchNorth, marchEast, marchWest, fireCatapult, toggleStatsDisplay } from './main.js';

// Camera movement
const moveDistance = 2;
function moveCamera(direction) {
    switch (direction) {
        case 'left': camera.position.x -= moveDistance; break;
        case 'right': camera.position.x += moveDistance; break;
        case 'up': camera.position.y += moveDistance; break;
        case 'down': camera.position.y -= moveDistance; break;
        case 'forward': camera.position.z -= moveDistance; break;
        case 'backward': camera.position.z += moveDistance; break;
    }
}

document.getElementById('moveLeft').addEventListener('click', () => moveCamera('left'));
document.getElementById('moveRight').addEventListener('click', () => moveCamera('right'));
document.getElementById('moveUp').addEventListener('click', () => moveCamera('up'));
document.getElementById('moveDown').addEventListener('click', () => moveCamera('down'));
document.getElementById('moveForward').addEventListener('click', () => moveCamera('forward'));
document.getElementById('moveBackward').addEventListener('click', () => moveCamera('backward'));
document.getElementById('toggleDrawbridge').addEventListener('click', () => toggleDrawbridge());
document.getElementById('marchNorth').addEventListener('click', () => marchNorth());
document.getElementById('marchEast').addEventListener('click', () => marchEast());
document.getElementById('marchWest').addEventListener('click', () => marchWest());
document.getElementById('fireCatapult').addEventListener('click', () => fireCatapult());
document.getElementById('toggleStats').addEventListener('click', () => toggleStatsDisplay());
