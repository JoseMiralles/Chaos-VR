import * as THREE from "three";
import EnemyProjectile from "./enemy_projetile";

export default class EnemyRobot extends THREE.Object3D {

    constructor(model, projectileGroup){
        super();
        this.robotModel = model;
        this.cannonEnd = this.robotModel.children[0];
        this.add(this.robotModel);
        this.angle = Math.random() * 1000;
        this.height = 2 + (Math.random() * 4);
        this.speed = 0.3 + Math.random();
        this.health = 100;
        this.distance = 4 + (Math.random() * 6);
        this.clockwise = Math.random() > 0.5;
        this.xOffset = -5 + Math.random() * 10;
        this.yOffset = -5 + Math.random() * 10;

        // Begin firing interval;
        this.shootingIntervalTime = 2000 + (Math.random() * 10000);
        this.projectileGroup = projectileGroup;
        this.beginShootingInterval();

        // Delegate initial ticking function.
        this.tick = this.mainTick;
        this.onDeath = ()=>{};
    }

    // Handles shooting.
    beginShootingInterval(  ){
        const sphereGeometry = new THREE.IcosahedronGeometry( 0.1, 0 );
        const material = new THREE.MeshLambertMaterial({
            color: 0xffffff
        });

        // Using this instead of "setInterval" to be able to change the time dynamically.
        const internalCallback = () => {
            setTimeout(() => {
                const position = new THREE.Vector3();
                position.setFromMatrixPosition( this.cannonEnd.matrixWorld );
                const quaternion = new THREE.Quaternion();
                this.cannonEnd.getWorldQuaternion( quaternion );
                
                this.projectileGroup.add(
                    new EnemyProjectile(
                        sphereGeometry.clone(),
                        material,
                        quaternion,
                        position
                    )
                );
                internalCallback();
            }, this.shootingIntervalTime);
        }

        internalCallback();
    }

    // Main tick that runs once per frame.
    mainTick( deltaTime, playerPosition, alive = true ){
        if (this.clockwise) {
            this.angle += this.speed * deltaTime;
        } else {
            this.angle -= this.speed * deltaTime;
        }
        this.position.set (
            Math.cos(this.angle) * this.distance + this.xOffset,
            this.height,
            Math.sin(this.angle) * this.distance + this.yOffset
        );

        if (alive) this.lookAt(playerPosition);
    }

    // Tiking get's delegate to this function when an enemy dies.
    deathTick( deltaTime, playerPosition ){
        // Make character fall of the sky while spinning.
        this.height -= this.fallSpeed * deltaTime;
        this.fallSpeed += (20 * deltaTime);
        this.rotateZ(
            this.clockwise ?
            (deltaTime * this.deathSpinSpeed) :
            - (deltaTime * this.deathSpinSpeed)
        );
        // Call original ticking function to continue trajectory.
        this.mainTick( deltaTime, playerPosition, false );

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
            const material = new THREE.MeshBasicMaterial
                ({ color: 0xffffff });
            this.explosion = new THREE.Mesh( sphere, material );
            this.add( this.explosion );
            this.explosionGrowth = 6;
            this.tick = this.blowUpTick;

            setTimeout(() => {
                // Remove enemy after some time.
                clearInterval( this.shootingInterval );
                this.onDeath();
                this.parent.remove(this);
            }, 500);
    }

    applyDamage( damage ){
        this.health -= damage;
        if (this.health <= 0) this.destroy();
    }

    // Runs immideatly after this robot runs out of health.
    // It deletegates ticking to the deathTick function.
    destroy(){
        // Disable damage.
        this.applyDamage = ()=>{};

        // Make some robots shoot rapidly when killed.
        // Only for enemies who are far.
        if (this.distance > 6 && Math.random() > 0.7){
            this.shootingIntervalTime = 100;
            this.beginShootingInterval();
        }

        this.deathSpinSpeed = Math.random() * 10;
        this.fallSpeed = 0;
        this.tick = this.deathTick;
    }

}