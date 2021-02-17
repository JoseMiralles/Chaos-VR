import * as THREE from "three";

import EnemyProjectile from "./enemy_projetile";

export default class projectileGroup extends THREE.Group {

    constructor( numberOfProjectiles ){
        super();
        this.populate( numberOfProjectiles );
        this.pos = 0;
    }

    despawnAll(){
        this.children.forEach(projectile => projectile.deSpawn());
    }

    populate( n ){
        // Cone mesh
        const sphereGeometry = new THREE.ConeGeometry( 0.1, 0.3, 3, 1 );
        const material = new THREE.MeshBasicMaterial
            ({ color: 0xfbff00 });

        // Wireframe
        // const edgesGeometry = new THREE.EdgesGeometry( sphereGeometry );
        const wfMaterial = new THREE.LineBasicMaterial( { color: 0x131313 } );
        // const wireframe = new THREE.WireframeGeometry( sphereGeometry );
        const lines = new THREE.LineSegments( sphereGeometry, wfMaterial );

        for (let i = 1; i <= n; i++ ){
            const projectile = new EnemyProjectile( sphereGeometry, material );
            projectile.add( lines.clone() );
            this.add(
                projectile
            );
        }
    }

    shootFrom( quaternion, postion, velocity ){
        if ( this.children[ this.pos ].free ){
            this.children[ this.pos ].spawn(
                quaternion, postion, velocity
            );
        }
        this.pos ++;
        if ( this.pos >= this.children.length ) this.pos = 0;
    }

}