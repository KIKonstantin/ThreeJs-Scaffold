import * as THREE from 'three';
import sources from './sources';

import Sizes from './Utils/Sizes';
import Time from './Utils/Time';
import Debug from './Utils/Debug';
import Camera from './Camera';
import Renderer from './Renderer';
import World from './World/World';
import Resources from './Utils/Resources';

let instance = null;

export default class Experience{
    constructor(canvas) {
        if (instance) return instance;
        instance = this;
        window.experience = instance;
        // Setup
        this.debug = new Debug();
        this.canvas = canvas;
        this.time = new Time();
        this.sizes = new Sizes();
        this.scene = new THREE.Scene();
        this.resources = new Resources(sources);
        this.camera = new Camera(this);
        this.renderer = new Renderer();
        this.world = new World();

        // Resize event
        this.sizes.on('resize', () => {
            this.resize();
        });
        // Animation frame event
        this.time.on('tick', () => {
            this.update();
        });


    }

    resize() {
        //    This technique propagates to the children / Prevents bugs
        this.camera.resize();
        this.renderer.resize();
    }
    
    update() {
        //    This technique propagates to the children / Prevents bugs
        this.camera.update();
        this.world.update();
        this.renderer.update();
    }
    /**
     * When you want to dispose of elements you need to check
     *      every element that has a dispose method before you despose of everything else
     * so that you can dispose of things in proper way
     * 
     * You can add destroy method to each class if the project is getting bigger
     * So you can manage it 
     * And you can call the destroy methods here
    */
    destroy() {
        this.sizes.off('resize');
        this.time.off('tick');

        // Traverse the whole scene
        this.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();

                for (const key in child.material) {
                    const value = child.material[key];
                    if (value && typeof value.dispose == 'function') {
                        value.dispose();
                    }
                }
            }
        });

        this.camera.controls.dispose();
        this.renderer.instance.dispose();

        // Dispose of the debug panel
        if (this.debug.active) this.debug.gui.destroy();
    }
}