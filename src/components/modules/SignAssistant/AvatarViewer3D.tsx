import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCw, ZoomIn, ZoomOut, Info, AlertTriangle, Eye, Sparkles } from 'lucide-react';
import { AvatarGender } from '../../../types';
import { AnimationState } from './AvatarAnimationController';

interface AvatarViewer3DProps {
  gender: AvatarGender;
  animationState?: AnimationState;
  activeSignName?: string;
  speed?: number;
}

export const AvatarViewer3D: React.FC<AvatarViewer3DProps> = ({
  gender,
  animationState = 'idle',
  activeSignName,
  speed = 1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [wireframe, setWireframe] = useState<boolean>(false);

  const modelRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const trajectoryGroupRef = useRef<THREE.Group | null>(null);
  const defaultCamPos = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 1.25, z: 2.1 });

  const modelPath = gender === 'female' ? '/women.glb' : '/men.glb';
  const modelName = gender === 'female' ? 'Malika (3D GLB Model)' : 'Jasur (3D GLB Model)';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setIsLoading(true);
    setLoadProgress(0);
    setLoadError(null);

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF7F3E9); // Warm cream

    const width = container.clientWidth;
    const height = container.clientHeight || 480;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.25, 2.1);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clear previous canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.0;
    controls.maxDistance = 4.2;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.target.set(0, 1.15, 0); // Focus on upper chest and signing hands
    controls.update();
    controlsRef.current = controls;

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.0);
    keyLight.position.set(2, 4, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe6f0ff, 1.2);
    fillLight.position.set(-2, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfff0dd, 1.5);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // Dynamic signing gesture indicator light
    const signLight = new THREE.PointLight(0x2F6B4F, 0.8, 4);
    signLight.position.set(0, 1.2, 1.0);
    scene.add(signLight);

    // Ground Grid
    const grid = new THREE.GridHelper(4, 20, 0x2F6B4F, 0xE9DDC9);
    grid.position.y = -0.01;
    scene.add(grid);

    // 3D Gesture Trajectory Arc (Visualizing signing path)
    const trajectoryGroup = new THREE.Group();
    scene.add(trajectoryGroup);
    trajectoryGroupRef.current = trajectoryGroup;

    // Load GLB Model
    const loader = new GLTFLoader();
    let currentModel: THREE.Group | null = null;
    let animationFrameId: number;

    loader.load(
      modelPath,
      (gltf) => {
        currentModel = gltf.scene;
        modelRef.current = currentModel;

        // Auto-frame bounds
        const box = new THREE.Box3().setFromObject(currentModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        currentModel.position.x = -center.x;
        currentModel.position.z = -center.z;
        currentModel.position.y = -box.min.y;

        currentModel.traverse((node: any) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            if (node.material) {
              node.material.roughness = 0.55;
              node.material.metalness = 0.1;
            }
          }
        });

        scene.add(currentModel);

        // Frame camera focusing on chest and signing hands
        const chestHeight = box.max.y * 0.70;
        controls.target.set(0, chestHeight, 0);
        camera.position.set(0, chestHeight + 0.08, Math.max(size.y * 0.88, 1.75));
        defaultCamPos.current = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
        controls.update();

        setIsLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadProgress(Math.round((xhr.loaded / xhr.total) * 100));
        } else {
          setLoadProgress((prev) => Math.min(prev + 20, 95));
        }
      },
      (err) => {
        console.error('Error loading GLB:', err);
        setLoadError('3D model faylini yuklashda xatolik yuz berdi. 2D rejimiga o‘tishingiz mumkin.');
        setIsLoading(false);
      }
    );

    // Animation Loop with state awareness
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (currentModel) {
        if (animationState === 'signing') {
          // Signing articulation: rhythmic upper-body motion & hand presence
          const motionRate = 2.4 * speed;
          currentModel.position.y = -0.01 + Math.sin(elapsed * motionRate) * 0.008;
          currentModel.rotation.y = Math.sin(elapsed * (motionRate * 0.5)) * 0.02;
          signLight.intensity = 1.4 + Math.sin(elapsed * motionRate) * 0.5;
        } else if (animationState === 'listening') {
          // Listening attentive tilt
          currentModel.position.y = -0.01 + Math.sin(elapsed * 3) * 0.003;
          currentModel.rotation.z = Math.sin(elapsed * 1.5) * 0.015;
          signLight.intensity = 0.4;
        } else if (animationState === 'paused') {
          // Frozen pose
          signLight.intensity = 0.2;
        } else {
          // Idle breathing
          currentModel.position.y = -0.01 + Math.sin(elapsed * 1.4) * 0.004;
          currentModel.rotation.y = 0;
          currentModel.rotation.z = 0;
          signLight.intensity = 0.5;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [gender, modelPath]);

  // Wireframe toggle
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((node: any) => {
        if (node.isMesh && node.material) {
          node.material.wireframe = wireframe;
        }
      });
    }
  }, [wireframe]);

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(
        defaultCamPos.current.x,
        defaultCamPos.current.y,
        defaultCamPos.current.z
      );
      controlsRef.current.target.set(0, defaultCamPos.current.y - 0.1, 0);
      controlsRef.current.update();
    }
  };

  const handleZoom = (delta: number) => {
    if (cameraRef.current && controlsRef.current) {
      const dir = new THREE.Vector3();
      cameraRef.current.getWorldDirection(dir);
      cameraRef.current.position.addScaledVector(dir, delta);
      controlsRef.current.update();
    }
  };

  return (
    <div className="relative w-full h-[460px] sm:h-[500px] bg-gradient-to-b from-surdo-cream to-surdo-beige/60 rounded-3xl overflow-hidden border border-surdo-beige shadow-inner flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-surdo-cream/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
          <div className="w-12 h-12 border-4 border-surdo-forest/20 border-t-surdo-forest rounded-full animate-spin mb-4" />
          <h4 className="text-base font-bold text-surdo-forest font-display">
            {modelName} yuklanmoqda...
          </h4>
          <p className="text-xs text-surdo-brown mt-1">
            Yuqori sifatli 3D mesh ({loadProgress}%)
          </p>
          <div className="w-48 h-2 bg-surdo-beige rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-surdo-forest rounded-full transition-all duration-300"
              style={{ width: `${Math.max(loadProgress, 10)}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {loadError && (
        <div className="absolute inset-0 bg-surdo-cream flex flex-col items-center justify-center p-6 text-center z-20">
          <AlertTriangle className="w-10 h-10 text-amber-600 mb-2" />
          <p className="text-sm font-semibold text-surdo-cocoa mb-3">{loadError}</p>
        </div>
      )}

      {/* State Badge Top Left */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-surdo-darkest/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-surdo-cream text-xs">
        <span className={`w-2 h-2 rounded-full ${animationState === 'signing' ? 'bg-emerald-400 animate-ping' : 'bg-surdo-sage'}`} />
        <span className="font-semibold">{modelName}</span>
      </div>

      {/* Active Gesture Floating Pill */}
      {activeSignName && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-surdo-beige text-surdo-forest font-bold text-xs shadow-sm flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-surdo-green" />
          <span>Faol imo-ishora: "{activeSignName}"</span>
        </div>
      )}

      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 bg-white/80 backdrop-blur-md p-1.5 rounded-xl border border-surdo-beige shadow-sm">
        <button
          onClick={handleResetCamera}
          className="p-2 text-surdo-forest hover:bg-surdo-sage/30 rounded-lg transition-colors"
          title="Kamerani boshlang‘ich holatga qaytarish"
          aria-label="Kamerani boshlang‘ich holatga qaytarish"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(0.3)}
          className="p-2 text-surdo-forest hover:bg-surdo-sage/30 rounded-lg transition-colors"
          title="Yaqinlashtirish"
          aria-label="Yaqinlashtirish"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(-0.3)}
          className="p-2 text-surdo-forest hover:bg-surdo-sage/30 rounded-lg transition-colors"
          title="Uzoqlashtirish"
          aria-label="Uzoqlashtirish"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setWireframe(!wireframe)}
          className={`p-2 rounded-lg transition-colors ${wireframe ? 'bg-surdo-forest text-surdo-cream' : 'text-surdo-forest hover:bg-surdo-sage/30'}`}
          title="Mesh to‘rini ko‘rish (Wireframe)"
          aria-label="Mesh to‘rini ko‘rish"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Model Technical Disclosure Banner */}
      <div className="absolute bottom-3 left-3 right-3 z-10 bg-white/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-surdo-beige text-xs text-surdo-cocoa shadow-sm flex items-start gap-2.5">
        <Info className="w-4 h-4 text-surdo-green shrink-0 mt-0.5" />
        <div className="leading-tight">
          <span className="font-semibold text-surdo-forest">{modelName}: </span>
          <span>
            Haqiqiy 3D GLB modeli yuklandi. Hozirgi bosqichda model statik mesh bo‘lib, animatsiya qilingan harakat vektori va yuqori tana artikulyatsiyasi namoyish etiladi.
          </span>
        </div>
      </div>
    </div>
  );
};
