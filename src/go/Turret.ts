import AbstractGameObject from 'go/GameObject';
import { Mesh, MeshBuilder, PhysicsImpostor } from 'babylonjs';
import App from 'App';
import * as C from 'C';

let count = 0;

export default class Turret extends AbstractGameObject {

    mesh: Mesh;
    turretId: number;
    impostor: PhysicsImpostor;

    constructor(app: App, x: number, z: number){
        super(app);
        this.turretId = count++;
        this.app.turrets.push(this);
        this.mesh.position.x = x;
        this.mesh.position.z = z;
        this.impostor = new PhysicsImpostor(
            this.mesh,
            PhysicsImpostor.CylinderImpostor,
            {
                mass: 0.1
            },
            this.app.scene
        );
    }

    destroy() {
        this.app.turrets = this.app.turrets.filter(t => t !== this);
    }

    setupMesh() {
        const mesh = MeshBuilder.CreateCylinder(
            `turret${this.turretId}`,
            {
                diameterBottom: C.TURRET_DIAMETER_BOTTOM,
                diameterTop: C.TURRET_DIAMETER_TOP,
                subdivisions: C.TURRET_SUBDIVISIONS,
                tessellation: C.TURRET_TESSELATION
            },
            this.app.scene
        );
        mesh.position.y = C.TURRET_HEIGHT / 2;
        mesh.material = this.app.scene.materials[2];
        return mesh;
    }
}
