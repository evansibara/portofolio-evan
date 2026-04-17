/* eslint-disable react/no-unknown-property */
/**
 * Lanyard — React Bits official implementation (Three.js + R3F + Rapier)
 *
 * ═══════════════════════════════════════════════════════════════════
 * REVISI TEXTURE MAPPING — fix foto ter-mirror & ter-zoom:
 *
 *   Masalah sebelumnya:
 *     1. `rotation = Math.PI` + `flipY = true` → double-flip membuat
 *        foto ter-mirror horizontal (teks terbaca mundur).
 *     2. Strategi FIT (letterbox) membuat foto portrait tidak mengisi
 *        kartu penuh, wajah terlihat kecil & off-center.
 *
 *   Solusi sekarang:
 *     1. Pakai `rotation = Math.PI` saja, `flipY = false` → orientasi
 *        benar, tidak mirror.
 *     2. Strategi COVER (bukan FIT) dengan offset vertikal ke atas
 *        agar area wajah (bagian atas foto) terbingkai di kartu,
 *        bukan area bawah (tubuh/kaki).
 *
 *   UV range permukaan kartu GLB (hasil inspeksi):
 *     U: 0 → 1.0
 *     V: 0 → 0.757   (BUKAN 0 → 1!)
 *   → kompensasi via `repeat.y` atau `repeat.x` (tergantung rotation).
 *     Setelah rotation 180°, sumbu X dan Y tertukar secara visual,
 *     jadi kompensasi diterapkan pada sumbu yang sesuai.
 *
 *   FACE_FOCUS: parameter 0.0–1.0 menentukan bagian foto mana yang
 *   jadi pusat bingkai. 0.5 = tengah foto, < 0.5 = geser ke atas
 *   (cocok untuk foto full-body, supaya wajah kelihatan).
 * ═══════════════════════════════════════════════════════════════════
 */
'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

import cardGLB from '../assets/lanyard/card.glb';
import profileImg from '../assets/lanyard/profile.jpg';

extend({ MeshLineGeometry, MeshLineMaterial });

// Inline CSS injection
const STYLE_ID = 'lanyard-style';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const styleEl = document.createElement('style');
  styleEl.id = STYLE_ID;
  styleEl.textContent = `
    .lanyard-wrapper {
      position: relative;
      z-index: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: scale(1);
      transform-origin: center;
    }
  `;
  document.head.appendChild(styleEl);
}

