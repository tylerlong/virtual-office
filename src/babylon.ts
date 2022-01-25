import * as BABYLON from 'babylonjs';

import tileImage from './tile.jpeg';

const groundWidth = 200;
const groundDepth = 200;
const tileImageWidth = 2500;
const tileImageDepth = 2500;

export const init = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const engine = new BABYLON.Engine(canvas);
  const scene = new BABYLON.Scene(engine);

  scene.gravity = new BABYLON.Vector3(0, -0.15, 0);
  scene.collisionsEnabled = true;

  const camera = new BABYLON.UniversalCamera(
    'camera',
    new BABYLON.Vector3(0, 10, 0),
    scene
  );
  camera.applyGravity = true;
  camera.ellipsoid = new BABYLON.Vector3(10, 10, 10);
  camera.checkCollisions = true;
  camera.setTarget(new BABYLON.Vector3(1, 10, 1));
  camera.attachControl(canvas);

  new BABYLON.HemisphericLight(
    'light1',
    new BABYLON.Vector3(1, -0.25, 0),
    scene
  );
  new BABYLON.HemisphericLight(
    'light2',
    new BABYLON.Vector3(-1, -0.25, 0),
    scene
  );
  new BABYLON.HemisphericLight(
    'light3',
    new BABYLON.Vector3(0, -0.25, 1),
    scene
  );
  new BABYLON.HemisphericLight(
    'light4',
    new BABYLON.Vector3(0, -0.25, -1),
    scene
  );

  const ground = BABYLON.MeshBuilder.CreateGround(
    'ground',
    {width: groundWidth, height: groundDepth},
    scene
  );
  ground.checkCollisions = true;
  const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', scene);
  groundMaterial.diffuseTexture = new BABYLON.Texture(tileImage, scene);
  (groundMaterial.diffuseTexture as BABYLON.Texture).uScale =
    (groundWidth / tileImageWidth) * 100;
  (groundMaterial.diffuseTexture as BABYLON.Texture).vScale =
    (groundDepth / tileImageDepth) * 100;
  ground.material = groundMaterial;

  const wallHeight = 40;
  const wall1 = BABYLON.MeshBuilder.CreateBox(
    'wall1',
    {
      width: groundWidth,
      height: wallHeight,
      depth: 1,
    },
    scene
  );
  wall1.position = new BABYLON.Vector3(0, wallHeight / 2, groundDepth / 2);
  const wall2 = BABYLON.MeshBuilder.CreateBox(
    'wall2',
    {
      width: groundWidth,
      height: wallHeight,
      depth: 1,
    },
    scene
  );
  wall2.position = new BABYLON.Vector3(0, wallHeight / 2, -groundDepth / 2);
  const wall3 = BABYLON.MeshBuilder.CreateBox(
    'wall3',
    {
      width: 1,
      height: wallHeight,
      depth: groundDepth,
    },
    scene
  );
  wall3.position = new BABYLON.Vector3(groundWidth / 2, wallHeight / 2, 0);
  const wall4 = BABYLON.MeshBuilder.CreateBox(
    'wall4',
    {
      width: 1,
      height: wallHeight,
      depth: groundDepth,
    },
    scene
  );
  wall4.position = new BABYLON.Vector3(-groundWidth / 2, wallHeight / 2, 0);

  const wallMaterial = new BABYLON.StandardMaterial('wallMaterial', scene);
  wallMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0);
  wall1.material = wallMaterial;
  wall2.material = wallMaterial;
  wall3.material = wallMaterial;
  wall4.material = wallMaterial;

  engine.runRenderLoop(() => {
    scene.render();
  });
  window.addEventListener('resize', () => {
    engine.resize();
  });
};
