import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(8, 5, 12);
camera.lookAt(0, 0.75, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.75, 0);
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

const skinMat = new THREE.MeshPhysicalMaterial({ color: 0xf0c8a0, roughness: 0.35, metalness: 0.0, clearcoat: 0.05 });
const clothMat = new THREE.MeshPhysicalMaterial({ color: 0x2c2c3a, roughness: 0.7, metalness: 0.0 });
const pantsMat = new THREE.MeshPhysicalMaterial({ color: 0x1a1a2e, roughness: 0.8, metalness: 0.0 });
const shoeMat = new THREE.MeshPhysicalMaterial({ color: 0x222233, roughness: 0.5, metalness: 0.1 });
const eyeWhiteMat = new THREE.MeshPhysicalMaterial({ color: 0xf8f8f8, roughness: 0.2, metalness: 0.0 });
const pupilMat = new THREE.MeshPhysicalMaterial({ color: 0x222222, roughness: 0.1, metalness: 0.0 });
const hairMat = new THREE.MeshPhysicalMaterial({ color: 0x3d2b1f, roughness: 0.9, metalness: 0.0 });
const browMat = new THREE.MeshPhysicalMaterial({ color: 0x3d2b1f, roughness: 0.9, metalness: 0.0 });
const lipMat = new THREE.MeshPhysicalMaterial({ color: 0xcc7777, roughness: 0.4, metalness: 0.0 });
const beltMat = new THREE.MeshPhysicalMaterial({ color: 0x553322, roughness: 0.7, metalness: 0.2 });

const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), skinMat);
head.position.y = 1.85;
head.scale.y = 1.08;
head.castShadow = true;
avatar.add(head);

const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.12, 16), skinMat);
neck.position.y = 1.57;
neck.castShadow = true;
avatar.add(neck);

const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.62, 1.15, 20), clothMat);
torso.position.y = 0.92;
torso.castShadow = true;
avatar.add(torso);

const leftShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 16), clothMat);
leftShoulder.position.set(-0.76, 1.46, 0);
leftShoulder.scale.set(1, 0.7, 0.7);
leftShoulder.castShadow = true;
avatar.add(leftShoulder);

const rightShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 16), clothMat);
rightShoulder.position.set(0.76, 1.46, 0);
rightShoulder.scale.set(1, 0.7, 0.7);
rightShoulder.castShadow = true;
avatar.add(rightShoulder);

const belt = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.045, 10, 28), beltMat);
belt.position.y = 0.38;
belt.rotation.x = Math.PI / 2;
belt.castShadow = true;
avatar.add(belt);

const hairTop = new THREE.Mesh(new THREE.SphereGeometry(0.51, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.45), hairMat);
hairTop.position.set(0, 1.98, 0.04);
hairTop.scale.set(1.02, 0.42, 1.06);
hairTop.castShadow = true;
avatar.add(hairTop);

const hairSideL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), hairMat);
hairSideL.position.set(-0.47, 1.84, 0.32);
hairSideL.scale.set(0.7, 0.55, 0.35);
hairSideL.rotation.z = 0.12;
hairSideL.castShadow = true;
avatar.add(hairSideL);

const hairSideR = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), hairMat);
hairSideR.position.set(0.47, 1.84, 0.32);
hairSideR.scale.set(0.7, 0.55, 0.35);
hairSideR.rotation.z = -0.12;
hairSideR.castShadow = true;
avatar.add(hairSideR);

const eyeGeo = new THREE.SphereGeometry(0.085, 16, 16);
const leftEye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
leftEye.position.set(-0.16, 1.92, 0.45);
leftEye.scale.set(1, 0.75, 0.25);
avatar.add(leftEye);

const rightEye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
rightEye.position.set(0.16, 1.92, 0.45);
rightEye.scale.set(1, 0.75, 0.25);
avatar.add(rightEye);

const pupilGeo = new THREE.SphereGeometry(0.04, 12, 12);
const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
leftPupil.position.set(-0.16, 1.91, 0.49);
leftPupil.scale.set(1, 0.75, 0.15);
avatar.add(leftPupil);

const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
rightPupil.position.set(0.16, 1.91, 0.49);
rightPupil.scale.set(1, 0.75, 0.15);
avatar.add(rightPupil);

const browGeo = new THREE.BoxGeometry(0.13, 0.022, 0.025);
const leftBrow = new THREE.Mesh(browGeo, browMat);
leftBrow.position.set(-0.16, 2.01, 0.44);
leftBrow.rotation.z = 0.06;
avatar.add(leftBrow);

const rightBrow = new THREE.Mesh(browGeo, browMat);
rightBrow.position.set(0.16, 2.01, 0.44);
rightBrow.rotation.z = -0.06;
avatar.add(rightBrow);

const nose = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 10), skinMat);
nose.position.set(0, 1.86, 0.49);
nose.scale.set(1, 0.7, 0.4);
avatar.add(nose);

const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.018, 0.035), lipMat);
mouth.position.set(0, 1.76, 0.49);
mouth.rotation.x = 0.08;
avatar.add(mouth);

const leftHip = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), pantsMat);
leftHip.position.set(-0.32, 0.65, 0);
leftHip.scale.set(1.3, 0.6, 0.8);
leftHip.castShadow = true;
avatar.add(leftHip);

const rightHip = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), pantsMat);
rightHip.position.set(0.32, 0.65, 0);
rightHip.scale.set(1.3, 0.6, 0.8);
rightHip.castShadow = true;
avatar.add(rightHip);

