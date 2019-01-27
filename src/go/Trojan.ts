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

    constructor(app: App, position?: Vector3) {
        super('Trojan', app, position);
        const angle = Vector3.Normalize(position);
        this.mesh.rotation.y =
            Math.atan2(angle.x, angle.z)
        this.sound = new Sound(
            this.meshName + 'Sound',
            './soundFX/CannonFire3.wav',
            this.app.scene,
            null,
            {
                spatialSound: true,
                loop: true,
                // autoplay: true,
                playbackRate: 0.1
            }
        );
        this.sound.attachToMesh(this.mesh);
        // this.sound.play();
    }

    setupImpostor() {
        this.speed = C.TROJAN_MAX_SPEED;
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
                angle.x * -this.speed,
                angle.y * -this.speed,
                angle.z * -this.speed
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

    destroy() {
        this.app.score += C.TROJAN_SCORE;
        this.app.sounds.EnemyDestroy.setPosition(this.mesh.position);
        this.app.sounds.EnemyDestroy.play();
        super.destroy();
        this.sound.dispose();
    }
}
