import * as THREE from "three";

export default class ScoreSystem{

    constructor( scene, assetStore ){
        this.score = 0;
        this._isCounting = true;
        this.scene = scene;
        this.assetStore = assetStore;

        this.createText();
    }

    createText(){
        this.material = this.assetStore.mainEmissiveMaterial;
        this.geometry = new THREE.TextGeometry( String(this.score), {
            font: this.assetStore.mainFont,
            size: 6,
            height: 0,
        } );
        this.geometry.translate(-10, 25, -40);
        this.text = new THREE.Mesh( this.geometry, this.material );
        this.scene.add( this.text );
    }

    refreshText(){
        this.scene.remove( this.text );
        this.createText();
    }

    incrementScoreBy( n ){
        if (this._isCounting){
            this.score += n;
            this.refreshText();
        }
    }

    stopCounting(){
        this._isCounting = false;
    }

    startCounting(){
        this._isCounting = true;
    }

    restart(){
        this.score = 0;
        this.refreshText();
    }

}