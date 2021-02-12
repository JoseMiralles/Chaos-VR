import * as THREE from "three";

export default class EnemyProjectile extends THREE.Mesh {

    constructor( geometry, material, quaternion, position ){
        super( geometry, material );

        this.position.copy( position );
        this.setRotationFromQuaternion(quaternion);
        this.userData.velocity = new THREE.Vector3();
        this.userData.velocity.z = 5;
        this.userData.velocity.applyQuaternion( quaternion );
        this.damage = 16;
    }

    tick(delta, playerPosition, player){

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
                this.parent.remove(this);
                return
            }

        // TODO: Check if projectile is too high or far behind.
        if ( this.position.y <= 0 || this.position.y >= 10 || this.position.z >= 10 ) {
            this.destroyProjectile();
        }

    }

    destroyProjectile(){
        this.parent.remove( this );
    }

}