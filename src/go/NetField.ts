import App from "App";
import { Mesh, MeshBuilder, PhysicsImpostor } from "babylonjs";
import * as C from 'C';
import AbstractGameObject from "go/GameObject";

interface Opts {
}

export default class NetField extends AbstractGameObject {

    mesh: Mesh;
    impostor: PhysicsImpostor;

    constructor(public app: App) {
        super(app);
        this.mesh.isPickable = true;
        this.impostor = new PhysicsImpostor(
            this.mesh,
            PhysicsImpostor.CylinderImpostor,
            {
                mass: 0,

            },
            this.app.scene
        );
    }

    setupMesh() {
        const mesh = MeshBuilder.CreateCylinder(
            `netfield`,
            {
                diameterBottom: C.NETFIELD_DIAMETER_BOTTOM,
                diameterTop: C.NETFIELD_DIAMETER_TOP,
                height: C.NETFIELD_HEIGHT,
                subdivisions: C.NETFIELD_SUBDIVISIONS,
                tessellation: C.NETFIELD_TESSELLATION
            },
            this.app.scene
        );
        mesh.rotation.x = Math.PI;
        mesh.position.y = -.5; // TODO: Don't know why this is here; without it, the cylinders fly away
        mesh.material = this.app.mats[1];
        return mesh;
    }

    update() {

    }
}
