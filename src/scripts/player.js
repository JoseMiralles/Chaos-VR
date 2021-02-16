import { Color } from "three";

import Pistol from "./pistol";

export default class Player {

    constructor( scene, renderer, assetStore, enemyGroup ){
        this.scene = scene;
        this.renderer = renderer;
        this.assetStore = assetStore;

        this._initialHealth = 100;
        this.health = this._initialHealth;

        this.mainEmmisiveColor = this.assetStore.mainEmissiveMaterial.color.getHex();

        this.setupWeapons( enemyGroup, assetStore );
        this.setupControllers(assetStore.pistolModel);

        this.onDeath = null;

        this.receiveDamage = this._receiveDamage;
    }

    _receiveDamage( damage ){
        this.health -= damage;

        this.assetStore.playerImpactSoundGenerator.play();

        if ( this.health <= 0 ){
            this.receiveDamage = ()=>{};
            this.pistol1.handleTargets = this.pistol1.handleMenuTargets;
            this.pistol2.handleTargets = this.pistol2.handleMenuTargets;
            if ( this.onDeath ) this.onDeath();
        }

        this.assetStore.mainEmissiveMaterial.color.setHex( 0xff0000 );
        this.assetStore.mainEmissiveMaterial.emissive.setHex( 0xff0000 );

        setTimeout(()=>{
            this.assetStore.mainEmissiveMaterial.color.setHex( this.mainEmmisiveColor );
            this.assetStore.mainEmissiveMaterial.emissive.setHex( this.mainEmmisiveColor );
        }, 500);
    }

    setupWeapons( enemyGroup, assetStore ){
        this.pistol1 = new Pistol( this.scene, enemyGroup, assetStore );
        this.pistol2 = new Pistol( this.scene, enemyGroup, assetStore );
        const startSelected = () => {
            this.pistol1.handleTargets = this.pistol1.handleEnemyTargets;
            this.pistol2.handleTargets = this.pistol2.handleEnemyTargets;
            this.health = this._initialHealth;
            this.receiveDamage = this._receiveDamage;
        };
        this.pistol1.startSelected = startSelected;
        this.pistol2.startSelected = startSelected;
    }

    setupControllers(pistolModel){
        this.controller1 = this.renderer.xr.getController(0);
        this.controller1.addEventListener( "selectstart", this.pistol1.shoot);
        this.scene.add( this.controller1 );
        
        this.controller2 = this.renderer.xr.getController(1);
        this.controller2.addEventListener( "selectstart", this.pistol2.shoot);
        this.scene.add( this.controller2 );

        this.controllerGrip1 = this.renderer.xr.getControllerGrip(0);
        this.controllerGrip2 = this.renderer.xr.getControllerGrip(1);

        const pistolModel2 = pistolModel.clone();
        this.pistol1.setBarrelEnd(pistolModel.children[2]);
        this.pistol2.setBarrelEnd(pistolModel2.children[2]);
        this.controllerGrip1.add( pistolModel );
        this.controllerGrip2.add( pistolModel2 );

        this.scene.add( this.controllerGrip1 );
        this.scene.add( this.controllerGrip2 );
    }

}