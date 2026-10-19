/**
 * Procedural watch geometry for the product configurator.
 *
 * Everything is built from primitives — no glTF asset, no texture files, nothing
 * to fetch. A 40 mm case is 2 world units, so one unit is 5 mm and the numbers
 * below stay readable against real watch specs.
 */

import * as THREE from 'three';

export type CaseMaterialId = 'steel' | 'gold' | 'titanium' | 'dlc';
export type DialId = 'midnight' | 'slate' | 'ivory' | 'salmon' | 'racing' | 'sunburst';
export type BezelId = 'smooth' | 'fluted' | 'ceramic';
export type StrapId = 'bracelet' | 'leather' | 'rubber' | 'nato';
export type StrapColorId = 'onyx' | 'tan' | 'navy' | 'olive' | 'cream' | 'oxblood';

export interface WatchConfig {
  caseMaterial: CaseMaterialId;
  caseSize: number;
  dial: DialId;
  bezel: BezelId;
  strap: StrapId;
  strapColor: StrapColorId;
}

/*
 * Hex values for the 3D materials. The option chips in the app repeat these as
 * literal Tailwind arbitrary values — Tailwind has to see the class strings at
 * build time, so the two lists are kept in step by hand.
 */
export const CASE_HEX: Record<CaseMaterialId, number> = {
  steel: 0xc9ced8,
  gold: 0xd8b26a,
  titanium: 0x9aa3ad,
  dlc: 0x31363f,
};

export const DIAL_HEX: Record<DialId, number> = {
  midnight: 0x101623,
  slate: 0x3f4756,
  ivory: 0xf1ead9,
  salmon: 0xe0856f,
  racing: 0x1e4636,
  sunburst: 0x1c3f78,
};

export const STRAP_HEX: Record<StrapColorId, number> = {
  onyx: 0x23262d,
  tan: 0xa9793f,
  navy: 0x243a5e,
  olive: 0x4a5233,
  cream: 0xe6dcc8,
  oxblood: 0x5c2320,
};

const metal = (color: number, roughness: number, envMapIntensity = 1.25) =>
  new THREE.MeshStandardMaterial({ color, metalness: 1, roughness, envMapIntensity });

/** Free every geometry and material reachable from an object. */
export function disposeObject(root: THREE.Object3D) {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry?.dispose();
    const material = mesh.material;
    if (Array.isArray(material)) material.forEach((entry) => entry.dispose());
    else material?.dispose();
  });
}

/**
 * One half of the strap. The curve leaves the lug, drops to the resting
 * surface, then curls back inward — the way a bracelet loops when a watch is
 * shot on a display block. Keeping the curl tight is what allows the camera to
 * frame the case without the strap running off both edges of the viewport.
 */
function strapCurve(unit: number, direction: 1 | -1) {
  const start = (unit + 0.3) * direction;
  const d = direction;
  const points = [
    new THREE.Vector3(0, -0.14, start),
    new THREE.Vector3(0, -0.62, start + 0.52 * d),
    new THREE.Vector3(0, -1.12, start + 0.86 * d),
    new THREE.Vector3(0, -1.34, start + 1.0 * d),
    new THREE.Vector3(0, -1.16, start + 0.6 * d),
    new THREE.Vector3(0, -0.62, start + 0.24 * d),
    new THREE.Vector3(0, -0.12, start + 0.46 * d),
  ];
  return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.35);
}

interface StrapOptions {
  unit: number;
  id: StrapId;
  /** Resolved hex for the strap body. */
  color: number;
  /** Resolved hex for the links when the strap is a bracelet. */
  caseColor: number;
}

