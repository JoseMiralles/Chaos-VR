/* Jose Miralles, this loads all assets from a single .glb file */

import { GLTFLoader } from "../plugins/GLTFLoader";
import assets from "../../../meshes/assets.glb";

export default class AssetStore {

    constructor( callback ){
        const loader = new GLTFLoader();
        loader.load("/dist/" + assets, (model) => {
            this.pistolModel = model.scene;

            callback( this );
        });
    }

}