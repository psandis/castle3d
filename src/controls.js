import { castle } from './main.js'; // Import castle group

// Movement Functions
const moveDistance = 1;
export function moveCastle(direction) {
    switch (direction) {
        case 'left': castle.position.x -= moveDistance; break;
        case 'right': castle.position.x += moveDistance; break;
        case 'up': castle.position.y += moveDistance; break;
        case 'down': castle.position.y -= moveDistance; break;
        case 'forward': castle.position.z -= moveDistance; break;
        case 'backward': castle.position.z += moveDistance; break;
    }
}

// Button Event Listeners
document.getElementById('moveLeft').addEventListener('click', () => moveCastle('left'));
document.getElementById('moveRight').addEventListener('click', () => moveCastle('right'));
document.getElementById('moveUp').addEventListener('click', () => moveCastle('up'));
document.getElementById('moveDown').addEventListener('click', () => moveCastle('down'));
document.getElementById('moveForward').addEventListener('click', () => moveCastle('forward'));
document.getElementById('moveBackward').addEventListener('click', () => moveCastle('backward'));