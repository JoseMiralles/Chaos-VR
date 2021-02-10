import * as THREE from "three";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import { BoxLineGeometry } from "./plugins/BoxLineGeometry";
import Player from "./player";
import AssetStore from "./util/AssetStore";
import EnemySpawner from "./enemy_spawner";

export default class Game {

    constructor( HTMLElement ){
        this.radius = 0.01
        this.clock = new THREE.Clock();

        // Load 3d assets, initialize game, and start animation loop.
        this.assetStore = new AssetStore( () => {
            this.innitializeGame(HTMLElement);
            this.setupEnemySpawner({limit: 3});
            this.setupPlayer();
            this.animate();
        });
    }

    innitializeGame(HTMLElement){
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x1f1f1f );

        this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 25 );
        this.camera.position.set(0, 1.6, 3);

        // Setup lights
        this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

        const light = new THREE.DirectionalLight( 0xffffff  );
        light.position.set( 1,1,1 ).normalize();
        this.scene.add(light);

        this.scene.add(this.assetStore.enviroment);

        this.renderer = new THREE.WebGL1Renderer( { antialias: true } ); //TODO: test performance without antialiasing.
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.xr.enabled = true;

        HTMLElement.appendChild( this.renderer.domElement );
        HTMLElement.appendChild( VRButton.createButton( this.renderer ) );

        window.addEventListener( 'resize', this.onWindowResize.bind(this) );
    }

    setupEnemySpawner( options ){
        this.enemyGroup = new THREE.Group();
        this.scene.add(this.enemyGroup);
        this.enemySpawner = new EnemySpawner(
            this.enemyGroup,
            this.assetStore.robot1,
            options.limit
        );
    }

    setupPlayer(){
        this.player = new Player( this.scene, this.renderer, this.assetStore, this.enemyGroup );
    }

    onWindowResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    animate(){
        this.renderer.setAnimationLoop( this.tick.bind(this) );
    }

    // Runs once every frame.
    tick(){

        // * 0.8 slows down the simulation.
        const delta = this.clock.getDelta() * 0.8;

        this.enemyGroup.children.forEach( child => child.tick(delta) );

        this.renderer.render( this.scene, this.camera );

    }

}