function buildStrap({ unit, id, color, caseColor }: StrapOptions): THREE.Group {
  const group = new THREE.Group();
  const width = unit * 1.02;
  const thickness = id === 'bracelet' ? 0.34 : id === 'rubber' ? 0.3 : id === 'leather' ? 0.26 : 0.18;
  const segments = 14;

  const bracelet = id === 'bracelet';
  const polished = metal(caseColor, 0.2);
  const satin = metal(caseColor, 0.5, 1.05);
  const body = new THREE.MeshStandardMaterial({
    color,
    metalness: 0,
    roughness: id === 'leather' ? 0.72 : id === 'nato' ? 0.9 : 0.52,
  });

  for (const direction of [1, -1] as const) {
    const curve = strapCurve(unit, direction);
    const length = curve.getLength();

    for (let index = 0; index < segments; index += 1) {
      const t = (index + 0.5) / segments;
      const point = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);
      // Links are separated so the light catches each one; a continuous strap
      // is drawn edge to edge.
      const segment = bracelet ? (length / segments) * 0.82 : (length / segments) * 1.08;

      const geometry = new THREE.BoxGeometry(
        width * (bracelet ? 1 - t * 0.08 : 1),
        thickness,
        segment,
      );
      const material = bracelet ? (index % 2 === 0 ? polished : satin) : body;
      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.copy(point);
      mesh.lookAt(point.clone().add(tangent));

      if (bracelet) mesh.scale.y = 1.15;
      group.add(mesh);
    }
  }

  return group;
}

function buildHand(
  length: number,
  width: number,
  height: number,
  y: number,
  angle: number,
  material: THREE.Material,
  pivot: { x: number; z: number } = { x: 0, z: 0 },
) {
  const geometry = new THREE.BoxGeometry(width, height, length);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(
    pivot.x + Math.sin(angle) * (length / 2),
    y,
    pivot.z - Math.cos(angle) * (length / 2),
  );
  mesh.rotation.y = -angle;
  return mesh;
}

