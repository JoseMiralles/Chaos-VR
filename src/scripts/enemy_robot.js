import * as THREE from "three";

export default class EnemyRobot extends THREE.Object3D {

    constructor(model){
        super();
        this.robotModel = model;
        this.add(this.robotModel);
        this.angle = Math.random() * 1000;
        this.height = 2 + (Math.random() * 4);
        this.speed = 0.3 + Math.random();
        this.health = 100;
        this.distance = 4 + (Math.random() * 6);
        this.clockwise = Math.random() > 0.5; 

        // Delegate initial ticking function.
        this.tick = this.MainTick;
    }

    // Main tick that runs once per frame.
    MainTick( deltaTime, alive = true ){
        if (this.clockwise) {
            this.angle += this.speed * deltaTime;
        } else {
            this.angle -= this.speed * deltaTime;
        }
        this.position.set(
            Math.cos(this.angle) * this.distance,
            this.height,
            Math.sin(this.angle) * this.distance
        );

        if (alive) this.lookAt(0, 2 ,0);
    }

    // Tiking get's delegate to this function when an enemy dies.
    deathTick( deltaTime ){
        // Make character fall of the sky while spinning.
        this.height -= 10 * deltaTime;
        this.rotateZ(
            this.clockwise ?
            (deltaTime * this.deathSpinSpeed) :
            - (deltaTime * this.deathSpinSpeed)
        );
        // Call original ticking function to continue trajectory.
        this.MainTick( deltaTime, false );

        // Remove enemy once it reaches the bottom.
        if ( this.height <= 0 ){
            this.beginExplosionAnimation();
        }
    }

    blowUpTick( deltaTime ){
        this.explosion.scale.set(
            this.explosion.scale.x + (deltaTime * this.explosionGrowth),
            this.explosion.scale.y + (deltaTime * this.explosionGrowth),
            this.explosion.scale.z + (deltaTime * this.explosionGrowth),
        );
        this.explosionGrowth -= (50 * deltaTime);
    }

    beginExplosionAnimation(){
            // Begin explosion
            this.remove( this.robotModel );
            const sphere = new THREE.SphereGeometry( 0.8, 10, 10 );
            const material = new THREE.MeshLambertMaterial
                ({ emissive: 0xfff700 });
            this.explosion = new THREE.Mesh( sphere, material );
            this.add( this.explosion );
            this.explosionGrowth = 6;
            this.tick = this.blowUpTick;

            setTimeout(() => {
                // Remove enemy after some time.
                this.parent.remove(this);
            }, 500);
    }

    applyDamage( damage ){
        this.health -= damage;
        if (this.health <= 0) this.destroy();
    }

    destroy(){
        // Disable damage.
        this.applyDamage = ()=>{};
        this.deathSpinSpeed = Math.random() * 10;
        this.tick = this.deathTick;
    }

}