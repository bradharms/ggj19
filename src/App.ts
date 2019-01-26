import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from 'three';

import House from 'House';
import Player from 'Player';

// Base unit is meters

const HOUSE_W = 6;
const HOUSE_H = 6;
const HOUSE_D = 6;
const CAMERA_Y = 7;

export default class App {
    camera: PerspectiveCamera;
    scene: Scene;
    renderer: WebGLRenderer;

    player: Player;
    house: House;

    constructor() {
        this.setupRenderer();
        this.setupScene();
        window.addEventListener('load', this.onWindowLoad);
        window.addEventListener('resize', this.onWindowResize);
        this.animate();
    }

    setupRenderer() {
        this.camera = new PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        this.scene = new Scene();
        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setupScene() {
        this.player = new Player(this);
        this.house = new House(
            this,
            [HOUSE_W,
            HOUSE_H,
            HOUSE_D]
        );
    }

    onWindowLoad = () => {
        document.body.appendChild(this.renderer.domElement);
    }

    onWindowResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate = () => {
        this.player.update();
        this.house.update();

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.animate);
    }
}
