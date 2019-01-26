import App from "App";
import { Vector3, Euler } from "three";
// import FirstPersonControls from "FirstPersonControls";


const PLAYER_HEIGHT = 2;

export default class Player {

    // controls: FirstPersonControls;

    rotX: number = 0;
    rotY: number = 0;

    constructor(
        public app: App
    ) {
        // this.controls = new FirstPersonControls(app.camera);
        this.app.renderer.domElement.addEventListener('click', () => {
            // @ts-ignore
            this.app.renderer.domElement.requestPointerLock();
            window.addEventListener('mousemove', this.onMouseMove);
        })
    }

    onMouseMove = (e: MouseEvent) => {
        this.rotY += e.movementX / -200;
        this.rotX += e.movementY / -200;
        this.app.camera.rotation.x = this.rotX;
        this.app.camera.rotation.y = this.rotY;
    }


    update() {
        const {scene, house, camera} = this.app;
        camera.position.y = (house.bbox.max.y + PLAYER_HEIGHT);
        // this.controls.update()(1);
    }
}
