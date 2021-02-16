import * as THREE from "three";

export default class EnemyProjectile extends THREE.Mesh {

    constructor( geometry, material ){
        super( geometry, material );
        this.position.y = -10;
        this.damage = 16;

        this.tick = ()=>{};
        this.free = true; // Defines wether this projectile is free to be spawned.
    }

    spawn( quaternion, position ){
        this.free = false;
        this.position.copy( position );
        this.setRotationFromQuaternion(quaternion);
        this.rotateX(1.57); // Point towards the player (90degs).
        this.userData.velocity = new THREE.Vector3();
        this.userData.velocity.z = 3;
        this.userData.velocity.applyQuaternion( quaternion );

        this.tick = this.mainTick;
    }

    deSpawn(){
        this.tick = ()=>{};
        this.position.y = -10;
        this.free = true;
    }

    mainTick(delta, playerPosition, player){

        this.rotateY( 2 * delta );
        this.children[0].rotateY( 2 * delta );

        this.position.z += this.userData.velocity.z * delta;
        this.position.y += this.userData.velocity.y * delta;
        this.position.x += this.userData.velocity.x * delta;

        // Check for collision with user.
        if (
            playerPosition.z <= this.position.z + 0.1
            && playerPosition.z >= this.position.z - 0.1
            && playerPosition.y <= this.position.y + 0.1
            && playerPosition.y >= this.position.y - 0.1
            && playerPosition.x <= this.position.x + 0.1
            && playerPosition.x >= this.position.x - 0.1
            ){
                player.receiveDamage( this.damage );
                this.deSpawn();
                return
            }

        // TODO: Check if projectile is too high or far behind.
        if ( this.position.y <= 0 || this.position.y >= 10 || this.position.z >= 10 ) {
            this.deSpawn();
        }

    }

}