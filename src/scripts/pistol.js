import * as THREE from "three";

export default class Pistol {

    /* A pistol object, takes in a scene object which could be a group instead of the main scene. */
    constructor( scene, enemyGroup, shotModel ){
        this.rayCaster = new THREE.Raycaster();
        this.tempMatrix = new THREE.Matrix4();
        this.damage = 26;
        this.scene = scene;
        this.enemyGroup = enemyGroup;
        this.shotModel = shotModel;

        this.shoot = this.shoot.bind(this);
    }

    // Set's the starting point of each shot.
    setBarrelEnd( barrelEnd ){
        this.barrelEnd = barrelEnd;
    }

    // Shoots and applies damage to the target, if any.
    shoot(){

        if ( !this.barrelEnd ) {
            console.warn("This pistol doesn't have a barrel end! Assign one.");
            return
        }

        this.tempMatrix.identity().extractRotation( this.barrelEnd.matrixWorld );
        this.rayCaster.ray.origin.setFromMatrixPosition( this.barrelEnd.matrixWorld );
        this.rayCaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( this.tempMatrix );

        // const arrowHelper = new THREE.ArrowHelper
        //     (this.rayCaster.ray.direction, this.rayCaster.ray.origin, 1000, 0x00adff);
        // this.scene.add( arrowHelper );

        const shot = this.shotModel.clone();
        shot.setRotationFromMatrix(this.barrelEnd.matrixWorld)
        shot.position.setFromMatrixPosition(this.barrelEnd.matrixWorld);
        this.scene.add( shot );

        setTimeout(() => {
            this.scene.remove( shot );
        }, 20);

        const target = this.rayCaster.intersectObjects( this.enemyGroup.children, true )[0];
        if (target && target.object.parent.parent.applyDamage)
            target.object.parent.parent.applyDamage( this.damage );
    }

}