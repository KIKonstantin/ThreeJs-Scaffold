import * as THREE from 'three';

import Experience from "../Experience";

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.gui.addFolder('environment')
        }

        this.setSunLight();
        this.setEnvMap();

    }

    setSunLight() {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 15;
        this.sunLight.shadow.mapSize.set(1024, 1024);
        this.sunLight.shadow.normalBias = 0.05;
        this.sunLight.position.set(3.5, 2, - 1.25);
        this.scene.add(this.sunLight);

        // DEBUG
        if (this.debug.active) {
            this.debugFolder
                .add(this.sunLight, 'intensity')
                .name('Sun Light')
                .min(0)
                .max(10)
                .step(0.001);

            this.debugFolder
                .add(this.sunLight.position, 'x')
                .name('Sun Position X')
                .min(-5)
                .max(5)
                .step(0.01);
            this.debugFolder
                .add(this.sunLight.position, 'y')
                .name('Sun Position Y')
                .min(-5)
                .max(5)
                .step(0.01);
            this.debugFolder
                .add(this.sunLight.position, 'z')
                .name('Sun Position z')
                .min(-5)
                .max(5)
                .step(0.01);
        }
    }

    setEnvMap() {
        this.envMap = {};
        this.envMap.intensity = 0.25;
        this.envMap.texture = this.resources.items.environmentMapTexture;
        this.envMap.texture.colorSpace = THREE.SRGBColorSpace;

        this.scene.environment = this.envMap.texture;

        this.envMap.updateMaterial = () => {
            this.scene.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMap = this.envMap.texture;
                    child.material.envMapIntensity = this.envMap.intensity;
                    child.material.needsUpdate = true;
                }
            })
        }

        this.envMap.updateMaterial();


        // DEBUG
        if (this.debug.active) {
            this.debugFolder
                .add(this.envMap, 'intensity')
                .name('EnvMapIntensity')
                .min(0)
                .max(3)
                .step(0.001)
                .onChange(this.envMap.updateMaterial);
        }

    }
}