import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Stage } from '@react-three/drei';
import * as THREE from 'three';
import { useCustomizerStore } from '../store/useCustomizerStore';
import { drawJerseyTexture, drawCapTexture } from '../utils/textureHelpers';
import { RotateCw, RefreshCw, Eye, Image } from 'lucide-react';
import DesignSummary from './DesignSummary';

// Loader indicator for 3D model
function CanvasLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-dark/40 backdrop-blur-sm z-50">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-brand-primary/20 animate-pulse"></div>
        <div className="absolute inset-0 rounded-full border-t-4 border-brand-primary animate-spin"></div>
      </div>
      <p className="mt-4 text-brand-text font-medium text-sm tracking-wider animate-pulse">LOADING 3D STUDIO...</p>
    </div>
  );
}

// Jersey Component loading GLB and applying dynamic canvas texture
function JerseyModel() {
  const store = useCustomizerStore();
  const { scene } = useGLTF('/shirt_baked.glb');
  const textureCanvasRef = useRef(document.createElement('canvas'));
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const canvas = textureCanvasRef.current;
    canvas.width = 1024;
    canvas.height = 1024;
    
    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.colorSpace = THREE.SRGBColorSpace;
    canvasTexture.flipY = false; // Match UV map direction
    setTexture(canvasTexture);
  }, []);

  useEffect(() => {
    if (!texture) return;
    drawJerseyTexture(textureCanvasRef.current, store, () => {
      texture.needsUpdate = true;
    });
  }, [
    texture,
    store.colors.body,
    store.colors.sleeves,
    store.colors.collar,
    store.pattern,
    store.logoUrl,
    store.logoScale,
    store.logoPosition,
    store.customText,
    store.textNumber,
    store.textColor,
    store.textFont,
    store.textScale,
    store.textPosition
  ]);

  useEffect(() => {
    if (!scene || !texture) return;

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Standard material with roughness for fabric feel
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.7,
          metalness: 0.1,
          side: THREE.DoubleSide
        });
      }
    });
  }, [scene, texture]);

  return <primitive object={scene} scale={1.8} position={[0, -0.5, 0]} />;
}

