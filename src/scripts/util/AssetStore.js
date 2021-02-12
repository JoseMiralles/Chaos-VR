/* Jose Miralles, this loads all assets from a single .glb file */

import { MeshLambertMaterial } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import assets from "../../../meshes/assets.glb";

export default class AssetStore {

    constructor( callback ){
        const gltfloader = new GLTFLoader();
        gltfloader.load("/dist/" + assets, (model) => {

            this.pistolModel = model.scenes[0].children[0];
            this.robot1 = model.scenes[0].children[1];
            this.enviroment = model.scenes[0].children[3];
            this.shotModel = model.scenes[0].children[2];
            this.shotModel.material = new MeshLambertMaterial
                ({ emissive: 0xfbff00, color: 0xfbff00 });

            callback( this );
        });
    }

}