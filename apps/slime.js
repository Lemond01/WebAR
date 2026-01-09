// app.js (módulo ES)
import * as THREE from 'https://unpkg.com/three@0.154.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.154.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.154.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://unpkg.com/three@0.154.0/examples/jsm/loaders/DRACOLoader.js';

let scene, camera, renderer, controls, mixer, clock;

init();
animate();

function init(){
  // Escena
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);

  // Cámara
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(2, 2, 4);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  // Luces
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
  hemi.position.set(0, 20, 0);
  scene.add(hemi);

  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(5, 10, 7.5);
  dir.castShadow = true;
  scene.add(dir);

  // Suelo (referencia)
  const grid = new THREE.GridHelper(10, 20, 0x888888, 0xcccccc);
  scene.add(grid);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1, 0);

  // Clock para animaciones
  clock = new THREE.Clock();

  // GLTF Loader y (opcional) DRACO
  const loader = new GLTFLoader();

  // --- Si tu GLB está comprimido con Draco, configura DRACOLoader:
  // const dracoLoader = new DRACOLoader();
  // dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/'); // ruta común
  // loader.setDRACOLoader(dracoLoader);

  // Cargar GLB
  loader.load(
    'models/slime.glb',
    (gltf) => {
      const root = gltf.scene || gltf.scenes[0];
      // Opcional: centrar y escalar
      root.position.set(0, 0, 0);
      // Ajusta escala si está muy pequeño/grande:
      // root.scale.setScalar(1);

      scene.add(root);

      // Si hay animaciones
      if (gltf.animations && gltf.animations.length) {
        mixer = new THREE.AnimationMixer(root);
        // reproducir la primera animación (o buscar por nombre)
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
      }

      console.log('Model loaded', gltf);
    },
    (xhr) => {
      // progreso
      console.log(`Model ${ (xhr.loaded / xhr.total * 100).toFixed(2) }% loaded`);
    },
    (err) => {
      console.error('Error loading model:', err);
    }
  );

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(){
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  controls.update();
  renderer.render(scene, camera);
}
