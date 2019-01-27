import AbstractGameObject from 'go/GameObject';
import App from 'App';
import { MeshBuilder, Vector3, PhysicsImpostor } from 'babylonjs';
import * as C from 'C';

let count = 0;

export default class Trojan extends AbstractGameObject {
    typeName: 'Trojan';

    speed: number;
    direction: number;

    constructor(app: App, position?: Vector3) {
        super('Trojan', app, position);
        const angle = Vector3.Normalize(position);
        this.mesh.rotation.y =
            Math.atan2(angle.x, angle.z)
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
}
