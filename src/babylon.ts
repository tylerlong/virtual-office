import * as BABYLON from 'babylonjs';

import tileImage from './tile.jpeg';

const groundWidth = 1000;
const groundHeight = 1000;
const tileImageWidth = 2500;
const tileImageHeight = 2500;

export const init = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const engine = new BABYLON.Engine(canvas);
  const scene = new BABYLON.Scene(engine);

  scene.gravity = new BABYLON.Vector3(0, -0.15, 0);
  scene.collisionsEnabled = true;

  const camera = new BABYLON.UniversalCamera(
    'UniversalCamera',
    new BABYLON.Vector3(0, 10, 0),
    scene
  );
  camera.applyGravity = true;
  camera.ellipsoid = new BABYLON.Vector3(10, 10, 10);
  camera.checkCollisions = true;
  camera.setTarget(new BABYLON.Vector3(1, 10, 1));
  camera.attachControl(canvas);

  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  const ground = BABYLON.MeshBuilder.CreateGround(
    'ground',
    {width: groundWidth, height: groundHeight},
    scene
  );
  ground.checkCollisions = true;
  const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', scene);
  groundMaterial.diffuseTexture = new BABYLON.Texture(tileImage, scene);
  (groundMaterial.diffuseTexture as BABYLON.Texture).uScale =
    (groundWidth / tileImageWidth) * 100;
  (groundMaterial.diffuseTexture as BABYLON.Texture).vScale =
    (groundHeight / tileImageHeight) * 100;
  ground.material = groundMaterial;

  engine.runRenderLoop(() => {
    scene.render();
  });
  window.addEventListener('resize', () => {
    engine.resize();
  });
};
