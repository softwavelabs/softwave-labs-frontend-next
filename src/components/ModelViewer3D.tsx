"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Preload } from "@react-three/drei";

function Model({ url }) {
    useGLTF.preload(url);
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
}

export default function ModelViewer3D({ modelUrl }) {
    return (
        <div style={{ width: "100%", height: "500px" }}>
            <Canvas camera={{ position: [3, 3, 3] }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={1} />

                <React.Suspense fallback={null}>
                    <Model url={modelUrl} />
                </React.Suspense>

                <OrbitControls enableZoom={true} />

                <Preload all />
            </Canvas>
        </div>
    );
}
