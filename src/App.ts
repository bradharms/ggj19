import {
    Scene,
    FreeCameraMouseInput,
    FreeCamera,
    Vector3,
    MeshBuilder,
    HemisphericLight,
    Engine,
    Light,
    Color3,
    Color4
} from 'babylonjs';

import House from 'House';
import Player from 'Player';

// Base unit is meters

const HOUSE_W = 6;
const HOUSE_H = 6;
const HOUSE_D = 6;
const CAMERA_Y = 7;

export default class App {
    canvas: HTMLCanvasElement;
    engine: Engine;
    camera: FreeCamera;
    scene: Scene;
    light: Light;

    player: Player;
    house: House;

    constructor() {
        window.addEventListener('load', this.onWindowLoad);
        window.addEventListener('resize', this.onWindowResize);
    }


    onWindowLoad = () => {
        this.setupRenderer();
        this.setupScene();

        this.engine.runRenderLoop(() => {
            this.update();
            this.scene.render();
        });
    }

    onWindowResize = () => {
        this.engine.resize();
    }

    setupRenderer() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.engine = new Engine(this.canvas, true);
        this.scene = new Scene(this.engine);
        this.scene.clearColor = new Color4(0,0,0,0.8);
        this.camera = new FreeCamera(
            'camera1',
            new Vector3(),
            this.scene
        );
        this.light = new HemisphericLight(
            'light1',
            new Vector3(0, -1, 0),
            this.scene
        );
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

    update() {
        this.player.update();
        this.house.update();
    }
}
