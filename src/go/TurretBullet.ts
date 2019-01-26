import GameObject from "go/GameObject";
import App from "App";
import { PhysicsImpostor, MeshBuilder, Vector3 } from "babylonjs";
import Turret from "./Turret";
import * as C from 'C';

let count = 0;

export default class TurretBullet extends GameObject {

    turretBulletId: number;
    impostor: PhysicsImpostor;

    constructor(
        app: App,
        public turret: Turret,
        velocity: Vector3
    ) {
        super(app);
        this.mesh.material = turret.mesh.material; // TODO: Not currently possible to put this in createMesh()
        count++;
        this.turretBulletId = count;
        this.impostor = new PhysicsImpostor(
            this.mesh,
            PhysicsImpostor.SphereImpostor,
            {
                mass: 0.0001
            },
            this.app.scene
        );
        this.impostor.setLinearVelocity(velocity);
    }

    setupMesh() {
        const mesh = MeshBuilder.CreateSphere(
            `turretBullet${this.turretBulletId}`,
            {
                diameter: C.TURRET_BULLET_MAX_SPEED
            },
            this.app.scene
        );
        return mesh;
    }
}
