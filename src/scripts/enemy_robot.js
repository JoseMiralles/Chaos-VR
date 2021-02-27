import * as THREE from "three";
import EnemyProjectile from "./enemy_projetile";

export default class EnemyRobot extends THREE.Object3D {

    constructor(model, projectileGroup, assetStore){
        super();
        this.robotModel = model;
        this.cannonEnd = this.robotModel.children[2];
        this.assetStore = assetStore;
        this.projectileGroup = projectileGroup;
        this.onDeath = ()=>{};
        this.tick = ()=>{};
        this.applyDamage = ()=>{};

        this.killScore = 100;

        const sphere = new THREE.SphereGeometry( 0.8, 8, 8 );
        const material = this.assetStore.mainEmissiveMaterial;
        this.explosion = new THREE.Mesh( sphere, material );

        this._initialHealth = 5;
        this._highSpeed = 0.3;
        this._lowSpeed = 1;
        this._projectileVelocity = 3;

        this.free = true; // Specifies weather this bot is free to be re-spawned.
    }




    //#region BOT LIFE CYCLE START

    // Responsible for showing this robot back on the field.
    spawn(){

        // if (this.explosionRemovalTimeout) clearTimeout(this.explosionRemovalTimeout);
        // if (this.explosionTimeout) clearTimeout(this.explosionTimeout);

        this.free = false;

        // Calculate everything.
        this.add(this.robotModel);
        this.angle = Math.random() * 1000;
        this.speed = this._lowSpeed + (Math.random() * this._highSpeed);
        this.health = this._initialHealth;
        this.distance = 4 + (Math.random() * 6);
        this.clockwise = Math.random() > 0.5;
        this.xOffset = -10 + Math.random() * 20;
        this.zOffset = -3 + Math.random() * 6;
        this.position.y = 1 + (Math.random() * 6);

        // Restore the apply damage function.
        this.applyDamage = this._applyDamage;

        // Set screen material back to white emissive.
        this.robotModel.children[1].material = this.assetStore.mainEmissiveMaterial;

        // Set the explosion size back to the original size.


        // Begin firing interval;
        this.shootingIntervalTime = 2000 + (Math.random() * 10000);
        this.beginShootingInterval();

        // Delegate initial ticking function.
        this.tick = this.mainTick;

    }

    // Runs immideatly after this robot runs out of health.
    // It deletegates ticking to the deathTick function.
    destroy(){
        // Disable damage.
        this.applyDamage = ()=>{};

        // Play shutdown sound
        const sound = this.assetStore.botDestroyedSoundGenerator.getNext();
        this.getWorldPosition( sound.position );
        sound.play();

        this.robotModel.children[1].material = this.assetStore.shutDownMaterial;

        // Make some robots shoot rapidly when killed.
        // Only for enemies who are far.
        if (Math.random() > 0.9){
            this.shootingIntervalTime = 100;
            this.beginShootingInterval();
        }

        this.deathSpinSpeed = Math.random() * 10;
        this.fallSpeedDelta = Math.random() * 10;
        this.fallSpeed = 0;
        this.tick = this.deathTick;

        this.explosionTimeout = setTimeout(() => {
            clearTimeout( this.shootingInterval );
            this.beginExplosionAnimation();
        }, Math.random() * 3000);
    }

    // DESPAWN happens here.
    beginExplosionAnimation(){
        // Begin explosion
        this.explosion.scale.set(1, 1, 1);
        this.remove( this.robotModel );
        this.add( this.explosion );
        this.explosionGrowth = 6;
        this.tick = this.blowUpTick;

        // Play explosion sound from correct world position.
        const sound = this.assetStore.botExplosionSoundGenerator.getNext();
        this.getWorldPosition( sound.position );
        sound.play();

        this.explosionRemovalTimeout = setTimeout(() => {
            // Remove enemy after some time.
            this.remove( this.explosion );
            this.position.y = -10; // Put under the map until re-spawned.
            this.free = true;
            this.onDeath();
        }, 500);
    }

    //#endregion BOT LIFE CYCLE ENDS




    // Handles shooting.
    beginShootingInterval( ){

        if ( this.shootingInterval ) clearInterval( this.shootingInterval );

        // Using this instead of "setInterval" to be able to change the time dynamically.
        const internalCallback = () => {
            this.shootingInterval = setTimeout(() => {

                // TODO: recycle these variables.
                const position = new THREE.Vector3();
                position.setFromMatrixPosition( this.cannonEnd.matrixWorld );
                const quaternion = new THREE.Quaternion();
                this.cannonEnd.getWorldQuaternion( quaternion );

                this.projectileGroup.shootFrom( quaternion, position, this._projectileVelocity );
                internalCallback();
            }, this.shootingIntervalTime);
        }

        internalCallback();
    }

    // Applies the given damage to this bot.
    _applyDamage( damage ){
        // Play impact sound from correct world position.
        const sound = this.assetStore.botImpactSoundGenerator.getNext();
        this.getWorldPosition( sound.position );
        sound.play();

        this.health -= damage;
        if (this.health <= 0) this.destroy();
    }




    //#region TICKING FUNCTIONS START

    // Main tick that runs once per frame.
    mainTick( deltaTime, playerPosition, alive = true ){
        if (this.clockwise) {
            this.angle += this.speed * deltaTime;
        } else {
            this.angle -= this.speed * deltaTime;
        }
        // this.position.set (
        //     Math.cos(this.angle) * this.distance + this.xOffset,
        //     this.height,
        //     Math.sin(this.angle) * (this.distance / 3) + this.zOffset
        // );
        this.position.x = Math.cos(this.angle) * this.distance + this.xOffset;
        this.position.z = Math.sin(this.angle) * (this.distance / 4) + this.zOffset;

        if (alive) this.lookAt(playerPosition);
    }

    // Tiking get's delegate to this function when an enemy dies.
    deathTick( deltaTime, playerPosition ){
        // Make character fall of the sky while spinning.
        this.position.y -= this.fallSpeed * deltaTime;
        this.fallSpeed += (this.fallSpeedDelta * deltaTime);
        this.rotateZ(
            this.clockwise ?
            (deltaTime * this.deathSpinSpeed) :
            - (deltaTime * this.deathSpinSpeed)
        );
        // Call original ticking function to continue trajectory.
        this.mainTick( deltaTime, playerPosition, false );

        // Remove enemy once it reaches the bottom.
        if ( this.position.y <= 0 ){
            clearTimeout(this.explosionTimeout);
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

    //#endregion TICKING FUNCTIONS END



}