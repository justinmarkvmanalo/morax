import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';

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
avatar.userData.baseY = 0;
scene.add(avatar);
let textOffsetY = 2.0;

function splitMesh(geo) {
  const pos = geo.getAttribute('position');
  const idx = geo.getIndex();
  const vc = pos.count;
  const getI = (i) => idx ? idx.getX(i) : i;
  const fc = idx ? idx.count / 3 : vc / 3;

  const bbox = new THREE.Box3();
  for (let i = 0; i < vc; i++) bbox.expandByPoint(new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)));
  const min = bbox.min, max = bbox.max;
  const sz = bbox.getSize(new THREE.Vector3());

  const partNames = ['body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
  const parts = {};
  for (const n of partNames) parts[n] = { inds: [], vmap: new Map() };

  function classify(cx, cy) {
    const rx = (cx - min.x) / sz.x;
    const ry = (cy - min.y) / sz.y;
    if (ry > 0.4) {
      if (rx < 0.3) return 'leftArm';
      if (rx > 0.7) return 'rightArm';
    }
    if (ry < 0.35) {
      if (rx < 0.4) return 'leftLeg';
      if (rx > 0.6) return 'rightLeg';
    }
    return 'body';
  }

  for (let f = 0; f < fc; f++) {
    const i0 = getI(f * 3), i1 = getI(f * 3 + 1), i2 = getI(f * 3 + 2);
    const cx = (pos.getX(i0) + pos.getX(i1) + pos.getX(i2)) / 3;
    const cy = (pos.getY(i0) + pos.getY(i1) + pos.getY(i2)) / 3;
    const part = classify(cx, cy);
    const d = parts[part];
    for (const vi of [i0, i1, i2]) {
      if (!d.vmap.has(vi)) d.vmap.set(vi, d.vmap.size);
      d.inds.push(d.vmap.get(vi));
    }
  }

  const result = {};
  const attrNames = ['position', 'normal', 'color', 'uv'];
  for (const n of partNames) {
    const d = parts[n];
    if (d.inds.length === 0) { result[n] = null; continue; }
    const g = new THREE.BufferGeometry();
    const lc = d.vmap.size;
    for (const an of attrNames) {
      if (!geo.hasAttribute(an)) continue;
      const src = geo.getAttribute(an);
      const is = src.itemSize;
      const arr = new Float32Array(lc * is);
      for (const [oi, li] of d.vmap) {
        for (let c = 0; c < is; c++) arr[li * is + c] = src.array[oi * is + c];
      }
      g.setAttribute(an, new THREE.BufferAttribute(arr, is));
    }
    g.setIndex(d.inds);
    g.computeVertexNormals();
    result[n] = g;
  }
  return result;
}

const plyLoader = new PLYLoader();
plyLoader.load('mhr_model.ply', (geo) => {
  geo.computeVertexNormals();

  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xcccccc,
    roughness: 0.4,
    metalness: 0.1,
    clearcoat: 0.05,
    flatShading: false,
  });
  if (geo.hasAttribute('color')) mat.vertexColors = true;

  const split = splitMesh(geo);
  const bodyGroup = new THREE.Group();
  avatar.userData.limbs = {};

  const tmpMesh = new THREE.Mesh(geo);
  const box = new THREE.Box3().setFromObject(tmpMesh);
  const min = box.min, max = box.max;
  const sz = box.getSize(new THREE.Vector3());
  const cz = (min.z + max.z) / 2;

  const joints = {
    leftArm: new THREE.Vector3(min.x + sz.x * 0.22, min.y + sz.y * 0.68, cz),
    rightArm: new THREE.Vector3(max.x - sz.x * 0.22, min.y + sz.y * 0.68, cz),
    leftLeg: new THREE.Vector3(min.x + sz.x * 0.3, min.y + sz.y * 0.28, cz),
    rightLeg: new THREE.Vector3(max.x - sz.x * 0.3, min.y + sz.y * 0.28, cz),
  };

  for (const name of ['body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg']) {
    const g = split[name];
    if (!g) continue;
    const m = new THREE.Mesh(g, mat);
    m.castShadow = true;
    m.receiveShadow = true;

    if (name === 'body') {
      bodyGroup.add(m);
    } else {
      const pivot = new THREE.Group();
      pivot.position.copy(joints[name]);
      m.position.copy(joints[name]).negate();
      pivot.add(m);
      bodyGroup.add(pivot);
      avatar.userData.limbs[name] = pivot;
    }
  }

  avatar.add(bodyGroup);

  const box2 = new THREE.Box3().setFromObject(avatar);
  const size = box2.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 1.5 / maxDim;
  avatar.scale.set(scale, scale, scale);

  box2.setFromObject(avatar);
  const center = box2.getCenter(new THREE.Vector3());
  avatar.position.y = -center.y;
  avatar.userData.baseY = avatar.position.y;

  const top = box2.max.y - center.y;
  textOffsetY = top + 0.3;
});

const keys = { KeyW: false, KeyA: false, KeyS: false, KeyD: false };
window.addEventListener('keydown', (e) => { if (e.code in keys) keys[e.code] = true; });
window.addEventListener('keyup', (e) => { if (e.code in keys) keys[e.code] = false; });

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
  keys.KeyW = dy < -8;
  keys.KeyS = dy > 8;
  keys.KeyA = dx < -8;
  keys.KeyD = dx > 8;
}

function jEnd(e) {
  e.preventDefault();
  jActive = false;
  knob.style.transform = 'translate(-50%, -50%)';
  keys.KeyW = keys.KeyA = keys.KeyS = keys.KeyD = false;
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
  const floatOffset = Math.sin(t * 0.3) * 0.08;
  avatar.position.y = avatar.userData.baseY + floatOffset;
  if (textMesh) {
    textMesh.position.x = avatar.position.x;
    textMesh.position.z = avatar.position.z;
    textMesh.position.y = avatar.position.y + textOffsetY;
  }

  let dx = 0, dz = 0;
  if (keys.KeyW) dz -= 1;
  if (keys.KeyS) dz += 1;
  if (keys.KeyA) dx -= 1;
  if (keys.KeyD) dx += 1;
  const moving = dx !== 0 || dz !== 0;
  if (moving) {
    const angle = Math.atan2(dz, dx);
    avatar.position.x += Math.cos(angle) * 0.03;
    avatar.position.z += Math.sin(angle) * 0.03;
    avatar.rotation.y = -angle + Math.PI / 2;
  }

  const limbs = avatar.userData.limbs;
  if (limbs) {
    const swingSpeed = moving ? 8 : 2;
    const swingAmount = moving ? 0.5 : 0.05;
    const s = Math.sin(t * swingSpeed);
    if (limbs.leftArm) limbs.leftArm.rotation.y = -s * swingAmount;
    if (limbs.rightArm) limbs.rightArm.rotation.y = s * swingAmount;
    if (limbs.leftLeg) limbs.leftLeg.rotation.x = -s * swingAmount * 0.7;
    if (limbs.rightLeg) limbs.rightLeg.rotation.x = s * swingAmount * 0.7;
  }

  controls.target.lerp(avatar.position, 0.05);
  controls.update();
  renderer.render(scene, camera);
}

animate();
