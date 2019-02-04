import App from "App";
import {
    Vector3, Mesh,
} from 'babylonjs';
import GameObject from "go/GameObject";
import Turret from "go/Turret";

const PLAYER_HEIGHT = 2;

export default class Player extends GameObject {
    rotX: number = 0;
    rotY: number = 0;

    constructor(
        public app: App,
        position?: Vector3
    ) {
        super('Player', app, position);
        this.app.canvas.addEventListener('click', this.onMouseDown);
        window.addEventListener('mousemove', this.onMouseMove);
    }

    setupMesh() {
        return new Mesh('player', this.app.scene);
    }

    onMouseDown = (e: MouseEvent) => {
        if (!document.pointerLockElement) {
            if (!this.app) return;
            this.app.canvas.requestFullscreen()
            this.app.canvas.requestPointerLock();
            return;
        }
        this.placeTurret();
    }

    placeTurret() {
        if (!this.app) {
            return;
        }
        const { hit, pickedPoint } = this.app.scene.pick(
            window.innerWidth / 2,
            window.innerHeight / 2,
            (m: Mesh) => m === this.app.getOneByType('NetField').mesh
        );
        if (!hit) {
            return;
        }
        new Turret(this.app, pickedPoint.x, pickedPoint.z);
    }

    onMouseMove = (e: MouseEvent) => {
        if (!document.pointerLockElement) {
            return;
        }
        this.rotY += e.movementX / 200;
        this.rotX += e.movementY / 200;
        if (this.rotX > Math.PI / 2.3) {
            this.rotX = Math.PI / 2.3;
        }
        if (this.rotX < - Math.PI / 2.1) {
            this.rotX = -Math.PI / 2.1;
        }
        if (!this.app) {
            return;
        }
        if (!this.app) {

        }
        this.app.camera.rotation.x = this.rotX;
        this.app.camera.rotation.y = this.rotY;
    }

    update() {
        if (!this.app) return;
        const house = this.app.getOneByType('House');
        if (!house) return;
        const {boundingBox: bbox} = house.mesh.getBoundingInfo();
        this.app.camera.position.y = (bbox.maximumWorld.y + PLAYER_HEIGHT);
    }
    
    onDestroy() {
        super.onDestroy();
        this.app.canvas.removeEventListener('click', this.onMouseDown);
        window.removeEventListener('mousemove', this.onMouseMove);
    }
}
