import * as THREE from 'three'
import Experience from "../Experience";

export default class Fox {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.debug = this.experience.debug;

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.gui.addFolder('fox');
        }
        // Setup
        this.resource = this.resources.items.foxModel;

        this.setModel();
        this.setAnimation();
    }

    setModel() {
        this.model = this.resource.scene;

        this.model.scale.set(0.02, 0.02, 0.02);
        this.scene.add(this.model);

        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
            }
        })
    }
    setAnimation() {
        this.animation = {};
        this.animation.mixer = new THREE.AnimationMixer(this.model);
        this.animation.actions = {};
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0]);
        this.animation.actions.walk = this.animation.mixer.clipAction(this.resource.animations[1]);
        this.animation.actions.run = this.animation.mixer.clipAction(this.resource.animations[2]);

        this.animation.actions.current = this.animation.actions.idle;

        this.animation.actions.current.play();

        this.animation.play = (name) => {
            const newAction = this.animation.actions[name];
            const oldAction = this.animation.actions.current;

            newAction.reset();
            newAction.play();

            // From old animation to transition to the new action in 1 second
            newAction.crossFadeFrom(oldAction, 1);
            
            this.animation.actions.current = newAction;
        }

        // DEBUG
        if(this.debug.active) {
            const debugObject = {
                idle: () => { this.animation.play('idle') },
                walk: () => { this.animation.play('walk') },
                run: () => { this.animation.play('run') }
            }

            this.debugFolder.add(debugObject, 'idle');
            this.debugFolder.add(debugObject, 'walk');
            this.debugFolder.add(debugObject, 'run');
        }
    }


    update() {
        this.animation.mixer.update(this.time.delta * 0.001);
    }
}