import * as BABYLON from 'babylonjs';

import tileImage from './tile.jpeg';

const screenWidth = 160;
const screenHeight = 90;
let groundWidth = 300;
let groundDepth = 300;
const tileImageWidth = 2500;
const tileImageDepth = 2500;
const cameraHeight = 10;
let wallHeight = 100;
const videoMargin = 5;

export const init3D = () => {
  const videoElements = Array.from(
    document.getElementsByClassName('video-element')
  ) as HTMLVideoElement[];
  groundWidth = groundDepth =
    videoElements.length * screenWidth +
    videoMargin +
    videoElements.length * videoMargin;
  wallHeight = screenHeight + videoMargin * 2;
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const engine = new BABYLON.Engine(canvas);
  const scene = new BABYLON.Scene(engine);

  scene.gravity = new BABYLON.Vector3(0, -0.15, 0);
  scene.collisionsEnabled = true;

  const camera = new BABYLON.UniversalCamera(
    'camera',
    new BABYLON.Vector3(-groundWidth / 2 + 5, cameraHeight, 0),
    scene
  );
  camera.applyGravity = true;
  camera.ellipsoid = new BABYLON.Vector3(
    cameraHeight,
    cameraHeight,
    cameraHeight
  );
  camera.checkCollisions = true;
  camera.setTarget(new BABYLON.Vector3(1, cameraHeight, 0));
  camera.attachControl(canvas);

  new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
  new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(-1, -1, 0), scene);

  const ground = BABYLON.MeshBuilder.CreateGround(
    'ground',
    {width: groundWidth, height: groundDepth},
    scene
  );
  ground.checkCollisions = true;
  const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', scene);
  const groundTexture = new BABYLON.Texture(tileImage, scene);
  groundMaterial.diffuseTexture = groundTexture;
  groundMaterial.specularTexture = groundTexture;
  groundTexture.uScale = (groundWidth / tileImageWidth) * 100;
  groundTexture.vScale = (groundDepth / tileImageDepth) * 100;
  ground.material = groundMaterial;

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
  wallMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
  wallMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
  wall1.material = wallMaterial;
  wall2.material = wallMaterial;
  wall3.material = wallMaterial;
  wall4.material = wallMaterial;
  wall1.checkCollisions = true;
  wall2.checkCollisions = true;
  wall3.checkCollisions = true;
  wall4.checkCollisions = true;

  const roof = BABYLON.MeshBuilder.CreateBox('roof', {
    width: groundWidth + 1,
    height: 1,
    depth: groundDepth + 1,
  });
  roof.position = new BABYLON.Vector3(0, wallHeight, 0);

  // enable VR for Oculus
  if (navigator.userAgent.includes('OculusBrowser/')) {
    const env = scene.createDefaultEnvironment()!;
    scene.createDefaultXRExperienceAsync({
      floorMeshes: [env.ground!],
    });
  }

  let index = 0;
  for (const videoElement of videoElements) {
    const screen = BABYLON.MeshBuilder.CreatePlane(
      videoElement.id + '-screen',
      {width: screenWidth, height: screenHeight},
      scene
    );
    screen.rotate(BABYLON.Axis.Y, Math.PI / 2, BABYLON.Space.WORLD);
    screen.position = new BABYLON.Vector3(
      groundDepth / 2 - 1,
      screenHeight / 2 + (wallHeight - screenHeight) / 2,
      groundWidth / 2 -
        screenWidth / 2 -
        index * screenWidth -
        videoMargin -
        index * videoMargin
    );
    screen.checkCollisions = true;
    const screenMaterial = new BABYLON.StandardMaterial(
      'screenMaterial',
      scene
    );
    const videoTexture = new BABYLON.VideoTexture(
      videoElement.id + '-texture',
      videoElement,
      scene,
      true,
      true
    );
    videoTexture.vScale = -1;
    screenMaterial.diffuseTexture = videoTexture;
    screen.material = screenMaterial;
    index += 1;
  }

  engine.runRenderLoop(() => {
    scene.render();
  });
  window.addEventListener('resize', () => {
    engine.resize();
  });
};
