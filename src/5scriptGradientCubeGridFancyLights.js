// Starting point: https://generative-sketches.netlify.app/sketches/light01

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { Noise } from "noisejs";
const noise = new Noise(Math.random()); // Seed with a random value

//////////////////////////////////////////
///////////////// Setup //////////////////
//////////////////////////////////////////

// Debug gui - initialise
const gui = new GUI({
  width: 300,
  title: "Nice debug UI",
  closeFolders: false,
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/************************************
 ************** Objects **************
 ************************************/

// Material
const material = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#ebebeb"),
  side: THREE.DoubleSide,
  metalness: 0,
});
// Plane geometry + mesh
const planeGeometry = new THREE.PlaneGeometry(13, 13);
const plane = new THREE.Mesh(planeGeometry, material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
scene.add(plane);

// Geometry -- reuse for all the boxes
const geometry = new THREE.BoxGeometry(1, 1, 1);

const meshes = [];
let cols = 14;
let rows = 8;
let spacing = 0.01; // How much space between all the cubes in the grid
const noiseScale = 0.4; // Adjust for smoothness of the Perlin noise
const group = new THREE.Group();

for (let z = 0; z < cols; z++) {
  for (let y = 0; y < rows; y++) {
    const newMesh = new THREE.Mesh(geometry, material);
    // Position the mesh in the grid
    newMesh.position.z = z + spacing * z;
    newMesh.position.y = y + spacing * y;

    // Adjust the width of the cubes
    // newMesh.scale.x = Math.random();
    newMesh.scale.y = Math.random();
    newMesh.scale.z = Math.random();

    // Option 2: Perlin noise
    const noiseValue = noise.perlin2(y * noiseScale, z * noiseScale); // Get Perlin noise value for (x, y). Returns value between -1 and 1
    const scaleX = THREE.MathUtils.mapLinear(noiseValue, -1, 1, 0.8, 1.2); // Convert noise to a valid scale range (e.g., 1 to 4)
    // Apply the scale
    newMesh.scale.x = scaleX;

    meshes.push(newMesh);
  }
}
group.add(...meshes);
scene.add(group);
group.scale.set(0.3, 0.3, 0.3);
group.position.x = -2.5;
group.position.y = -1;
group.rotation.y = Math.PI * 0.5;

/************************************
 ************** Lights ***************
 ************************************/
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 0.25, 1);
scene.add(directionalLight);

// Hemisphere light
const hemisphereLight = new THREE.HemisphereLight(0x0000ff, "orange", 1);
scene.add(hemisphereLight);

// Spot light
const spotLight = new THREE.SpotLight(0x78ff00, 5, 10, Math.PI * 0.1, 0.25, 1);
spotLight.position.set(0, 3, 1);
spotLight.target.position.set(-2, 0, 1);
scene.add(spotLight);
scene.add(spotLight.target);

// Rect area light
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 20, 2, 2);
rectAreaLight.lookAt(new THREE.Vector3(0, 0, 0));
rectAreaLight.rotation.x = Math.PI;
scene.add(rectAreaLight);

gui
  .add(rectAreaLight, "intensity")
  .min(0)
  .max(100)
  .name("rectAreaLight intensity");
gui.add(rectAreaLight, "width").min(0).max(20).name("rectAreaLight width");
gui.add(rectAreaLight, "height").min(0).max(20).name("rectAreaLight height");

/************************************
 ************** Camera ***************
 ************************************/
const aspectRatio = sizes.width / sizes.height;
const frustumSize = 2; // Adjust for a larger view
const camera = new THREE.OrthographicCamera(
  -frustumSize * aspectRatio,
  frustumSize * aspectRatio,
  frustumSize,
  -frustumSize,
  -100,
  100
);
camera.position.set(frustumSize, frustumSize, frustumSize);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enabled = false;

// Add camera position to GUI
gui.add(camera.position, "x").min(-10).max(10).step(0.1).name("camera x");
gui.add(camera.position, "y").min(-10).max(10).step(0.1).name("camera y");

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  group.children.forEach((mesh, i) => {
    mesh.position.x += noise.perlin2(i, elapsedTime * 1) * 0.05;
  });

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
