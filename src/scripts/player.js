import Pistol from "./pistol";
import { GLTFLoader } from "./plugins/GLTFLoader";
import pistolModel from "../../meshes/pistol_mesh.glb";

export default class Player {

    constructor( scene, renderer ){
        this.scene = scene;
        this.renderer = renderer;

        this.setupWeapons();
        this.setupControllers();
    }

    
    setupWeapons(){
        this.pistol1 = new Pistol( this.scene );
        this.pistol2 = new Pistol( this.scene );
    }

    setupControllers(){
        this.controller1 = this.renderer.xr.getController(0);
        this.controller1.addEventListener( "selectstart", this.pistol1.shoot);
        this.scene.add( this.controller1 );
        
        this.controller2 = this.renderer.xr.getController(1);
        this.controller2.addEventListener( "selectstart", this.pistol2.shoot);
        this.scene.add( this.controller2 );

        this.controllerGrip1 = this.renderer.xr.getControllerGrip(0);
        this.controllerGrip2 = this.renderer.xr.getControllerGrip(1);
        const loader = new GLTFLoader();
        loader.load( "/dist/" + pistolModel, ( loadedModel ) => {
            const pistolModel1 = loadedModel.scene;
            const pistolModel2 = loadedModel.scene.clone();

            this.pistol1.setBarrelEnd(pistolModel1.children[0]);
            this.pistol2.setBarrelEnd(pistolModel2.children[0]);

            this.controllerGrip1.add( pistolModel1 );
            this.controllerGrip2.add( pistolModel2 );
        });
        this.scene.add( this.controllerGrip1 );
        this.scene.add( this.controllerGrip2 );
    }

}