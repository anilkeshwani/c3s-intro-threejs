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
ambientLight.intensity = 1;
scene.add(ambientLight);
gui.add(ambientLight, "intensity").min(0).max(3).step(0.001);

// Directional light
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9);
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);

// Spotlight
const light = new THREE.SpotLight(0xffffff);
light.castShadow = true; // default false
scene.add(light);

// Materials -- shared between all geometires below
const material = new THREE.MeshStandardMaterial({
    color: 0xFF6347, // mild red color
    metalness: 0.2,
    roughness: 0.1,
});

// Geometries
const geometrySphere = new THREE.SphereGeometry(0.5, 32, 32);
const geometrySphere2 = new THREE.SphereGeometry(0.3, 32, 32); // smaller size

// Meshes
const centralBody = new THREE.Mesh(geometrySphere, material);
const orbitingBody1 = new THREE.Mesh(geometrySphere2, material); // smaller size
const orbitingBody2 = new THREE.Mesh(geometrySphere2, material); // smaller size
centralBody.position.x = 0.0;

scene.add(centralBody, orbitingBody1, orbitingBody2);

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

// Add zoom control
window.addEventListener('wheel', (event) => {
    camera.zoom += event.deltaY * -0.01;
    camera.zoom = Math.max(Math.min(camera.zoom, 10), 0.1); // Limit zoom level
    camera.updateProjectionMatrix();
});

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
    orbitingBody1.position.x = Math.cos(elapsedTime);
    orbitingBody1.position.y = Math.sin(elapsedTime);

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
