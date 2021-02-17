/* Jose Miralles, this loads all assets from a single .glb file */

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader";

import assets from "../../../meshes/assets.glb";
import shot from "../../../audio/shot.mp3";
import botImpact from "../../../audio/botImpact.mp3";
import botDestroyed from "../../../audio/bot_destroyed.mp3";
import botExplosion from "../../../audio/bot_explosion.mp3";
import playerImpact from "../../../audio/player_impact.mp3";

import font from "../../../fonts/toboto_medium.ttf";

export default class AssetStore {

    constructor( allAssetsLoadedCallback ){

        this.listener = new THREE.AudioListener();
        this.allAssetsLoadedCallback = allAssetsLoadedCallback;

        this.pathPrepend = "dist/";
        this.setupLocalAssets();
        this.load3DAssets();
    }

    setupLocalAssets(){
        this.shutDownMaterial = new THREE.MeshBasicMaterial({
            color: 0x2b2b2b
        });
    }

    load3DAssets(){

        const gltfloader = new GLTFLoader();
        gltfloader.load(this.pathPrepend + assets, (model) => {
            this.pistolModel = model.scenes[0].children[0];
            this.robot1 = model.scenes[0].children[1];
            this.robot2 = model.scenes[0].children[5];
            this.enviroment = model.scenes[0].children[3];
            this.shotModel = model.scenes[0].children[2];
            this.mainEmissiveMaterial = this.robot1.children[1].material;
            this.shotModel.material = new THREE.MeshLambertMaterial
                ({ emissive: 0xfbff00, color: 0xfbff00 });

            this.menu = model.scenes[0].children[4];
            this.menu.position.z = -3;

            this.loadAudioFiles();
        });

    }

    loadAudioFiles(){
        const audioLoader = new THREE.AudioLoader();

        const filesToLoad = [
            {
                path: shot,
                key: "shotSoundGenerator",
                audioClass: THREE.Audio,
                numberOfAudios: 30,
                volume: 0.2
            },
            { 
                path: botImpact,
                key: "botImpactSoundGenerator",
                audioClass: THREE.PositionalAudio,
                numberOfAudios: 20,
                volume: 0.8
            },
            { 
                path: botDestroyed,
                key: "botDestroyedSoundGenerator",
                audioClass: THREE.PositionalAudio,
                numberOfAudios: 5,
                volume: 1
            },
            { 
                path: botExplosion,
                key: "botExplosionSoundGenerator",
                audioClass: THREE.PositionalAudio,
                numberOfAudios: 5,
                volume: 1
            },
            { 
                path: playerImpact,
                key: "playerImpactSoundGenerator",
                audioClass: THREE.Audio,
                numberOfAudios: 5,
                volume: 1
            },
        ];

        filesToLoad.forEach( ( params, i ) =>
            audioLoader.load (this.pathPrepend + params.path, (buffer) => {
                this[params.key] = new SoundGenerator(
                    buffer, this.listener, params.numberOfAudios, params.audioClass, params.volume
                );
                
                // Notify that all assets are loaded after the last sound is loaded.
                if ( i === filesToLoad.length - 1 )
                    this.allAssetsLoadedCallback();
            }, null, (err) => console.log(err)));
    }

    loadFonts(){
        const loader = new TTFLoader();
        const fontLoader = new THREE.FontLoader();
        console.log(font);
        loader.load(this.pathPrepend + font, ( _font ) => {
            this.setupMenu( fontLoader.parse(_font) );
        });
        this.allAssetsLoadedCallback();
    }

    // Setups the main menu, and it's contents.
    setupMenuWithFont(_font){
        this.menu.position.z = -3;

        const color = 0xffffff;

        const material = new THREE.MeshBasicMaterial( {
            color: color,
        } );

        const par =
        "Fight hordes of bots.\n" +
        "Aim and shoot with your controllers.\n" +
        "Move around to avoid projectiles.";

        const geometry = new THREE.TextGeometry( par, {
            font: _font,
            size: 0.1,
            height: 0,
        } );
        geometry.translate(-1, 1.7 , 0.1)
        const text = new THREE.Mesh( geometry, material );
        this.menu.add( text );
    }

}

class SoundGenerator {

    constructor( buffer, listener, numberOfAudios, audioClass, volume ){
        this.array = new Array( numberOfAudios );
        this.pos = 0;
        this.populateArray( buffer, listener, audioClass, volume );
    }

    play(){
        this.getNext().play();
    }

    // Used for positional audio.
    getNext(){
        this.pos ++;
        if ( this.pos > this.array.length - 1 ) this.pos = 0;
        return this.array[this.pos];
    }

    populateArray( buffer, listener, audioClass, volume ){
        for (let i = 0; i < this.array.length; i++) {
            const audio = new audioClass( listener );
            audio.setBuffer(buffer);
            audio.setVolume( volume );
            this.array[i] = audio;
        };
    }

}