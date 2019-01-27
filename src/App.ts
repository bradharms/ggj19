import {
    Scene,
    FreeCamera,
    Vector3,
    Engine,
    Light,
    Color3,
    Color4,
    StandardMaterial,
    OimoJSPlugin,
    Sound,
    Mesh
} from 'babylonjs';

import * as C from 'C';
import House from 'go/House';
import Player from 'go/Player';
import NetField from 'go/NetField';
import GameObject from 'go/GameObject';
import Turret from 'go/Turret';
import Trojan from 'go/Trojan';
import TurretBullet from 'go/TurretBullet';
import buildDigitsMesh from 'buildDigitsMesh';

export default class App {
    canvas: HTMLCanvasElement;
    engine: Engine;
    camera: FreeCamera;
    scene: Scene;
    light: Light;
    mats: StandardMaterial[] = [];
    physics: OimoJSPlugin;
    enemySpawnTime = C.INITIAL_ENEMY_SPAWN_TIME;
    sounds: {[key: string]: Sound} = {};

    scoreDisplay: Mesh;
    scoreMaxDisplay: Mesh;
    gameObjectsByType: {[key: string]: GameObject[]} = {};
    gameObjects: GameObject[] = [];

    scoreMax = 0;
    protected _score = 0; // Score is also currency; minimal value needed to place turrets
    get score() { return this._score; }
    set score(score: number) {
        this._score = Math.max(0, score);
        if (this._score > this.scoreMax) {
            this.scoreMax = this._score;
        }

        if (this.scoreDisplay) {
            this.scene.removeMesh(this.scoreDisplay);
            this.scoreDisplay.dispose();
        }
        this.scoreDisplay = buildDigitsMesh(this.scene, this._score);
        this.scoreDisplay.material = this.mats[0];
        this.scoreDisplay.position.z = 40;
        this.scoreDisplay.position.y = 7;
        this.scoreDisplay.scaling = new Vector3(6, 6, 3);

        if (this.scoreMaxDisplay) {
            this.scene.removeMesh(this.scoreMaxDisplay);
            this.scoreMaxDisplay.dispose();
        }
        this.scoreMaxDisplay = buildDigitsMesh(this.scene, this.scoreMax);
        this.scoreMaxDisplay.material = this.mats[0];
        this.scoreMaxDisplay.position.z = 40;
        this.scoreMaxDisplay.position.y = 14;
        this.scoreMaxDisplay.scaling = new Vector3(4, 4, 2);
    }

    constructor() {
        window.addEventListener('load', this.onWindowLoad);
        window.addEventListener('resize', this.onWindowResize);
    }

    onWindowLoad = () => {
        this.setupEngine();
        this.setupMaterials();
        this.setupSound()
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

    setupSound() {
        this.sounds = {
            CannonFire: new Sound(
                'CannonFire',
                './soundFX/CannonFire.wav',
                this.scene,
                null,
                { spatialSound: true }
            ),
            CannonFire2: new Sound(
                'CannonFire2',
                './soundFX/CannonFire2.wav',
                this.scene,
                null,
                { spatialSound: true }
            ),
            CannonFire3: new Sound(
                'CannonFire3',
                './soundFX/CannonFire3.wav',
                this.scene,
                null,
                { spatialSound: true }
            ),
            EnemyDestroy: new Sound(
                'EnemyDestroy',
                './soundFX/EnemyDestroy.wav',
                this.scene,
                null,
                { spatialSound: true }
            ),
            EnemyDestroy2: new Sound(
                'EnemyDestroy2',
                './soundFX/EnemyDestroy2.wav',
                this.scene,
                null,
                { spatialSound: true }
            ),
            EnemyHit: new Sound(
                'EnemyHit',
                './soundFX/EnemyHit.wav',
                this.scene,
                null,
                { spatialSound: true }
            ),
        }
    }

    setupScene() {
        this.score = C.INITIAL_SCORE;
        new Player(this);
        new NetField(this);
        new House(this);
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
