import * as THREE from "three";

export default class PlayerProjectileGroup extends THREE.Group {

    constructor( numberOfProjectiles, assetStore ){
        super();

        this.assetStore = assetStore;
        this.populate( numberOfProjectiles );
        this.pos = 0;
    }

    populate( n ){

        for (let i = 1; i <= n; i++ ){
            const projectile = new PlayerProjectile();
            // projectile.add( this.assetStore.shotModel );
            const geometry = new THREE.SphereGeometry( 5, 32, 32 );
            const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
            const sphere = new THREE.Mesh( geometry, material );
            projectile.add( sphere );
            this.add(
                projectile
            );
        }
    }

    shootFrom( quaternion, postion, velocity ){
        if ( true ){
            this.children[ this.pos ].spawn(
                quaternion, postion, velocity
            );
        }
        this.pos ++;
        if ( this.pos >= this.children.length ) this.pos = 0;
    }

}

class PlayerProjectile extends THREE.Mesh {

    constructor(){
        super();
        this.position.y = -10;
        this.tick = () => {};
        this.free = true;
    }

    spawn( quaternion, position, velocity ){
        this.free = false;
        this.despawnTimer = 1;
        this.position.copy( position );
        this.setRotationFromQuaternion(quaternion);
        // this.rotateX(1.57); // Point towards the player (90degs).
        this.userData.velocity = new THREE.Vector3();
        this.userData.velocity.z = velocity;
        this.userData.velocity.applyQuaternion( quaternion );

        this.tick = this.mainTick;
    }

    deSpawn(){
        this.tick = ()=>{};
        this.position.y = -10;
        this.free = true;
    }

    mainTick( delta ){

        this.position.z += this.userData.velocity.z * delta;
        this.position.y += this.userData.velocity.y * delta;
        this.position.x += this.userData.velocity.x * delta;

        // Despawn this tracer if the timer is ended.
        this.despawnTimer -= delta;
        if (this.despawnTimer < 0){
            this.deSpawn();
        }

    }

}