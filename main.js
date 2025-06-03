import * as THREE from 'https://unpkg.com/three@0.153.0/build/three.module.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.153.0/examples/jsm/controls/PointerLockControls.js';

let camera, scene, renderer, controls;
let objects = [];

const blocker = document.getElementById('overlay');
const instructions = document.getElementById('startButton');

init();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 200, 0);
  scene.add(light);

  const floorGeometry = new THREE.PlaneGeometry(2000, 2000, 10, 10);
  const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x101010, wireframe: true });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new PointerLockControls(camera, document.body);
  scene.add(controls.getObject());

  instructions.addEventListener('click', function () {
    controls.lock();
  });

  controls.addEventListener('lock', function () {
    blocker.style.display = 'none';
  });

  controls.addEventListener('unlock', function () {
    blocker.style.display = 'flex';
  });

  document.addEventListener('keydown', onKeyDown);

  window.addEventListener('resize', onWindowResize);

  // Generate initial maze
  generateMaze();

  animate();
}

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
const velocity = new THREE.Vector3();

function onKeyDown(event) {
  switch (event.code) {
    case 'KeyW': moveForward = true; break;
    case 'KeyA': moveLeft = true; break;
    case 'KeyS': moveBackward = true; break;
    case 'KeyD': moveRight = true; break;
  }
}

document.addEventListener('keyup', function (event) {
  switch (event.code) {
    case 'KeyW': moveForward = false; break;
    case 'KeyA': moveLeft = false; break;
    case 'KeyS': moveBackward = false; break;
    case 'KeyD': moveRight = false; break;
  }
});

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function generateMaze() {
  const size = 20;
  for (let i = -size; i < size; i++) {
    for (let j = -size; j < size; j++) {
      if (Math.random() > 0.8) {
        const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
        const boxMaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.set(i * 20, 5, j * 20);
        scene.add(box);
        objects.push(box);
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);

  if (controls.isLocked === true) {
    const delta = 0.1;
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    if (moveForward) velocity.z -= 400.0 * delta;
    if (moveBackward) velocity.z += 400.0 * delta;
    if (moveLeft) velocity.x -= 400.0 * delta;
    if (moveRight) velocity.x += 400.0 * delta;

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
  }

  renderer.render(scene, camera);
}
