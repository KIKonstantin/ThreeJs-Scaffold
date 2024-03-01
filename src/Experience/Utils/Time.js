import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter{
    constructor() {
        super();
        
        // Setup
        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16;

        // Wait one frame before starting the tick function. Prevent delta = 0!
        window.requestAnimationFrame(() => {this.tick()});
    }

    tick() {
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        
        this.trigger('tick');

        window.requestAnimationFrame(() => {
            this.tick();
        });
    }
}