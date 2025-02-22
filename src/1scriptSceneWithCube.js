// Loosely based on the Three.js Journey course, especially Lesson 14

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

//////////////////////////////////////////
///////////////// Setup //////////////////
//////////////////////////////////////////
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

//////////////////////////////////////////
/////////////// Objects //////////////////
//////////////////////////////////////////

// Lights
// Ambient light
const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color(0xffffff);
ambientLight.intensity = 0.25;
scene.add(ambientLight);
gui.add(ambientLight, "intensity").min(0).max(3).step(0.001);

// Directional light
// const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9);
// directionalLight.position.set(1, 0.25, 0);
// scene.add(directionalLight);

// Spotlight
const light = new THREE.SpotLight(0xffffff);
light.castShadow = true; // default false
scene.add(light);

// Materials -- shared between all geometires below
const material = new THREE.MeshStandardMaterial({
    color: 0x87CEEB, // light blue color
    metalness: 0.2,
    roughness: 0.1,
});

const material2 = new THREE.MeshBasicMaterial({
    color: 0xff69b4, // pink color
    metalness: 0.0,
    roughness: 0.5,
});

// Geometries
const planeGeometry = new THREE.PlaneGeometry(5, 5);
const geometryBox = new THREE.BoxGeometry(0.75, 0.75, 0.75);
const geometrySphere = new THREE.SphereGeometry(0.5, 32, 32);

// Meshes
const cube = new THREE.Mesh(geometryBox, material);
const cube2 = new THREE.Mesh(geometryBox, material2);

const sphere = new THREE.Mesh(geometrySphere, material);
sphere.position.x = -1.0;

const plane = new THREE.Mesh(planeGeometry, material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

// scene.add(sphere, cube, plane);
// scene.add(sphere, cube, cube2);
scene.add(sphere, cube);

// Camera
const camera = new THREE.PerspectiveCamera(
    75, // POV
    sizes.width / sizes.height, // aspect ratio
    0.01, // near
    100 // far
);

camera.position.x = 5;
camera.position.y = 4;
camera.position.z = 2;
scene.add(camera);

//////////////////////////////////////////
//////////////// Render //////////////////
//////////////////////////////////////////
// Controls
const controls = new OrbitControls(camera, canvas);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//////////////////////////////////////////
/////////////// Animate //////////////////
//////////////////////////////////////////
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    cube.rotation.y = 0.1 * elapsedTime;
    cube.rotation.x = 0.15 * elapsedTime;

    sphere.position.x = Math.cos(elapsedTime);
    sphere.position.y = Math.sin(elapsedTime);

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
