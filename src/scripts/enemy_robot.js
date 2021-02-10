import { Object3D } from "three";

export default class EnemyRobot extends Object3D {

    constructor(model){
        super();
        this.add(model);
        this.pos = Math.random() * 1000;
        this.height = 2 + (Math.random() * 4);
        this.speed = 0.3 + Math.random();
        this.health = 100;
        this.distance = 4 + (Math.random() * 6);
        this.clockwise = Math.random() > 0.5; 

        this.tick = this.MainTick;
    }

    // Main tick that runs once per frame.
    MainTick( deltaTime, alive = true ){
        if (this.clockwise) {
            this.pos += this.speed * deltaTime;
        } else {
            this.pos -= this.speed * deltaTime;
        }
        this.position.set(
            Math.cos(this.pos) * this.distance,
            this.height,
            Math.sin(this.pos) * this.distance
        );

        if (alive) this.lookAt(0, 2 ,0);
    }

    // Tiking get's delegate to this function when an enemy dies.
    deathTick( deltaTime ){
        this.height -= 10 * deltaTime;
        this.rotateZ(
            this.clockwise ?
            (deltaTime * this.deathSpinSpeed) :
            - (deltaTime * this.deathSpinSpeed)
        );
        this.MainTick( deltaTime, false );

        // Remove enemy once it reaches the bottom.
        if ( this.height <= 0 ){
            this.parent.remove(this);
        }
    }

    applyDamage( damage ){
        this.health -= damage;
        if (this.health <= 0) this.destroy();
    }

    destroy(){
        this.deathSpinSpeed = Math.random() * 10;
        this.tick = this.deathTick;
    }

}