import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Text, MeshDistortMaterial, Sphere, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useSound } from '@/hooks/useSound';

const GalaxyNode = ({ position, label, route, color = "#00f2ff", size = 0.5 }: { position: [number, number, number], label: string, route: string, color?: string, size?: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();
    const { playClick, playHover } = useSound();

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.01;

        // Floating animation if not hovered
        if (!hovered) {
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
        }
    });

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                <mesh
                    ref={meshRef}
                    onPointerOver={() => { setHovered(true); playHover(); document.body.style.cursor = 'pointer'; }}
                    onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
                    onClick={() => { playClick(); navigate(route); }}
                >
                    <sphereGeometry args={[size, 32, 32]} />
                    <MeshDistortMaterial
                        color={hovered ? "#fff" : color}
                        speed={hovered ? 5 : 2}
                        distort={0.4}
                        radius={1}
                        emissive={color}
                        emissiveIntensity={hovered ? 2 : 1}
                    />
                </mesh>
            </Float>
            <Text
                position={[0, -size - 0.4, 0]}
                fontSize={0.25}
                color="white"
                font="https://fonts.gstatic.com/s/orbitron/v25/yYqxRnz_T6G9z9X-6LzB.woff"
                anchorX="center"
                anchorY="middle"
                maxWidth={2}
            >
                {label.toUpperCase()}
            </Text>
            {hovered && (
                <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[size * 1.5, 32, 32]} />
                    <meshBasicMaterial color={color} transparent opacity={0.1} wireframe />
                </mesh>
            )}
        </group>
    );
};

const NeuralNexus = () => {
    const coreRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!coreRef.current) return;
        coreRef.current.rotation.z += 0.005;
        const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        coreRef.current.scale.set(s, s, s);
    });

    return (
        <group>
            <mesh ref={coreRef}>
                <torusGeometry args={[3, 0.02, 16, 100]} />
                <meshBasicMaterial color="#00f2ff" transparent opacity={0.3} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[4, 0.01, 16, 100]} />
                <meshBasicMaterial color="#7000ff" transparent opacity={0.2} />
            </mesh>
            <Sphere args={[1.5, 64, 64]}>
                <MeshDistortMaterial
                    color="#00f2ff"
                    speed={3}
                    distort={0.2}
                    radius={1}
                    emissive="#00f2ff"
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.4}
                />
            </Sphere>
        </group>
    );
};

export const NexusGalaxy = () => {
    return (
        <div className="h-[500px] w-full bg-black rounded-3xl overflow-hidden relative border border-primary/20 shadow-[0_0_50px_rgba(0,242,255,0.1)]">
            <div className="absolute top-6 left-6 z-10 pointer-events-none">
                <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Neural Navigation Hub</span>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Project <span className="text-primary">Nexus</span></h2>
            </div>

            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} color="#7000ff" intensity={1} />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <NeuralNexus />

                <GalaxyNode position={[-4, 2, 0]} label="Neural Forum" route="/forum" color="#ff0070" />
                <GalaxyNode position={[4, 2, 0]} label="Events Sphere" route="/events" color="#ffaa00" />
                <GalaxyNode position={[-5, -1.5, 0]} label="Internships" route="/internships" color="#00f2ff" />
                <GalaxyNode position={[5, -1.5, 0]} label="Projects" route="/projects" color="#7000ff" />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 3}
                />
            </Canvas>

            <div className="absolute bottom-6 right-6 z-10 text-right pointer-events-none">
                <p className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground opacity-40">Tactical Visualization Engine v4.0</p>
                <p className="text-[10px] font-bold text-primary opacity-60">DRAG TO ORBIT • CLICK TO UPLINK</p>
            </div>
        </div>
    );
};
