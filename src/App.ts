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
    Color4,
    StandardMaterial
} from 'babylonjs';

import * as C from 'C';
import House from 'go/House';
import Player from 'go/Player';
import NetField from 'go/NetField';
import IGameObject from 'go/IGameObject';
import Turret from 'go/Turret';

export default class App {
    canvas: HTMLCanvasElement;
    engine: Engine;
    camera: FreeCamera;
    scene: Scene;
    light: Light;
    mats: StandardMaterial[] = [];

    gameObjects: IGameObject[] = [];
    player: Player;
    house: House;
    netfield: NetField;
    turrets: Turret[] = [];

    constructor() {
        window.addEventListener('load', this.onWindowLoad);
        window.addEventListener('resize', this.onWindowResize);
    }

    onWindowLoad = () => {
        this.setupRenderer();
        this.setupMaterials();
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

    setupMaterials() {
        this.mats[0] = new StandardMaterial('mat1', this.scene);
        this.mats[0].emissiveColor = new Color3(...C.COLOR_MAT1);
        this.mats[0].wireframe = true;

        this.mats[1] = new StandardMaterial('mat2', this.scene);
        this.mats[1].emissiveColor = new Color3(...C.COLOR_MAT2);
        this.mats[1].wireframe = true;

        this.mats[2] = new StandardMaterial('mat3', this.scene);
        this.mats[2].emissiveColor = new Color3(...C.COLOR_MAT3);
        this.mats[2].wireframe = true;
    }

    setupScene() {
        this.player = new Player(this);
        this.netfield = new NetField(this);
        this.house = new House(this);
    }

    update() {
        for (let go of this.gameObjects) {
            go.update();
        }
    }
}