// Procedural Cap Model with customizable zones
function ProceduralCap() {
  const store = useCustomizerStore();
  const textureCanvasRef = useRef(document.createElement('canvas'));
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const canvas = textureCanvasRef.current;
    canvas.width = 1024;
    canvas.height = 1024;
    
    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.colorSpace = THREE.SRGBColorSpace;
    canvasTexture.flipY = false; // Match UV map direction
    setTexture(canvasTexture);
  }, []);

  useEffect(() => {
    if (!texture) return;
    drawCapTexture(textureCanvasRef.current, store, () => {
      texture.needsUpdate = true;
    });
  }, [
    texture,
    store.colors.crown,
    store.colors.visor,
    store.colors.button,
    store.colors.eyelets,
    store.pattern,
    store.logoUrl,
    store.logoScale,
    store.logoPosition,
    store.customText,
    store.textNumber,
    store.textColor,
    store.textFont,
    store.textScale,
    store.textPosition
  ]);

  const visorColor = store.colors.visor || '#BE123C';
  const buttonColor = store.colors.button || '#111827';
  const eyeletsColor = store.colors.eyelets || '#F59E0B';

  return (
    <group position={[0, -0.2, 0]} scale={1.6}>
      {/* Crown (Hemisphere) - uses dynamic canvas texture map */}
      <mesh castShadow receiveShadow position={[0, 0.1, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <sphereGeometry args={[0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        {texture ? (
          <meshStandardMaterial map={texture} roughness={0.8} metalness={0.05} />
        ) : (
          <meshStandardMaterial color={store.colors.crown || '#1E3A8A'} roughness={0.8} metalness={0.05} />
        )}
      </mesh>

      {/* Visor/Brim */}
      <mesh castShadow receiveShadow position={[0, 0.05, 0.35]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[0.65, 0.03, 0.42]} />
        <meshStandardMaterial color={visorColor} roughness={0.6} metalness={0.05} />
      </mesh>

      {/* Top Button */}
      <mesh castShadow position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color={buttonColor} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Cap Eyelets (Side rings/cylinders) */}
      {[
        [0.25, 0.4, 0.25], [-0.25, 0.4, 0.25],
        [0.35, 0.35, -0.1], [-0.35, 0.35, -0.1],
        [0.18, 0.45, -0.3], [-0.18, 0.45, -0.3]
      ].map((pos, idx) => (
        <mesh key={idx} position={pos} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.01, 8]} />
          <meshStandardMaterial color={eyeletsColor} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// Scene setup with auto-rotate animation
function ConfiguratorScene({ autoRotate, activeProduct }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.25;
    }
  });

  return (
    <group ref={groupRef}>
      {activeProduct === 'jersey' ? (
        <JerseyModel />
      ) : (
        <ProceduralCap />
      )}
    </group>
  );
}

export default function ThreeViewer() {
  const store = useCustomizerStore();
  const [autoRotate, setAutoRotate] = useState(false);
  const orbitControlsRef = useRef();
  
  // Set preset camera angles
  const setCameraAngle = (angle) => {
    if (!orbitControlsRef.current) return;
    const controls = orbitControlsRef.current;
    
    // Smooth transition simulation
    switch(angle) {
      case 'front':
        controls.object.position.set(0, 0, 4);
        break;
      case 'back':
        controls.object.position.set(0, 0, -4);
        break;
      case 'side':
        controls.object.position.set(4, 0, 0);
        break;
      case 'top':
        controls.object.position.set(0, 4, 0.1);
        break;
      default:
        controls.reset();
    }
    controls.update();
  };

  const handleScreenshot = () => {
    const canvas = document.querySelector('.canvas-container canvas');
    if (!canvas) return;
    
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${store.activeProduct}-design.png`;
    link.href = url;
    link.click();
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between">
      {/* 3D Viewport Toolbar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
        <div className="glass-panel px-4 py-2 rounded-full text-xs font-semibold tracking-wider text-brand-primary pointer-events-auto shadow-md">
          {store.activeProduct.toUpperCase()} CUSTOMIZER STUDIO
        </div>
        
        <div className="flex gap-2 pointer-events-auto">
          <button 
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-full border transition-all ${autoRotate ? 'bg-brand-primary text-white border-brand-primary' : 'bg-brand-dark/80 text-brand-text border-brand-border hover:bg-brand-border'}`}
            title="Auto Rotate"
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          </button>
          
          <button 
            onClick={() => setCameraAngle('reset')}
            className="p-2 rounded-full bg-brand-dark/80 text-brand-text border border-brand-border hover:bg-brand-border transition-all"
            title="Reset View"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button 
            onClick={handleScreenshot}
            className="p-2 rounded-full bg-brand-dark/80 text-brand-text border border-brand-border hover:bg-brand-border transition-all"
            title="Capture Screenshot"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Camera Angles */}
      <div className="absolute bottom-4 left-4 flex gap-1.5 z-10">
        {['front', 'back', 'side', 'top'].map((angle) => (
          <button
            key={angle}
            onClick={() => setCameraAngle(angle)}
            className="px-3 py-1 rounded bg-brand-dark/90 hover:bg-brand-primary hover:text-white border border-brand-border text-[10px] font-bold uppercase tracking-wider text-brand-text/80 transition-all shadow-md"
          >
            {angle}
          </button>
        ))}
      </div>

      {/* Floating Design Summary Sidebar */}
      <DesignSummary />

      {/* Three.js Canvas Container */}
      <div className="canvas-container w-full h-full flex-grow bg-[#090D16]">
        <Suspense fallback={<CanvasLoader />}>
          <Canvas
            shadows
            gl={{ preserveDrawingBuffer: true }}
            camera={{ position: [0, 0, 3.8], fov: 40 }}
          >
            <ambientLight intensity={1.2} />
            
            {/* High-quality Studio Lighting */}
            <directionalLight
              position={[5, 5, 5]}
              intensity={1.5}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <directionalLight
              position={[-5, 5, -5]}
              intensity={0.5}
              castShadow
            />
            <pointLight position={[0, 10, 0]} intensity={0.5} />
            <spotLight position={[0, 5, 5]} angle={0.3} penumbra={1} intensity={1.5} castShadow />

            <ConfiguratorScene autoRotate={autoRotate} activeProduct={store.activeProduct} />

            <OrbitControls
              ref={orbitControlsRef}
              enablePan={false}
              minDistance={1.8}
              maxDistance={7}
              maxPolarAngle={Math.PI / 1.8}
              minPolarAngle={Math.PI / 3}
            />

            {/* Floor Soft Shadow Receiver */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
              <planeGeometry args={[10, 10]} />
              <shadowMaterial opacity={0.35} />
            </mesh>
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
}

// Pre-load the shirt GLB mesh so it loads instantly when switching products
useGLTF.preload('/shirt_baked.glb');
