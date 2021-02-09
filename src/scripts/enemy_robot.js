import { Object3D } from "three";

export default class EnemyRobot extends Object3D {

    constructor(model){
        super();
        this.add(model);
        this.pos = Math.random() * 1000;
        this.height = 2 + (Math.random() * 4);
        this.speed = Math.random();
        this.health = 100;
        this.distance = 4 + (Math.random() * 6);
        this.clockwise = Math.random() > 0.5; 
    }

    tick( deltaTime ){
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

        this.lookAt(0,0,0);
    }

    applyDamage( damage ){
        this.health -= damage;
        if (this.health <= 0) this.destroy();
    }

    destroy(){
        this.parent.remove(this);
    }

}