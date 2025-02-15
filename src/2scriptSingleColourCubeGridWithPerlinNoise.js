import * as THREE from "three";
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

//////////////////////////////////////////
/////////////// Objects //////////////////
//////////////////////////////////////////
// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffff00, 20);
pointLight.position.set(2, 2, 4);
scene.add(pointLight);
const pointLight2 = new THREE.PointLight(0xffffff, 20);
pointLight2.position.set(8, 2, 2);
scene.add(pointLight2);

// Geometry - will use the same one for all meshes
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Material - will use the same one for all meshes
const material = new THREE.MeshToonMaterial({ color: "#8338ec" });

// Create and add all the meshes in a grid
const meshes = [];
const group = new THREE.Group();
let cols = 5;
let rows = 5;
let spacing = 0.5; // How much space between all the cubes in the grid
const noiseScale = 0.4; // Adjust for smoothness of the Perlin noise

for (let x = 0; x < cols; x++) {
  for (let y = 0; y < rows; y++) {
    const newMesh = new THREE.Mesh(geometry, material);
    // Position the mesh in the grid
    newMesh.position.x = x + spacing * x;
    newMesh.position.z = y + spacing * y;

    // Adjust the scale of the cubes (random)
    newMesh.scale.x = Math.random() + 0.5;
    newMesh.scale.z = Math.random() + 0.5;

    // Adjust the height of the cubes
    // Option 1: Random
    const scaleY = Math.random() * 2 + 0.5;

    // // Option 2: Perlin noise
    // const noiseValue = noise.perlin2(x * noiseScale, y * noiseScale); // Get Perlin noise value for (x, y). Returns value between -1 and 1
    // const scaleY = THREE.MathUtils.mapLinear(noiseValue, -1, 1, 1, 4);     // Convert noise to a valid scale range (e.g., 1 to 4)

    // Apply the scale
    newMesh.scale.y = scaleY;
    // Adjust position so scaling happens from the bottom and not the center
    newMesh.position.y = (scaleY - 1) / 2;

    // Push the mesh into the array of meshes
    meshes.push(newMesh);
  }
}
// Add the new meshes to the scene all at once
group.add(...meshes);
scene.add(group);

// Group position
group.position.x = 0;
group.position.y = 4;
// Group rotation
group.rotation.x = Math.PI * 0.2; // Rotate a little on the x-axis so we can see more of the cubes from the top (we will be able to adjust this later)
group.rotation.y = Math.PI * 0.25; // Rotate by 45 deg around the y-axis to get a diamond shape

// Add all of the group positions and rotations to the gui to be able to experiment
gui
  .add(group.position, "x")
  .min(-10)
  .max(10)
  .step(0.1)
  .name("group position x");
gui
  .add(group.position, "y")
  .min(-10)
  .max(10)
  .step(0.1)
  .name("group position y");
gui
  .add(group.rotation, "x")
  .min(-Math.PI * 2)
  .max(Math.PI * 2)
  .step(0.1)
  .name("group rotation x");
gui
  .add(group.rotation, "y")
  .min(-Math.PI * 2)
  .max(Math.PI * 2)
  .step(0.1)
  .name("group rotation y");
gui
  .add(group.rotation, "z")
  .min(-Math.PI * 2)
  .max(Math.PI * 2)
  .step(0.1)
  .name("group rotation z");

// Camera - Orthographic camera
const aspectRatio = sizes.width / sizes.height;

const frustumSize = 5; // Adjust for a larger view
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

// Add camera position to GUI
gui.add(camera.position, "x").min(-10).max(10).step(0.1).name("camera x");
gui.add(camera.position, "y").min(-10).max(10).step(0.1).name("camera y");

//////////////////////////////////////////
//////////////// Render //////////////////
//////////////////////////////////////////
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//////////////////////////////////////////
/////////////// Animate //////////////////
//////////////////////////////////////////
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Just for fun - animate one of the point lights
  pointLight.position.x = Math.cos(elapsedTime) * 3 + 2;
  pointLight.position.y = Math.sin(elapsedTime) * 3 + 4;

  // Animate meshes using Perlin noise over time
  // const animationSpeed = 0.5; // Adjust for slower or faster animation
  // group.children.forEach((mesh) => {
  //   const x = mesh.position.x;
  //   const z = mesh.position.z;

  //   const noiseValue = noise.perlin2(
  //     x * noiseScale,
  //     z * noiseScale + elapsedTime * animationSpeed // Same as before but moving on z axis
  //   );
  //   const scaleY = THREE.MathUtils.mapLinear(noiseValue, -1, 1, 1, 4); //// Map noise value to scale range

  //   mesh.scale.y = scaleY;
  //   mesh.position.y = (scaleY - 1) / 2; // Keep bottom at the same level
  // });

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
