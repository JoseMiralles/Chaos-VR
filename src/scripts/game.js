import * as THREE from "three";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import { BoxLineGeometry } from "./plugins/BoxLineGeometry";
import Player from "./player";
import AssetStore from "./util/AssetStore";
import EnemySpawner from "./enemy_spawner";

export default class Game {

    constructor( HTMLElement, performanceMode = false ){
        this.clock = new THREE.Clock();
        this.performanceMode = performanceMode;

        // Load 3d assets, initialize game, and start animation loop.
        this.assetStore = new AssetStore( () => {
            this.innitializeGame(HTMLElement);
            this.setupEnemySpawner({limit: 5});
            this.setupPlayer();
            this.animate();
        });
    }

    innitializeGame(HTMLElement){
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x2b2c3b );

        this.camera = new THREE.PerspectiveCamera(
            75, window.innerWidth / window.innerHeight, 0.1, 500
            );
        this.camera.position.set(0, 1.6, 0);

        // Setup lights
        this.scene.add( new THREE.HemisphereLight( 0xffffff, 0xffffff ) );

        if (!this.performanceMode){
            const light = new THREE.DirectionalLight( 0xffffff );
            light.position.set( 0,0.5,-20 ).normalize();
            this.scene.add(light);
        }

        this.scene.add(this.assetStore.enviroment);

        this.renderer = new THREE.WebGL1Renderer( { antialias: !this.performanceMode } ); //TODO: Make this a toggable setting.
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.xr.enabled = true;

        HTMLElement.appendChild( this.renderer.domElement );
        HTMLElement.appendChild( VRButton.createButton( this.renderer ) );

        window.addEventListener( 'resize', this.onWindowResize.bind(this) );
    }

    setupEnemySpawner( options ){
        this.enemySpawner = new EnemySpawner(
            this.assetStore.robot1,
            options.limit
        );
        this.scene.add(this.enemySpawner.enemyGroup);
        this.scene.add(this.enemySpawner.projectileGroup);
    }

    setupPlayer(){
        this.player = new Player( this.scene, this.renderer, this.assetStore, this.enemySpawner.enemyGroup );
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
        const playerPosition = new THREE.Vector3();
        this.camera.getWorldPosition( playerPosition );

        // * 0.8 slows down the simulation.
        const delta = this.clock.getDelta() * 0.8;
        
        this.enemySpawner.enemyGroup.children.forEach(
            enemy => enemy.tick( delta, playerPosition ) );
        this.enemySpawner.projectileGroup.children.forEach(
            projectile => projectile.tick( delta, playerPosition, this.player ) );

        this.renderer.render( this.scene, this.camera );

    }

}