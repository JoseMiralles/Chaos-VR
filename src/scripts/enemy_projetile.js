import * as THREE from "three";

export default class EnemyProjectile extends THREE.Mesh {

    constructor( geometry, material, quaternion, position ){
        super( geometry, material );

        this.position.copy( position );
        this.userData.velocity = new THREE.Vector3();
        this.userData.velocity.z = 5;
        this.userData.velocity.applyQuaternion( quaternion );
    }

    tick(delta, playerPosition){

        this.position.z += this.userData.velocity.z * delta;
        this.position.y += this.userData.velocity.y * delta;
        this.position.x += this.userData.velocity.x * delta;

        // TODO: Check for collision with user.
        

        // TODO: Check if projectile is too high or far behind.
        if ( this.position.y <= 0 || this.position.y >= 10 || this.position.z >= 10 ) {
            this.destroyProjectile();
        }

    }

    destroyProjectile(){
        this.parent.remove( this );
    }

}