const armMat = clothMat;
const armLen = 0.75;
const armHalf = armLen / 2;
const legLen = 0.7;
const legHalf = legLen / 2;

const leftArmPivot = new THREE.Group();
leftArmPivot.position.set(-0.82, 1.5, 0);
avatar.add(leftArmPivot);

const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, armLen, 14), armMat);
leftArm.position.set(0, -armHalf, 0);
leftArm.rotation.z = 0.15;
leftArm.castShadow = true;
leftArmPivot.add(leftArm);

const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), skinMat);
leftHand.position.set(0, -armLen - 0.02, 0.04);
leftHand.scale.set(1, 0.85, 0.7);
leftHand.castShadow = true;
leftArmPivot.add(leftHand);

const rightArmPivot = new THREE.Group();
rightArmPivot.position.set(0.82, 1.5, 0);
avatar.add(rightArmPivot);

const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, armLen, 14), armMat);
rightArm.position.set(0, -armHalf, 0);
rightArm.rotation.z = -0.15;
rightArm.castShadow = true;
rightArmPivot.add(rightArm);

const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), skinMat);
rightHand.position.set(0, -armLen - 0.02, -0.04);
rightHand.scale.set(1, 0.85, 0.7);
rightHand.castShadow = true;
rightArmPivot.add(rightHand);

const leftLegPivot = new THREE.Group();
leftLegPivot.position.set(-0.32, 0.65, 0);
avatar.add(leftLegPivot);

const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, legLen, 14), pantsMat);
leftLeg.position.set(0, -legHalf, 0);
leftLeg.castShadow = true;
leftLegPivot.add(leftLeg);

const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.1, 0.4), shoeMat);
leftFoot.position.set(0, -legLen - 0.05, 0.04);
leftFoot.castShadow = true;
leftLegPivot.add(leftFoot);

const rightLegPivot = new THREE.Group();
rightLegPivot.position.set(0.32, 0.65, 0);
avatar.add(rightLegPivot);

const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, legLen, 14), pantsMat);
rightLeg.position.set(0, -legHalf, 0);
rightLeg.castShadow = true;
rightLegPivot.add(rightLeg);

const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.1, 0.4), shoeMat);
rightFoot.position.set(0, -legLen - 0.05, -0.04);
rightFoot.castShadow = true;
rightLegPivot.add(rightFoot);

scene.add(avatar);
avatar.scale.set(0.6, 0.6, 0.6);

const keys = { w: false, a: false, s: false, d: false };
window.addEventListener('keydown', (e) => { if (e.key in keys) keys[e.key] = true; });
window.addEventListener('keyup', (e) => { if (e.key in keys) keys[e.key] = false; });

const jEl = document.getElementById('joystick');
const knob = document.getElementById('joystickKnob');
let jActive = false;
const jMax = 30;

function jStart(e) {
  e.preventDefault();
  jActive = true;
}

function jMove(e) {
  e.preventDefault();
  if (!jActive) return;
  const t = e.touches ? e.touches[0] : e;
  const r = jEl.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  let dx = t.clientX - cx;
  let dy = t.clientY - cy;
  const d = Math.sqrt(dx * dx + dy * dy);
  if (d > jMax) { dx = dx / d * jMax; dy = dy / d * jMax; }
  knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
  keys.w = dy < -8;
  keys.s = dy > 8;
  keys.a = dx < -8;
  keys.d = dx > 8;
}

function jEnd(e) {
  e.preventDefault();
  jActive = false;
  knob.style.transform = 'translate(-50%, -50%)';
  keys.w = keys.a = keys.s = keys.d = false;
}

jEl.addEventListener('mousedown', jStart);
window.addEventListener('mousemove', jMove);
window.addEventListener('mouseup', jEnd);
jEl.addEventListener('touchstart', jStart, { passive: false });
window.addEventListener('touchmove', jMove, { passive: false });
window.addEventListener('touchend', jEnd, { passive: false });
window.addEventListener('touchcancel', jEnd, { passive: false });

let textMesh = null;
const loader = new FontLoader();
loader.load('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/fonts/helvetiker_bold.typeface.json', (font) => {
  const textGeo = new TextGeometry('MORAX', {
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
  textMesh = new THREE.Mesh(textGeo, textMat);
  textMesh.position.set(-cx, 1.65, 0);
  textMesh.castShadow = true;
  scene.add(textMesh);
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
  if (textMesh) {
    textMesh.position.x = avatar.position.x;
    textMesh.position.z = avatar.position.z;
  }

  let dx = 0, dz = 0;
  if (keys.w) dz -= 1;
  if (keys.s) dz += 1;
  if (keys.a) dx -= 1;
  if (keys.d) dx += 1;
  const moving = dx !== 0 || dz !== 0;
  if (moving) {
    const angle = Math.atan2(dz, dx);
    avatar.position.x += Math.cos(angle) * 0.03;
    avatar.position.z += Math.sin(angle) * 0.03;
    avatar.rotation.y = -angle + Math.PI / 2;
  }

  const swing = moving ? 0.5 : 0;
  leftArmPivot.rotation.x = Math.sin(t * (moving ? 1 : 0)) * swing;
  rightArmPivot.rotation.x = Math.sin(t * (moving ? 1 : 0) + Math.PI) * swing;
  leftLegPivot.rotation.x = Math.sin(t * (moving ? 1 : 0) + Math.PI) * swing;
  rightLegPivot.rotation.x = Math.sin(t * (moving ? 1 : 0)) * swing;

  controls.update();
  renderer.render(scene, camera);
}

animate();
