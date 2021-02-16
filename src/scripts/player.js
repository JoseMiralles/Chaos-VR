import { Color, Mesh, PlaneGeometry } from "three";

import Pistol from "./pistol";

export default class Player {

    constructor( scene, renderer, assetStore, enemyGroup ){
        this.scene = scene;
        this.renderer = renderer;
        this.assetStore = assetStore;

        this._initialHealth = 100;
        this.health = this._initialHealth;

        this.mainEmmisiveColor = this.assetStore.mainEmissiveMaterial.color.getHex();

        this.healthBar = new HealthBar(0.1, 0.02, assetStore.mainEmissiveMaterial);
        this.setupWeapons( enemyGroup, assetStore );
        this.setupControllers(assetStore.pistolModel);

        this.onDeath = null;

        this.receiveDamage = this._receiveDamage;
    }

    _receiveDamage( damage ){
        this.health -= damage;
        this.healthBar.setHealth( this.health );

        this.assetStore.playerImpactSoundGenerator.play();

        if ( this.health <= 0 ){
            this.receiveDamage = ()=>{};
            this.pistol1.handleTargets = this.pistol1.handleMenuTargets;
            this.pistol2.handleTargets = this.pistol2.handleMenuTargets;
            if ( this.onDeath ) this.onDeath();
        }

        this.assetStore.mainEmissiveMaterial.color.setHex( 0xff0000 );
        this.assetStore.mainEmissiveMaterial.emissive.setHex( 0xff0000 );

        if (this.healthTimeout) clearTimeout( this.healthTimeout );
        this.healthTimeout = setTimeout(()=>{
            this.assetStore.mainEmissiveMaterial.color.setHex( this.mainEmmisiveColor );
            this.assetStore.mainEmissiveMaterial.emissive.setHex( this.mainEmmisiveColor );
        }, 100);
    }

    setupWeapons( enemyGroup, assetStore ){
        this.pistol1 = new Pistol( this.scene, enemyGroup, assetStore );
        this.pistol2 = new Pistol( this.scene, enemyGroup, assetStore );
        this.pistol1.startSelected = this.startSelected.bind(this);
        this.pistol2.startSelected = this.startSelected.bind(this);
    }

    startSelected(){
        this.pistol1.handleTargets = this.pistol1.handleEnemyTargets;
        this.pistol2.handleTargets = this.pistol2.handleEnemyTargets;
        this.health = this._initialHealth;
        this.healthBar.reset();
        this.receiveDamage = this._receiveDamage;
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

        this.controllerGrip2.add( this.healthBar );

        this.scene.add( this.controllerGrip1 );
        this.scene.add( this.controllerGrip2 );
    }

}

class HealthBar extends Mesh {

    constructor(widht, height, material){
        const geometry = new PlaneGeometry( widht, height );
        super(geometry, material);
        this.position.set(-0.04, 0, 0)
        this.rotateY(1.57);
        this.rotateX(1.57);

        this.geometry = geometry;
        this._initialWidth = widht;
        this.initialHeight = height;
    }

    setHealth( hp ){
        if (hp < 1) hp = 1;
        this.scale.set( hp / 100 , 1, 1);
    }

    reset(){
        this.scale.set(1, 1, 1);
    }

}