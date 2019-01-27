import AbstractGameObject from 'go/GameObject';
import App from 'App';
import { MeshBuilder, Vector3, PhysicsImpostor, Sound } from 'babylonjs';
import * as C from 'C';

let count = 0;

export default class Trojan extends AbstractGameObject {
    typeName: 'Trojan';

    speed: number;
    direction: number;
    sound: Sound;
    health = 5;

    constructor(app: App, position?: Vector3) {
        super('Trojan', app, position);
        if (app.gameObjectsByType.Trojan.length >= 10) {
            this.destroy(true);
            return;
        }
        const angle = Vector3.Normalize(position);
        this.mesh.rotation.y =
            Math.atan2(angle.x, angle.z)
        this.sound = new Sound(
            this.meshName + 'Sound',
            './soundFX/CannonFire.wav',
            this.app.scene,
            null,
            {
                spatialSound: true,
                loop: true,
                autoplay: true,
                playbackRate: (this.app.enemySpeed * .06) + ( .025 * (Math.random() - .5))
            }
        );
        this.sound.attachToMesh(this.mesh);
        // this.sound.play();
    }

    setupImpostor() {
        const impostor = new PhysicsImpostor(
            this.mesh,
            PhysicsImpostor.BoxImpostor,
            {
                mass: 0.1
            },
            this.app.scene
        );
        const angle = Vector3.Normalize(this.mesh.position);
        impostor.setLinearVelocity(
            new Vector3(
                angle.x * -this.app.enemySpeed,
                angle.y * -this.app.enemySpeed,
                angle.z * -this.app.enemySpeed
            )
        );
        return impostor;
    }

    setupMesh() {
        const mesh = MeshBuilder.CreateBox(
            `trojan${count}`,
            {
                width: C.TROJAN_W,
                height: C.TROJAN_H,
                depth: C.TROJAN_D,
                updatable: true,
            },
            this.app.scene
        );
        mesh.material = this.app.mats[3];
        return mesh;
    }

    onHit(value: number) {
        this.app.sounds.CannonFire3.setPosition(this.mesh.position);
        this.app.sounds.CannonFire3.setPlaybackRate(1.5 + (Math.random() * 0.05))
        this.app.sounds.CannonFire3.play();
        super.onHit(value);
    }

    destroy(isCancel = false) {
        if (!isCancel) {
            this.app.score += C.TROJAN_SCORE;
            this.app.sounds.EnemyDestroy.setPosition(this.mesh.position);
            this.app.sounds.EnemyDestroy.play();
            this.app.enemySpawnTime -= 20;
            if (this.app.enemySpawnTime <= 0) {
                this.app.enemySpawnTime = 1;
            }
            this.app.enemiesKilled ++;
        }
        if (this.sound) {
            this.sound.dispose();
            this.sound = null;
        }
        super.destroy(isCancel);
    }

    update() {
        super.update();
        if (!this.app) {
            return;
        }
        const turrets = this.app.gameObjectsByType.Turret || [];
        for (const turret of turrets) {
            if (!turret.mesh) {
                continue;
            }
            if (this.mesh.intersectsMesh(turret.mesh)) {
                this.destroy();
                turret.destroy();
                break;
            }
        }
        if (!this.app) {
            return
        }
        const houses = this.app.gameObjectsByType.House || [];
        for (const house of houses) {
            if (!house.mesh) {
                continue;
            }
            if (this.mesh.intersectsMesh(house.mesh)) {
                house.hit(C.TROJAN_PENALTY);
                this.destroy(true);
                break;
            }
        }
        super.update();
    }
}
