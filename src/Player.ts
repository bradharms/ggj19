import App from "App";
import {
    Vector3,
} from 'babylonjs';

const PLAYER_HEIGHT = 2;

export default class Player {

    // controls: FirstPersonControls;

    rotX: number = 0;
    rotY: number = 0;

    constructor(
        public app: App
    ) {
        // this.controls = new FirstPersonControls(app.camera);
        this.app.canvas.addEventListener('click', () => {
            // @ts-ignore
            this.app.canvas.requestPointerLock();
            window.addEventListener('mousemove', this.onMouseMove);
        })
    }

    onMouseMove = (e: MouseEvent) => {
        this.rotY += e.movementX / 200;
        this.rotX += e.movementY / 200;
        if (this.rotX > Math.PI / 2.3) {
            this.rotX = Math.PI / 2.3;
        }
        if (this.rotX < 0) {
            this.rotX = 0;
        }
        this.app.camera.rotation.x = this.rotX;
        this.app.camera.rotation.y = this.rotY;
    }


    update() {
        const {house, camera} = this.app;
        const {boundingBox: bbox} = house.mesh.getBoundingInfo();
        if (!a) {
            a = true;
            console.log(bbox);
        }
        camera.position.y = (bbox.maximumWorld.y + PLAYER_HEIGHT);
    }
}

let a = false;