/** Build the complete watch. The caller owns the returned group. */
export function createWatch(config: WatchConfig): THREE.Group {
  const group = new THREE.Group();

  const unit = config.caseSize / 20; // 40 mm → 2.0
  const radius = unit;
  const caseColor = CASE_HEX[config.caseMaterial];

  const polished = metal(caseColor, 0.18);
  const satin = metal(caseColor, 0.44, 1.05);

  // --- case body -----------------------------------------------------------
  const caseMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius * 0.97, 1.02, 72),
    satin,
  );
  group.add(caseMesh);

  const caseEdge = new THREE.Mesh(
    new THREE.CylinderGeometry(radius + 0.03, radius + 0.03, 0.34, 72),
    polished,
  );
  caseEdge.position.y = 0.02;
  group.add(caseEdge);

  // --- lugs ---------------------------------------------------------------
  for (const direction of [1, -1]) {
    const lug = new THREE.Mesh(new THREE.BoxGeometry(1.46, 0.4, 0.58), satin);
    lug.position.set(0, -0.14, (radius + 0.06) * direction);
    group.add(lug);
  }

  // --- crown and chronograph pushers --------------------------------------
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.24, 24), polished);
  crown.rotation.z = Math.PI / 2;
  crown.position.set(radius + 0.14, 0, 0);
  group.add(crown);

  for (const offset of [-0.66, 0.66]) {
    const pusher = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.18, 20), polished);
    pusher.rotation.z = Math.PI / 2;
    pusher.position.set(radius + 0.11, 0, offset * unit);
    group.add(pusher);
  }

  // --- bezel --------------------------------------------------------------
  if (config.bezel === 'fluted') {
    const fluted = metal(caseColor, 0.24);
    fluted.flatShading = true;
    const bezel = new THREE.Mesh(
      new THREE.TorusGeometry(radius - 0.06, 0.14, 6, 78, Math.PI * 2),
      fluted,
    );
    bezel.rotation.x = -Math.PI / 2;
    bezel.position.y = 0.54;
    group.add(bezel);
  } else if (config.bezel === 'ceramic') {
    const ceramic = new THREE.MeshPhysicalMaterial({
      color: 0x14161a,
      metalness: 0.1,
      roughness: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.1,
    });
    const bezel = new THREE.Mesh(
      new THREE.TorusGeometry(radius - 0.05, 0.17, 20, 96),
      ceramic,
    );
    bezel.rotation.x = -Math.PI / 2;
    bezel.position.y = 0.5;
    group.add(bezel);
  } else {
    const bezel = new THREE.Mesh(
      new THREE.TorusGeometry(radius - 0.08, 0.11, 18, 96),
      polished,
    );
    bezel.rotation.x = -Math.PI / 2;
    bezel.position.y = 0.53;
    group.add(bezel);
  }

  // --- dial ---------------------------------------------------------------
  const sunburst = config.dial === 'sunburst';
  const dialMaterial = new THREE.MeshStandardMaterial({
    color: DIAL_HEX[config.dial],
    metalness: sunburst ? 0.72 : 0.18,
    roughness: sunburst ? 0.26 : 0.68,
    envMapIntensity: sunburst ? 1.4 : 0.8,
  });
  const dial = new THREE.Mesh(
    new THREE.CylinderGeometry(radius - 0.17, radius - 0.17, 0.06, 72),
    dialMaterial,
  );
  dial.position.y = 0.44;
  group.add(dial);

  // --- hour markers -------------------------------------------------------
  const markerGeometry = new THREE.BoxGeometry(0.062, 0.05, 0.24);
  const markerMaterial =
    config.dial === 'ivory' ? metal(caseColor, 0.2) : metal(0xd7dce6, 0.16);

  for (let index = 0; index < 12; index += 1) {
    if (index === 0 || index === 6) continue; // 12 gets a double, 6 hosts the sub-dial
    const angle = (index / 12) * Math.PI * 2;
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.set(
      Math.sin(angle) * (radius - 0.36),
      0.48,
      -Math.cos(angle) * (radius - 0.36),
    );
    marker.rotation.y = -angle;
    group.add(marker);
  }

  for (const offset of [-0.12, 0.12]) {
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.set(offset, 0.48, -(radius - 0.36));
    group.add(marker);
  }

  // --- date aperture at 3 -------------------------------------------------
  const aperture = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.03, 0.28),
    new THREE.MeshStandardMaterial({ color: 0xece5d6, metalness: 0, roughness: 0.9 }),
  );
  aperture.position.set(radius - 0.52, 0.48, 0);
  group.add(aperture);

  // --- 30-minute sub-dial at 6 -------------------------------------------
  const subDialZ = radius - 0.78;
  const subDial = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.42, 0.02, 48),
    new THREE.MeshStandardMaterial({
      color: sunburst ? 0x2b4a86 : DIAL_HEX[config.dial],
      metalness: 0.3,
      roughness: 0.6,
    }),
  );
  subDial.position.set(0, 0.47, subDialZ);
  group.add(subDial);

  group.add(
    buildHand(0.34, 0.045, 0.02, 0.5, Math.PI * 1.05, markerMaterial, { x: 0, z: subDialZ }),
  );

  // --- hands at ten past ten ---------------------------------------------
  const hourAngle = ((10 + 10 / 60) / 12) * Math.PI * 2;
  const minuteAngle = (10 / 60) * Math.PI * 2;
  const secondAngle = (35 / 60) * Math.PI * 2;

  group.add(buildHand(1.02, 0.14, 0.06, 0.53, hourAngle, polished));
  group.add(buildHand(1.46, 0.1, 0.05, 0.56, minuteAngle, polished));

  const secondMaterial = new THREE.MeshStandardMaterial({ color: 0xc4482f, metalness: 0.3, roughness: 0.4 });
  const secondHand = buildHand(1.62, 0.032, 0.03, 0.59, secondAngle, secondMaterial);
  group.add(secondHand);

  // A pivot circle at the centre of the dial reads as the hand stack.
  const pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.08, 24), polished);
  pivot.position.y = 0.6;
  group.add(pivot);

  // --- crystal ------------------------------------------------------------
  const crystal = new THREE.Mesh(
    new THREE.CylinderGeometry(radius - 0.1, radius - 0.12, 0.08, 72),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.03,
      transparent: true,
      opacity: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      envMapIntensity: 1.6,
    }),
  );
  crystal.position.y = 0.63;
  group.add(crystal);

  // --- strap --------------------------------------------------------------
  const bracelet = config.strap === 'bracelet';
  group.add(
    buildStrap({
      unit,
      id: config.strap,
      color: bracelet ? caseColor : STRAP_HEX[config.strapColor],
      caseColor,
    }),
  );

  group.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });

  return group;
}
