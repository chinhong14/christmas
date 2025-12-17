
import React, { useMemo, useRef, useLayoutEffect, Suspense, ReactNode, Component } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import * as THREE from 'three';
import { AppState } from '../types';
import { MEMORY_LANE, SCATTER_RADIUS } from '../constants';

interface ImageErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface ImageErrorBoundaryState {
  hasError: boolean;
}

// Robust Error Boundary to catch texture loading errors without crashing the app
// Fix: Use React.Component explicitly and add constructor to ensure 'props' is recognized by the compiler
class ImageErrorBoundary extends React.Component<ImageErrorBoundaryProps, ImageErrorBoundaryState> {
  constructor(props: ImageErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() { return { hasError: true }; }
  
  render() {
    // Accessing this.state and this.props which are now properly inherited from React.Component
    if (this.state.hasError) {
      return this.props.fallback || (
        <mesh>
          <planeGeometry args={[4, 3]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      );
    }
    return this.props.children;
  }
}

// Fallback component when image fails or loads
const ImageFallback = () => (
  <mesh>
    <planeGeometry args={[4, 3]} />
    <meshStandardMaterial color="#1e293b" />
  </mesh>
);

interface ScatteredPicturesProps {
  appState: AppState;
  currentSlideIndex?: number;
}

const ScatteredPictures: React.FC<ScatteredPicturesProps> = ({ appState, currentSlideIndex = -1 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const itemsRef = useRef<(THREE.Group | null)[]>([]);
  const { viewport } = useThree();

  // Generate Deterministic Positions (Fibonacci Sphere - Truncated)
  const images = useMemo(() => {
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden Angle

    return MEMORY_LANE.map((memory, i) => {
      // 1. Constrain Y to a central band [-0.65, 0.65] to avoid poles
      const yNorm = 1 - (i / (MEMORY_LANE.length - 1)) * 2; 
      const y = yNorm * 0.65; 
      
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      // INCREASED RADIUS: Move images outside the particle scatter radius (25) to prevent intersection
      const r = SCATTER_RADIUS + 5; // ~30 units

      const x = Math.cos(theta) * radiusAtY * r;
      const z = Math.sin(theta) * radiusAtY * r;
      const yPos = y * r;

      const position = new THREE.Vector3(x, yPos, z);
      
      // 2. Orientation Logic: Keep Upright
      const dummyObj = new THREE.Object3D();
      dummyObj.position.copy(position);
      dummyObj.lookAt(0, yPos, 0); 
      dummyObj.rotateY(Math.PI); 

      // 3. Random Drift Direction (0-7) for varied movement
      // 0: Horizontal, 1: Vertical, 2: Diag Up, 3: Diag Down, 4: Circle, 5: Figure8, 6: Pulse, 7: Wide
      const driftType = Math.floor(Math.random() * 8);

      return {
        ...memory,
        initialPosition: position,
        initialRotation: dummyObj.rotation.clone(),
        azimuth: Math.atan2(x, z),
        driftType, 
        // 4. Random Animation Params for Active State
        randomTilt: {
            x: (Math.random() - 0.5) * 0.35,
            y: (Math.random() - 0.5) * 0.35,
            z: (Math.random() - 0.5) * 0.15
        },
        floatOffset: Math.random() * 100,
        floatSpeed: 0.3 + Math.random() * 0.3
      };
    });
  }, []);

  // Initialize positions ONE TIME
  useLayoutEffect(() => {
    images.forEach((img, i) => {
      const el = itemsRef.current[i];
      if (el) {
        el.position.copy(img.initialPosition);
        el.rotation.copy(img.initialRotation);
        el.scale.setScalar(1); 
      }
    });
  }, [images]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // 1. Group Rotation Logic
    if (appState === 'SEQUENCE' && currentSlideIndex !== -1 && currentSlideIndex < images.length) {
      const targetImage = images[currentSlideIndex];
      if (targetImage) {
        const cameraPos = state.camera.position;
        const camAzimuth = Math.atan2(cameraPos.x, cameraPos.z);
        const imgAzimuth = targetImage.azimuth; 

        let angleDiff = camAzimuth - imgAzimuth;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        const targetQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angleDiff);
        groupRef.current.quaternion.slerp(targetQuaternion, 3 * delta);
      }
    } else if (appState === 'SCATTERED') {
       groupRef.current.rotation.y += delta * 0.05;
    }

    // 2. Individual Image Animation
    images.forEach((img, i) => {
        const itemGroup = itemsRef.current[i];
        if (!itemGroup) return;

        const isActive = (appState === 'SEQUENCE' && i === currentSlideIndex);
        
        // --- SCALE & POSITION CALCULATION ---
        const isMobile = viewport.width < 7; 
        const activeScaleBase = isMobile ? 1.5 : 1.9; 
        
        const targetScale = isActive ? activeScaleBase : 1.0;
        
        // Active Multiplier: Slight move towards camera, but keeps distance
        const activeRadiusMultiplier = isActive ? 1.15 : 1.0; 
        
        const targetPos = img.initialPosition.clone().multiplyScalar(activeRadiusMultiplier);

        // --- ACTIVE STATE ANIMATION ---
        if (isActive) {
            targetPos.y = 0;
            
            const t = state.clock.elapsedTime;
            
            // Directional Floating Logic (Simulating coming from different sides/angles)
            let floatX = 0;
            let floatY = 0;
            const amp = 0.8; // Amplitude of the sway

            switch (img.driftType) {
                case 0: // Horizontal (Left <-> Right)
                    floatX = Math.sin(t * img.floatSpeed + img.floatOffset) * amp * 1.5;
                    floatY = Math.cos(t * img.floatSpeed * 0.5) * 0.2;
                    break;
                case 1: // Vertical (Up <-> Down)
                    floatX = Math.cos(t * img.floatSpeed * 0.5) * 0.2;
                    floatY = Math.sin(t * img.floatSpeed + img.floatOffset) * amp;
                    break;
                case 2: // Diagonal (BottomLeft <-> TopRight)
                    floatX = Math.sin(t * img.floatSpeed + img.floatOffset) * amp;
                    floatY = Math.sin(t * img.floatSpeed + img.floatOffset) * amp;
                    break;
                case 3: // Diagonal (TopLeft <-> BottomRight)
                    floatX = Math.sin(t * img.floatSpeed + img.floatOffset) * -amp;
                    floatY = Math.sin(t * img.floatSpeed + img.floatOffset) * amp;
                    break;
                case 4: // Circular
                    floatX = Math.sin(t * img.floatSpeed + img.floatOffset) * amp;
                    floatY = Math.cos(t * img.floatSpeed + img.floatOffset) * amp;
                    break;
                case 5: // Figure 8
                    floatX = Math.sin(t * img.floatSpeed + img.floatOffset) * amp;
                    floatY = Math.sin(t * img.floatSpeed * 2 + img.floatOffset) * (amp * 0.5);
                    break;
                case 6: // Wide Arc
                    floatX = Math.sin(t * img.floatSpeed * 0.7) * amp * 2.0;
                    floatY = Math.cos(t * img.floatSpeed) * amp * 0.3;
                    break;
                case 7: // Vertical Bob with Twist
                    floatX = Math.sin(t * img.floatSpeed * 2) * 0.1;
                    floatY = Math.sin(t * img.floatSpeed + img.floatOffset) * amp * 1.2;
                    break;
            }
            
            targetPos.x += floatX;
            targetPos.y += floatY;

            // Tilt/Sway
            const swayX = Math.sin(t * 0.5 + img.floatOffset) * 0.05;
            const swayY = Math.cos(t * 0.3 + img.floatOffset) * 0.05;

            const targetRotX = img.initialRotation.x + img.randomTilt.x + swayX;
            const targetRotY = img.initialRotation.y + img.randomTilt.y + swayY;
            const targetRotZ = img.initialRotation.z + img.randomTilt.z;

            itemGroup.rotation.x = THREE.MathUtils.lerp(itemGroup.rotation.x, targetRotX, delta * 3);
            itemGroup.rotation.y = THREE.MathUtils.lerp(itemGroup.rotation.y, targetRotY, delta * 3);
            itemGroup.rotation.z = THREE.MathUtils.lerp(itemGroup.rotation.z, targetRotZ, delta * 3);

        } else {
             itemGroup.rotation.x = THREE.MathUtils.lerp(itemGroup.rotation.x, img.initialRotation.x, delta * 4);
             itemGroup.rotation.y = THREE.MathUtils.lerp(itemGroup.rotation.y, img.initialRotation.y, delta * 4);
             itemGroup.rotation.z = THREE.MathUtils.lerp(itemGroup.rotation.z, img.initialRotation.z, delta * 4);
        }

        itemGroup.position.lerp(targetPos, isActive ? 4 * delta : 8 * delta);
        
        const currentScale = itemGroup.scale.x; 
        const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 6 * delta);
        itemGroup.scale.setScalar(newScale);
    });
  });

