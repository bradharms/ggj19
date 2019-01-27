import {
    Vector3,
    Sound,
    Scene,
    FreeCamera,
    Engine,
    Light,
    Color3,
    Color4,
    StandardMaterial,
    OimoJSPlugin,
    Mesh
} from 'babylonjs';
import Color from 'color';
import * as C from 'C';
import House from 'go/House';
import Player from 'go/Player';
import NetField from 'go/NetField';
import GameObject from 'go/GameObject';
import buildDigitsMesh from 'buildDigitsMesh';
import EnemySpawner from 'go/EnemySpawner';

export default class App {
    canvas: HTMLCanvasElement;
    engine: Engine;
    camera: FreeCamera;
    scene: Scene;
    light: Light;
    mats: StandardMaterial[] = [];
    physics: OimoJSPlugin;
    sounds: {[key: string]: Sound} = {};

    scoreDisplay: Mesh;
    scoreMaxDisplay: Mesh;
    enemiesKilledDisplay: Mesh;
    waveNumberDisplay: Mesh;

    gameObjectsByType: {[key: string]: GameObject[]} = {};
    gameObjects: GameObject[] = [];

    enemySpawnTime: number;
    enemySpeed: number;

    protected _enemiesKilled = 0;
    get enemiesKilled() {
        return this._enemiesKilled;
    }
    set enemiesKilled(k: number) {
        this._enemiesKilled = k;
        if (this.enemiesKilledDisplay) {
            this.scene.removeMesh(this.enemiesKilledDisplay);
            this.enemiesKilledDisplay.dispose();
        }
        this.enemiesKilledDisplay = buildDigitsMesh(this.scene, this._enemiesKilled);
        this.enemiesKilledDisplay.material = this.mats[3];
        this.enemiesKilledDisplay.position.x = 40;
        this.enemiesKilledDisplay.position.y = 7;
        this.enemiesKilledDisplay.scaling = new Vector3(4, 4, 2);
        this.enemiesKilledDisplay.rotation.y = Math.PI / 2;
    }

    protected _waveNumber = 0;
    get waveNumber() {
        return this._waveNumber;
    }
    set waveNumber(w: number) {
        this._waveNumber = w;
        if (this.waveNumberDisplay) {
            this.scene.removeMesh(this.waveNumberDisplay);
            this.waveNumberDisplay.dispose();
        }
        this.waveNumberDisplay = buildDigitsMesh(this.scene, this._waveNumber);
        this.waveNumberDisplay.material = this.mats[1];
        this.waveNumberDisplay.position.x = -40;
        this.waveNumberDisplay.position.y = 7;
        this.waveNumberDisplay.scaling = new Vector3(4, 4, 2);
        this.waveNumberDisplay.rotation.y = -Math.PI / 2;
    }

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
        this.scoreDisplay.material = this.mats[2];
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
        this.reset();

        this.engine.runRenderLoop(this.update);
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
        this.mats.forEach(m => { m.dispose(); });
        this.mats[0] = new StandardMaterial('mat1', this.scene);
        this.mats[0].emissiveColor = new Color3(...C.COLOR_MAT0);
        this.mats[0].wireframe = true;

        this.mats[1] = new StandardMaterial('mat2', this.scene);
        this.mats[1].emissiveColor = new Color3(...C.COLOR_MAT1);
        this.mats[1].wireframe = true;

        this.mats[2] = new StandardMaterial('mat3', this.scene);
        this.mats[2].emissiveColor = new Color3(...C.COLOR_MAT2);
        this.mats[2].wireframe = true;

        this.mats[3] = new StandardMaterial('mat4', this.scene);
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
            ProbePing: new Sound(
                'ProbePing',
                './soundFX/ProbePing.wav',
                this.scene,
                null,
                { spatialSound: true, initialSpeed: 0.5 }
            ),
        }
    }

    reset = () => {
        this.setupMaterials();
        for (const obj of this.gameObjects) {
            obj.destroy(true);
        }
        this.enemySpawnTime = C.INITIAL_ENEMY_SPAWN_TIME;
        this.score = C.INITIAL_SCORE;
        this.enemiesKilled = 0;
        this.waveNumber = 1;
        this.enemySpeed = C.TROJAN_INITIAL_SPEED;
        new Player(this);
        new NetField(this);
        new House(this);
        this.nextWave();
    }

    nextWave() {
        new EnemySpawner(
            this,
            15 + (this.waveNumber * 2),
            4000,
            this.enemySpawnTime,
            this.enemySpeed,
            () => {
                console.log('onSpawn');
            },
            () => {
                console.log('onAllDestroyed');
                this.nextWave();
                this.cycleColors();
            }
        );
        this.waveNumber++;
        this.enemySpawnTime = Math.max(this.enemySpawnTime - 200, 1);
        this.enemySpeed *= 1.05;
    }

    cycleColors() {
        this.mats.forEach((m) => {
            const c = new Color({
                r: m.emissiveColor.r * 255,
                g: m.emissiveColor.g * 255,
                b: m.emissiveColor.b * 255,
            });
            const c2 = c.rotate(40);
            m.emissiveColor.r = c2.red() / 255;
            m.emissiveColor.g = c2.green() / 255;
            m.emissiveColor.b = c2.blue() / 255;
        });
    }

    update = () => {
        for (let go of this.gameObjects) {
            go.update();
        }

        this.scene.render();
    }

    getOneByType(typeName: string) {
        return this.getAllByType(typeName)[0];
    }

    getAllByType(typeName: string) {
        return this.gameObjectsByType[typeName] || [];
    }

    destroyAllByType(type: string, isCancel = false) {
        this.getAllByType(type).forEach(o => {
            o.destroy(isCancel);
        });
    }

    gameOver() {
        this.sounds.EnemyDestroy2.setPosition(new Vector3(0,0,0));
        this.sounds.EnemyDestroy2.play();
        this.destroyAllByType('Turret');
        this.destroyAllByType('Trojan', true);
        this.destroyAllByType('EnemySpawner');
        setTimeout( () => {
            this.reset();
        }, 5000);
    }
}
