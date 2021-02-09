import * as THREE from "three";
import { VRButton } from "./plugins/VRButton";
import { GLTFLoader } from "./plugins/GLTFLoader";
import { BoxLineGeometry } from "./plugins/BoxLineGeometry";

import pistolModel from "../../meshes/pistol_mesh.glb";

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

        // TODO: switch to a better enviroment.
        this.room = new THREE.LineSegments(
            new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ),
            new THREE.LineBasicMaterial( { color: 0x808080  } )
        );
        this.room.geometry.translate(0, 3, 0);
        this.scene.add( this.room );

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
        this.controller1.addEventListener( "connected", (e) => {
            this.controller1.add( this.buildController( e.data ) );
        });
        this.controller1.addEventListener( "disconnected", function(e){
            this.remove( this.children[0] );
        });
        this.scene.add( this.controller1 );
        
        this.controller2 = this.renderer.xr.getController(1);
        this.controller2.addEventListener( "selectstart", this.shoot(this.controller2).bind(this) );
        this.controller2.addEventListener( "connected", (e) => {
            this.controller2.add( this.buildController( e.data ) );
        });
        this.controller2.addEventListener( "disconnected", function(e){
            this.remove( this.children[0] );
        });
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

    buildController( data ){
        let geometry, material;

        switch( data.targetRayMode ){

            case "tracked-pointer":
                geometry = new THREE.BufferGeometry();
                geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
                geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );
                material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );
                return new THREE.Line( geometry, material );

            case "gaze":
                geometry = new THREE.RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
                material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
                return new THREE.Mesh( geometry, material );

        }
    }

    onWindowResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
    
    // Returns a function which get's called when a trigger button is pressed.
    shoot( controller ){
        return (e) => {
            const bullet = new THREE.Mesh( this.bulletGeometry,
                new THREE.MeshLambertMaterial( { color: 0x00adff } ));

            // set initial bullet position relative to the controller.
            controller.barrelEnd.getWorldPosition(bullet.position);
            bullet.userData.velocity = new THREE.Vector3();
            bullet.userData.velocity.x = Math.random() * 0.01 - 0.005;
            bullet.userData.velocity.y = Math.random() * 0.01 - 0.005;
            bullet.userData.velocity.z = Math.random() * 0.01 - 0.005;

            // Set bullet direction relative to the controller direction.
            controller.barrelEnd.getWorldQuaternion(bullet.userData.velocity.quaternion);

            this.room.add( bullet );
        } 
    }

    animate(){
        this.renderer.setAnimationLoop( this.render.bind(this) );
    }

    // Runs once every frame.
    render(){
        
        // * 0.8 slows down the simulation.
        const delta = this.clock.getDelta() * 0.8;

        const range = 3 - this.radius;

        this.renderer.render( this.scene, this.camera );

    }

}