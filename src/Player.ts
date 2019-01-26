import App from "App";
import { Vector3 } from "three";
import FirstPersonControls from "FirstPersonControls";


const PLAYER_HEIGHT = 2;

export default class Player {

    controls: FirstPersonControls;

    constructor(
        public app: App
    ) {
        this.controls = new FirstPersonControls(app.camera);
    }

    update() {
        const {scene, house, camera} = this.app;
        camera.position.y = (house.bbox.max.y + PLAYER_HEIGHT);
        this.controls.update()(1);
    }
}
