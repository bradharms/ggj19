import GameObject from "go/GameObject";
import App from "App";
import { PhysicsImpostor, MeshBuilder, Vector3, Sound } from "babylonjs";
import Turret from "./Turret";
import * as C from 'C';

export default class TurretBullet extends GameObject {
    damageValue = 1;

    constructor(
        app: App,
        public turret: Turret,
        position: Vector3,
        velocity: Vector3,
        sound: Sound
    ) {
        super('TurretBullet', app, position);
        this.impostor.setLinearVelocity(velocity);
        this.setTimeout(this.onTimeout, C.TURRET_BULLET_TIMEOUT);
        sound.setPosition(this.mesh.position);
        sound.play();
        this.app.score--;
        this.turret.hit(1);
    }

    setupMesh() {
        const mesh = MeshBuilder.CreateSphere(
            this.meshName,
            {
                diameter: C.TURRET_BULLET_RADIUS,
                segments: C.TURRET_BULLET_SEGMENTS,
            },
            this.app.scene
        );
        mesh.material = this.app.mats[0];
        return mesh;
    }

    setupImpostor() {
        const impostor = new PhysicsImpostor(
            this.mesh,
            PhysicsImpostor.SphereImpostor,
            {
                mass: C.TURRET_BULLET_MASS
            },
            this.app.scene
        );
        return impostor;
    }

    onTimeout = () => {
        this.destroy();
    }

    update() {
        super.update();
        const enemies = this.app.gameObjectsByType.Trojan || [];
        for (const enemy of enemies) {
            if (!enemy.mesh) {
                continue;
            }
            if (enemy.mesh.intersectsMesh(this.mesh)) {
                enemy.hit(this.damageValue);
                this.turret.hit(1);
                this.destroy();
                return;
            }
        }
    }
}
