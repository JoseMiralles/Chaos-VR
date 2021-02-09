import * as THREE from "three";
import { VRButton } from "./plugins/VRButton";
import { GLTFLoader } from "./plugins/GLTFLoader";
import { BoxLineGeometry } from "./plugins/BoxLineGeometry";

import pistolModel from "../../meshes/pistol_mesh.glb";
import { Raycaster } from "three";

export default class Game {

    constructor( HTMLElement ){
        this.radius = 0.01
        this.normal = new THREE.Vector3();
        this.relativeVelocity = new THREE.Vector3();
        this.bulletGeometry = new THREE.IcosahedronGeometry( this.radius, 0 );

        this.clock = new THREE.Clock();

        this.innitializeGame(HTMLElement);
        this.animate();
    }

    innitializeGame(HTMLElement){
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x1f1f1f );

        this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
        this.camera.position.set(0, 1.6, 3);
        this.rayCaster = new THREE.Raycaster();
        this.tempMatrix = new THREE.Matrix4();

        // TODO: switch to a better enviroment.
        this.room = new THREE.LineSegments(
            new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ),
            new THREE.LineBasicMaterial( { color: 0x808080  } )
        );
        this.room.geometry.translate(0, 3, 0);
        this.scene.add( this.room );
        this.scene.add( new THREE.BoxGeometry( 1, 1, 1 ) ); // Testing purposes

        // Setup lights
        this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

        const light = new THREE.DirectionalLight( 0xffffff  );
        light.position.set( 1,1,1 ).normalize();
        this.scene.add(light);

        this.renderer = new THREE.WebGL1Renderer( { antialias: true } ); //TODO: test performance without antialiasing.
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.xr.enabled = true;

        HTMLElement.appendChild( this.renderer.domElement );
        HTMLElement.appendChild( VRButton.createButton( this.renderer ) );

        // Setup controllers and listeners.
        this.controller1 = this.renderer.xr.getController(0);
        this.controller1.addEventListener( "selectstart", this.shoot(this.controller1).bind(this) );
        this.scene.add( this.controller1 );
        
        this.controller2 = this.renderer.xr.getController(1);
        this.controller2.addEventListener( "selectstart", this.shoot(this.controller2).bind(this) );
        this.scene.add( this.controller2 );

        this.controllerGrip1 = this.renderer.xr.getControllerGrip(0);
        this.controllerGrip2 = this.renderer.xr.getControllerGrip(1);
        const loader = new GLTFLoader();
        loader.load( "/dist/" + pistolModel, ( loadedModel ) => {
            const pistolModel1 = loadedModel.scene;
            const pistolModel2 = loadedModel.scene.clone();

            this.controller1.barrelEnd = pistolModel1.children[0];
            this.controller2.barrelEnd = pistolModel2.children[0];

            this.controllerGrip1.add( pistolModel1 );
            this.controllerGrip2.add( pistolModel2 );
        });
        this.scene.add( this.controllerGrip1 );
        this.scene.add( this.controllerGrip2 );

        window.addEventListener( 'resize', this.onWindowResize.bind(this) );
    }

    onWindowResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    shoot( controller ){
        return (e) => {
            this.tempMatrix.identity().extractRotation( controller.barrelEnd.matrixWorld );
            this.rayCaster.ray.origin.setFromMatrixPosition( controller.barrelEnd.matrixWorld );
            this.rayCaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( this.tempMatrix );

            const arrowHelper = new THREE.ArrowHelper(this.rayCaster.ray.direction, this.rayCaster.ray.origin, 300, 0x00adff);
            this.room.add( arrowHelper );

            setTimeout(() => {
                this.room.remove( arrowHelper );
            }, 50);

            const target = this.rayCaster.intersectObjects( this.scene.children )[0];
        }
    }

    animate(){
        this.renderer.setAnimationLoop( this.render.bind(this) );
    }

    // Runs once every frame.
    render(){

        // * 0.8 slows down the simulation.
        const delta = this.clock.getDelta() * 0.8;

        this.renderer.render( this.scene, this.camera );

    }

}