// Generator texture teks untuk tali
function createTextTexture(text, bandColor, textColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = bandColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = textColor;
  ctx.font = 'bold 56px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText(text, canvas.width * 0.25, canvas.height / 2);
  ctx.fillText(text, canvas.width * 0.75, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  cardTexture = profileImg,
  bandColor = '#000000',
  bandText = 'EVAN',
  bandTextColor = '#ffffff',
  cardScale = 2.4,
  /**
   * FACE_FOCUS — posisi vertikal bagian foto yang jadi pusat bingkai.
   * 0.0 = paling atas foto (wajah untuk full-body portrait),
   * 0.5 = tengah foto, 1.0 = paling bawah foto.
   * Default 0.25 = 25% dari atas (cocok untuk foto full-body dengan
   * wajah di bagian atas).
   */
  faceFocus = 0.25,
  /**
   * HORIZONTAL_SHIFT — geser foto horizontal di dalam bingkai kartu.
   * -0.5 = maksimal ke kiri, 0 = tengah, +0.5 = maksimal ke kanan.
   */
  horizontalShift = 0,
  /**
   * TEXTURE_FLIP_Y — kontrol flip vertikal texture.
   * true = default THREE (image row 0 di UV V=1).
   * false = image row 0 di UV V=0.
   * Kalau foto keluar upside-down, toggle ini.
   */
  textureFlipY = true,
  /**
   * TEXTURE_ROTATION — rotasi texture dalam radian.
   * 0 = tanpa rotasi, Math.PI = 180°, Math.PI/2 = 90° CCW, -Math.PI/2 = 90° CW.
   * Kalau foto terlihat miring, tweak ini.
   */
  textureRotation = 0,
  /**
   * TEXTURE_MIRROR_X — mirror horizontal texture (jika teks terbaca mundur).
   * true = mirror, false = normal.
   */
  textureMirrorX = false,
}) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band
            isMobile={isMobile}
            cardTexture={cardTexture}
            bandColor={bandColor}
            bandText={bandText}
            bandTextColor={bandTextColor}
            cardScale={cardScale}
            faceFocus={faceFocus}
            horizontalShift={horizontalShift}
            textureFlipY={textureFlipY}
            textureRotation={textureRotation}
            textureMirrorX={textureMirrorX}
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  cardTexture,
  bandColor,
  bandText,
  bandTextColor,
  cardScale = 2.4,
  faceFocus = 0.25,
  horizontalShift = 0,
  textureFlipY = true,
  textureRotation = 0,
  textureMirrorX = false,
}) {
  const band = useRef(),
    fixed = useRef(),
    j1 = useRef(),
    j2 = useRef(),
    j3 = useRef(),
    card = useRef();
  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3(),
    dir = new THREE.Vector3();
  const segmentProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF(cardGLB);
  const profileTex = useTexture(cardTexture);

  const bandTexture = useMemo(
    () => createTextTexture(bandText, bandColor, bandTextColor),
    [bandText, bandColor, bandTextColor]
  );

  // ═══════════════════════════════════════════════════════════════════
  // UV FIX — texture mapping untuk foto profile:
  //
  //   PROBLEM BAR STRIP: sebelumnya repeat.x atau repeat.y di-set > 1
  //   (misal 1/0.757 = 1.321) untuk kompensasi UV_V_MAX. Dengan
  //   ClampToEdgeWrapping, sampling di luar [0,1] akan "ngelus" piksel
  //   edge → muncul bar strip hijau/putih di sisi foto.
  //
  //   FIX: repeat selalu ≤ 1, offset ≥ 0. Kompensasi UV_V_MAX dilakukan
  //   dengan MEMPERBESAR visible area texture (bukan repeat >1), yaitu:
  //   repeat.y = UV_V_MAX artinya 75.7% tinggi texture ter-map ke
  //   permukaan kartu. Area ini selalu di dalam UV [0,1] valid range.
  //
  //   ORIENTASI: semua kontrol via props `textureFlipY`, `textureRotation`,
  //   dan `textureMirrorX`. Kalau foto keluar salah orientasi, tinggal
  //   toggle dari Hero.jsx tanpa edit Lanyard.jsx.
  //
  //   Kombinasi orientasi yang perlu dicoba (urutan test rekomendasi):
  //     A) flipY=true,  rotation=0,  mirrorX=false  → "paling default"
  //     B) flipY=true,  rotation=Math.PI, mirrorX=false
  //     C) flipY=false, rotation=0,  mirrorX=false
  //     D) flipY=true,  rotation=0,  mirrorX=true
  //     E) flipY=false, rotation=Math.PI, mirrorX=false
  //     ... dst.
  // ═══════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!profileTex || !profileTex.image) return;

    profileTex.colorSpace = THREE.SRGBColorSpace;
    profileTex.anisotropy = 16;
    profileTex.wrapS = THREE.ClampToEdgeWrapping;
    profileTex.wrapT = THREE.ClampToEdgeWrapping;

    profileTex.flipY = textureFlipY;
    profileTex.center.set(0.5, 0.5);
    profileTex.rotation = textureRotation;

    // UV range permukaan kartu GLB (hasil inspeksi card.glb):
    const UV_V_MAX = 0.757;

    const imgW = profileTex.image.naturalWidth || profileTex.image.width;
    const imgH = profileTex.image.naturalHeight || profileTex.image.height;

    const IMG_ASPECT = imgH / imgW;                // foto
    const CARD_ASPECT = 1 / UV_V_MAX;              // 1.321 (kartu portrait)

    // Strategi COVER: foto mengisi kartu penuh, crop bagian yang keluar.
    // repeat selalu ≤ 1 → tidak ada bleeding/bar strip.

    let repeatX, repeatY, offsetX, offsetY;

    if (IMG_ASPECT > CARD_ASPECT) {
      // Foto lebih portrait dari kartu → crop vertikal.
      const visibleV = CARD_ASPECT / IMG_ASPECT;
      repeatX = 1;
      repeatY = visibleV * UV_V_MAX;

      // Offset Y untuk face-focus.
      if (textureFlipY) {
        offsetY = (UV_V_MAX - repeatY) * (1 - faceFocus);
      } else {
        offsetY = (UV_V_MAX - repeatY) * faceFocus;
      }
      // Offset X = 0 (full lebar foto), tapi bisa digeser sedikit
      // via horizontalShift kalau user mau fine-tune.
      // Karena repeatX = 1, tidak ada ruang shift. Shift hanya berefek
      // jika foto di-crop horizontal (kasus else di bawah).
      offsetX = 0;
    } else {
      // Foto lebih landscape dari kartu → crop horizontal (center + shift).
      const visibleU = IMG_ASPECT / CARD_ASPECT;
      repeatX = visibleU;
      repeatY = UV_V_MAX;

      const centerX = (1 - visibleU) / 2;
      offsetX = centerX + horizontalShift * (1 - visibleU);
      offsetX = Math.max(0, Math.min(1 - visibleU, offsetX));
      offsetY = 0;
    }

    // Mirror horizontal: flip U axis.
    if (textureMirrorX) {
      profileTex.repeat.set(-repeatX, repeatY);
      profileTex.offset.set(offsetX + repeatX, offsetY);
    } else {
      profileTex.repeat.set(repeatX, repeatY);
      profileTex.offset.set(offsetX, offsetY);
    }

    profileTex.needsUpdate = true;
  }, [profileTex, faceFocus, horizontalShift, textureFlipY, textureRotation, textureMirrorX]);

  useEffect(() => {
    return () => {
      bandTexture.dispose();
    };
  }, [bandTexture]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider
            args={[
              0.8 * (cardScale / 2.25),
              1.125 * (cardScale / 2.25),
              0.01,
            ]}
          />
          <group
            scale={cardScale}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (
              e.target.releasePointerCapture(e.pointerId), drag(false)
            )}
            onPointerDown={(e) => (
              e.target.setPointerCapture(e.pointerId),
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation()))
              )
            )}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={profileTex}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={bandTexture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}