  const visible = appState === 'SCATTERED' || appState === 'SEQUENCE';

  return (
    <group ref={groupRef}>
      {images.map((img, i) => (
        <group 
            key={img.id} 
            ref={(el) => { if (el) itemsRef.current[i] = el; }}
        >
          <ImageErrorBoundary fallback={<ImageFallback />}>
            <Suspense fallback={<ImageFallback />}>
              <Image 
                  url={img.img}
                  scale={[4, 3]} 
                  transparent
                  opacity={visible ? (appState === 'SEQUENCE' && i !== currentSlideIndex ? 0.2 : 1) : 0} 
                  color={visible ? "#ffffff" : "#000000"} 
                  toneMapped={false}
                  // @ts-ignore
                  crossOrigin="anonymous"
              />
            </Suspense>
          </ImageErrorBoundary>

            {/* Frame */}
            <mesh position={[0, 0, -0.05]}>
                <boxGeometry args={[4.2, 3.2, 0.05]} />
                <meshStandardMaterial 
                    color="#FDE047" 
                    metalness={0.9} 
                    roughness={0.1} 
                    transparent 
                    opacity={visible ? (appState === 'SEQUENCE' && i !== currentSlideIndex ? 0.2 : 1) : 0} 
                />
            </mesh>
        </group>
      ))}
    </group>
  );
};

export default ScatteredPictures;
