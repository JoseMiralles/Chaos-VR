/* Jose Miralles, this loads all assets from a single .glb file */

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import assets from "../../../meshes/assets.glb";

export default class AssetStore {

    constructor( callback ){
        const loader = new GLTFLoader();
        loader.load("/dist/" + assets, (model) => {

            this.pistolModel = model.scenes[0].children[0];
            this.robot1 = model.scenes[0].children[1];

            callback( this );
        });
    }

}