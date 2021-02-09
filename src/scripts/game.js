import * as THREE from "three";
import { VRButton } from "./plugins/VRButton";
import { BoxLineGeometry } from "./plugins/BoxLineGeometry";
import Player from "./player";

export default class Game {

    constructor( HTMLElement ){
        this.radius = 0.01

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

        this.player = new Player( this.scene, this.renderer );

        window.addEventListener( 'resize', this.onWindowResize.bind(this) );
    }

    onWindowResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
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