import * as THREE from "three";

export default class Pistol {

    /* A pistol object, takes in a scene object which could be a group instead of the main scene. */
    constructor( scene, enemyGroup, assetStore, playerProjectileGroup ){
        this.rayCaster = new THREE.Raycaster();
        this.tempMatrix = new THREE.Matrix4();
        this.damage = 26;
        this.scene = scene;
        this.enemyGroup = enemyGroup;
        this.shotModel = assetStore.shotModel;
        this.shotSoundGenerator = assetStore.shotSoundGenerator;
        this.playerProjectileGroup = playerProjectileGroup;

        this.handleTargets = this.handleMenuTargets;

        this.shoot = this.shoot.bind(this);
    }

    // Set's the starting point of each shot.
    setBarrelEnd( barrelEnd ){
        this.barrelEnd = barrelEnd;
    }

    // Shoots and applies damage to the target, if any.
    shoot(){
        this.shotSoundGenerator.play();

        this.tempMatrix.identity().extractRotation( this.barrelEnd.matrixWorld );
        this.rayCaster.ray.origin.setFromMatrixPosition( this.barrelEnd.matrixWorld );
        this.rayCaster.ray.direction.set( 0, 0, 1 ).applyMatrix4( this.tempMatrix );
        
        // TODO: recycle these variables.
        const position = new THREE.Vector3();
        position.setFromMatrixPosition( this.barrelEnd.matrixWorld );
        const quaternion = new THREE.Quaternion();
        this.barrelEnd.getWorldQuaternion( quaternion );
        this.playerProjectileGroup.shootFrom( quaternion, position, 20 );

        // This function gets delegated depending on wether the game menu is up or down.
        this.handleTargets();
    }

    // Delegated when there are enemies, and the menu is down.
    handleEnemyTargets(){
        const target = this.rayCaster.intersectObjects( this.enemyGroup.children, true )[0];
        if (target && target.object.parent.parent.applyDamage)
            target.object.parent.parent.applyDamage( this.damage );
    }

    // Delegated when the menu is open.
    handleMenuTargets(){
        const targets = this.rayCaster.intersectObjects( this.scene.children, true );
        targets.forEach(target => {
            if ( target.object.name === "1playButton001" ){
                this.startSelected();
                target.object.parent.onStartButtonClicked();
                this.scene.remove( target.object.parent );
                return;
            }
        });
    }

}