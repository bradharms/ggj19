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
        position: Vector3,
        velocity: Vector3
    ) {
        super(app);
        this.mesh.material = turret.mesh.material; // TODO: Not currently possible to put this in createMesh()
        this.mesh.position = position;
        count++;
        this.turretBulletId = count;
        this.impostor = new PhysicsImpostor(
            this.mesh,
            PhysicsImpostor.SphereImpostor,
            {
                mass: C.TURRET_BULLET_MASS
            },
            this.app.scene
        );
        this.impostor.setLinearVelocity(velocity);
        setTimeout(this.onTimeout, C.TURRET_BULLET_TIMEOUT);
    }

    onTimeout = () => {
        this.destroy();
        this.app.physics.removePhysicsBody(this.impostor);
    }

    destroy() {
        super.destroy();
        this.app.turretBullets =
            this.app.turretBullets.filter(b => b !== this);
    }

    setupMesh() {
        const mesh = MeshBuilder.CreateSphere(
            `turretBullet${this.turretBulletId}`,
            {
                diameter: C.TURRET_BULLET_RADIUS
            },
            this.app.scene
        );
        return mesh;
    }
}
