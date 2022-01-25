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

  const light1 = new BABYLON.HemisphericLight(
    'light1',
    new BABYLON.Vector3(1, -0.25, 0),
    scene
  );
  const light2 = new BABYLON.HemisphericLight(
    'light2',
    new BABYLON.Vector3(-1, -0.25, 0),
    scene
  );
  const light3 = new BABYLON.HemisphericLight(
    'light3',
    new BABYLON.Vector3(0, -0.25, 1),
    scene
  );
  const light4 = new BABYLON.HemisphericLight(
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

  const wallMaterial = new BABYLON.StandardMaterial('wallMaterial', scene);
  wallMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0);
  wall1.material = wallMaterial;
  wall2.material = wallMaterial;

  engine.runRenderLoop(() => {
    scene.render();
  });
  window.addEventListener('resize', () => {
    engine.resize();
  });
};
