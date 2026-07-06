import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(8, 5, 12);
camera.lookAt(0, 0.8, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.8, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 3;
controls.maxDistance = 25;
controls.update();

const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffeedd, 2.5);
mainLight.position.set(5, 8, 4);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0x4488ff, 0.8);
fillLight.position.set(-3, 2, -4);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
rimLight.position.set(0, -2, 5);
scene.add(rimLight);

const groundGeo = new THREE.PlaneGeometry(40, 40);
const groundMat = new THREE.ShadowMaterial({ opacity: 0.3, color: 0x000000 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.01;
ground.receiveShadow = true;
scene.add(ground);

const grid = new THREE.GridHelper(20, 20, 0x6666aa, 0x444466);
grid.position.y = 0;
scene.add(grid);

const avatar = new THREE.Group();

const skinMat = new THREE.MeshStandardMaterial({ color: 0xf0c8a0, roughness: 0.5, metalness: 0.0 });
const darkMat = new THREE.MeshStandardMaterial({ color: 0x2c2c3a, roughness: 0.8, metalness: 0.0 });
const whiteMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.7, metalness: 0.0 });
const eyeMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3, metalness: 0.1 });
const mouthMat = new THREE.MeshStandardMaterial({ color: 0xcc8888, roughness: 0.4, metalness: 0.0 });
const beltMat = new THREE.MeshStandardMaterial({ color: 0x553322, roughness: 0.9, metalness: 0.0 });

const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 1.2, 12), darkMat);
torso.position.y = 1.0;
torso.castShadow = true;
avatar.add(torso);

const belt = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.06, 8, 24), beltMat);
belt.position.y = 0.45;
belt.rotation.x = Math.PI / 2;
belt.castShadow = true;
avatar.add(belt);

const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.15, 10), skinMat);
neck.position.y = 1.65;
neck.castShadow = true;
avatar.add(neck);

const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 24), skinMat);
head.position.y = 1.95;
head.castShadow = true;
avatar.add(head);

const hairMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9, metalness: 0.0 });
const hair = new THREE.Mesh(new THREE.SphereGeometry(0.56, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.4), hairMat);
hair.position.set(0, 2.08, 0.05);
hair.scale.set(1, 0.45, 1.1);
hair.castShadow = true;
avatar.add(hair);

const eyeGeo = new THREE.SphereGeometry(0.09, 12, 12);
const leftEye = new THREE.Mesh(eyeGeo, whiteMat);
leftEye.position.set(-0.17, 2.04, 0.48);
avatar.add(leftEye);

const rightEye = new THREE.Mesh(eyeGeo, whiteMat);
rightEye.position.set(0.17, 2.04, 0.48);
avatar.add(rightEye);

const pupilGeo = new THREE.SphereGeometry(0.05, 10, 10);
const leftPupil = new THREE.Mesh(pupilGeo, eyeMat);
leftPupil.position.set(-0.17, 2.02, 0.56);
avatar.add(leftPupil);

const rightPupil = new THREE.Mesh(pupilGeo, eyeMat);
rightPupil.position.set(0.17, 2.02, 0.56);
avatar.add(rightPupil);

const mouth = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.04, 8), mouthMat);
mouth.position.set(0, 1.82, 0.52);
mouth.rotation.z = 0.1;
mouth.rotation.x = 0.2;
avatar.add(mouth);

const armMat = darkMat;
const footMat = new THREE.MeshStandardMaterial({ color: 0x333344, roughness: 0.9 });
const armLen = 0.8;
const armHalf = armLen / 2;
const legLen = 0.75;
const legHalf = legLen / 2;

const leftArmPivot = new THREE.Group();
leftArmPivot.position.set(-0.95, 1.8, 0);
avatar.add(leftArmPivot);

const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, armLen, 10), armMat);
leftArm.position.set(0, -armHalf, 0);
leftArm.rotation.z = 0.2;
leftArm.castShadow = true;
leftArmPivot.add(leftArm);

const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), skinMat);
leftHand.position.set(0, -armLen - 0.08, 0.05);
leftHand.castShadow = true;
leftArmPivot.add(leftHand);

const rightArmPivot = new THREE.Group();
rightArmPivot.position.set(0.95, 1.8, 0);
avatar.add(rightArmPivot);

const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, armLen, 10), armMat);
rightArm.position.set(0, -armHalf, 0);
rightArm.rotation.z = -0.2;
rightArm.castShadow = true;
rightArmPivot.add(rightArm);

const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), skinMat);
rightHand.position.set(0, -armLen - 0.08, -0.05);
rightHand.castShadow = true;
rightArmPivot.add(rightHand);

const leftLegPivot = new THREE.Group();
leftLegPivot.position.set(-0.35, 0.725, 0);
avatar.add(leftLegPivot);

const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, legLen, 10), darkMat);
leftLeg.position.set(0, -legHalf, 0);
leftLeg.castShadow = true;
leftLegPivot.add(leftLeg);

const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.45), footMat);
leftFoot.position.set(0, -legLen - 0.06, 0.05);
leftFoot.castShadow = true;
leftLegPivot.add(leftFoot);

const rightLegPivot = new THREE.Group();
rightLegPivot.position.set(0.35, 0.725, 0);
avatar.add(rightLegPivot);

const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, legLen, 10), darkMat);
rightLeg.position.set(0, -legHalf, 0);
rightLeg.castShadow = true;
rightLegPivot.add(rightLeg);

const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.45), footMat);
rightFoot.position.set(0, -legLen - 0.06, 0.05);
rightFoot.castShadow = true;
rightLegPivot.add(rightFoot);

scene.add(avatar);
avatar.scale.set(0.6, 0.6, 0.6);

const walkSpeed = 0.02;
const walkRadius = 2.5;
let walkAngle = Math.random() * Math.PI * 2;
let walkTimer = 0;

const loader = new FontLoader();
loader.load('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/fonts/helvetiker_bold.typeface.json', (font) => {
  const textGeo = new TextGeometry('HELLO', {
    font,
    size: 0.5,
    height: 0.05,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.01,
    bevelSegments: 3,
  });
  textGeo.computeBoundingBox();
  const cx = (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x) / 2;

  const textMat = new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    roughness: 0.2,
    metalness: 0.6,
    emissive: 0x224466,
    emissiveIntensity: 0.2,
  });
  const text = new THREE.Mesh(textGeo, textMat);
  text.position.set(-cx, 1.7, 0);
  text.castShadow = true;
  scene.add(text);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  const t = Date.now() * 0.003;
  avatar.position.y = Math.sin(t * 0.3) * 0.04;

  const swing = 0.5;
  leftArmPivot.rotation.x = Math.sin(t) * swing;
  rightArmPivot.rotation.x = Math.sin(t + Math.PI) * swing;
  leftLegPivot.rotation.x = Math.sin(t + Math.PI) * swing;
  rightLegPivot.rotation.x = Math.sin(t) * swing;

  walkTimer += 0.01;
  if (walkTimer > 3 + Math.random() * 3) {
    walkAngle += (Math.random() - 0.5) * Math.PI * 0.5;
    walkTimer = 0;
  }

  avatar.position.x += Math.cos(walkAngle) * walkSpeed;
  avatar.position.z += Math.sin(walkAngle) * walkSpeed;
  avatar.rotation.y = -walkAngle;

  const dist = Math.sqrt(avatar.position.x ** 2 + avatar.position.z ** 2);
  if (dist > walkRadius) {
    walkAngle += Math.PI + (Math.random() - 0.5) * 0.5;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
