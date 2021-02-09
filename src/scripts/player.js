import Pistol from "./pistol";

export default class Player {

    constructor( scene, renderer, assetStore, enemyGroup ){
        this.scene = scene;
        this.renderer = renderer;

        this.setupWeapons( enemyGroup );
        this.setupControllers(assetStore.pistolModel);
    }

    setupWeapons( enemyGroup ){
        this.pistol1 = new Pistol( this.scene, enemyGroup );
        this.pistol2 = new Pistol( this.scene, enemyGroup );
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

        const pistolModel2 = pistolModel.clone()
        this.pistol1.setBarrelEnd(pistolModel.children[0]);
        this.pistol2.setBarrelEnd(pistolModel2.children[0]);
        this.controllerGrip1.add( pistolModel );
        this.controllerGrip2.add( pistolModel2 );

        this.scene.add( this.controllerGrip1 );
        this.scene.add( this.controllerGrip2 );
    }

}