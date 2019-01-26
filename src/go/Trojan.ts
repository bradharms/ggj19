import AbstractGameObject from 'go/GameObject';
import App from 'App';
import { MeshBuilder, Vector3, PhysicsImpostor } from 'babylonjs';
import * as C from 'C';

let count = 0;

export default class Trojan extends AbstractGameObject {

    trojanId: number;
    speed: number;
    direction: number;
    impostor: PhysicsImpostor;

    constructor(app: App, pos: Vector3) {
        super(app);
        const angle = Vector3.Normalize(pos);
        this.mesh.position = pos;
        this.mesh.rotation.y =
            Math.atan2(angle.x, angle.z)
        count++;
        this.trojanId = count;
        this.app.trojans.push(this);
        this.speed = C.TROJAN_MAX_SPEED;
        this.impostor = new PhysicsImpostor(
            this.mesh,
            PhysicsImpostor.BoxImpostor,
            {
                mass: 0.1
            },
            this.app.scene
        );
        this.impostor.setLinearVelocity(
            new Vector3(
                angle.x * -this.speed,
                angle.y * -this.speed,
                angle.z * -this.speed
            )
        );
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
