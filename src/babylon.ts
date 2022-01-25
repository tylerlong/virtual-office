import * as BABYLON from 'babylonjs';

import tileImage from './tile.jpeg';

export const init = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const engine = new BABYLON.Engine(canvas);
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.UniversalCamera(
    'UniversalCamera',
    new BABYLON.Vector3(0, 30, 50),
    scene
  );
  camera.setTarget(new BABYLON.Vector3(0, 30, 0));
  camera.attachControl(canvas);

  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  const box = BABYLON.MeshBuilder.CreateBox('box', {size: 20});

  const ground = BABYLON.MeshBuilder.CreateGround(
    'ground',
    {width: 10000, height: 10000},
    scene
  );
  const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', scene);
  groundMaterial.diffuseTexture = new BABYLON.Texture(tileImage, scene);
  (groundMaterial.diffuseTexture as BABYLON.Texture).uScale = 10000 / 249;
  (groundMaterial.diffuseTexture as BABYLON.Texture).vScale = 10000 / 249;
  ground.material = groundMaterial;

  engine.runRenderLoop(() => {
    scene.render();
  });
  window.addEventListener('resize', () => {
    engine.resize();
  });
};
