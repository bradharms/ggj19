import {
    Scene,
    FreeCamera,
    Vector3,
    Engine,
    Light,
    Color3,
    Color4,
    StandardMaterial,
    OimoJSPlugin
} from 'babylonjs';

import * as C from 'C';
import House from 'go/House';
import Player from 'go/Player';
import NetField from 'go/NetField';
import GameObject from 'go/GameObject';
import Turret from 'go/Turret';
import Trojan from 'go/Trojan';
import TurretBullet from 'go/TurretBullet';

export default class App {
    canvas: HTMLCanvasElement;
    engine: Engine;
    camera: FreeCamera;
    scene: Scene;
    light: Light;
    mats: StandardMaterial[] = [];
    physics: OimoJSPlugin;
    enemySpawnTime = C.INITIAL_ENEMY_SPAWN_TIME;

    gameObjects: GameObject[] = [];
    player: Player;
    house: House;
    netfield: NetField;
    turrets: Turret[] = [];
    turretBullets: TurretBullet[] = [];
    trojans: Trojan[] = [];

    constructor() {
        window.addEventListener('load', this.onWindowLoad);
        window.addEventListener('resize', this.onWindowResize);
    }

    onWindowLoad = () => {
        this.setupEngine();
        this.setupMaterials();
        this.setupScene();

        this.engine.runRenderLoop(this.update);
        setInterval(this.onEnemySpawn, C.INITIAL_ENEMY_SPAWN_TIME);
    }

    onWindowResize = () => {
        this.engine.resize();
    }

    setupEngine() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.engine = new Engine(this.canvas, true);
        this.scene = new Scene(this.engine);
        this.physics = new OimoJSPlugin();
        this.scene.enablePhysics(
            new Vector3(...C.GRAVITY),
            this.physics
        );
        this.scene.clearColor = new Color4(0,0,0,0.1);
        this.camera = new FreeCamera(
            'camera1',
            new Vector3(),
            this.scene
        );
    }

    setupMaterials() {
        this.mats[0] = new StandardMaterial('mat1', this.scene);
        this.mats[0].emissiveColor = new Color3(...C.COLOR_MAT0);
        this.mats[0].wireframe = true;

        this.mats[1] = new StandardMaterial('mat2', this.scene);
        this.mats[1].emissiveColor = new Color3(...C.COLOR_MAT1);
        this.mats[1].wireframe = true;

        this.mats[2] = new StandardMaterial('mat3', this.scene);
        this.mats[2].emissiveColor = new Color3(...C.COLOR_MAT2);
        this.mats[2].wireframe = true;

        this.mats[3] = new StandardMaterial('mat3', this.scene);
        this.mats[3].emissiveColor = new Color3(...C.COLOR_MAT3);
        this.mats[3].wireframe = true;
    }

    setupScene() {
        this.player = new Player(this);
        this.netfield = new NetField(this);
        this.house = new House(this);
    }

    update = () => {
        for (let go of this.gameObjects) {
            go.update();
        }
        this.scene.render();
    }

    onEnemySpawn = () => {
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * C.NETFIELD_DIAMETER_BOTTOM / 2;
        const z = Math.sin(angle) * C.NETFIELD_DIAMETER_BOTTOM / 2;
        const v3 = new Vector3(x, C.TROJAN_H / 2, z);
        new Trojan(this, v3);
    }
}
