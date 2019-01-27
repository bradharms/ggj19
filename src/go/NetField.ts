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
        super('NetField', app);
        this.mesh.isPickable = true;
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
        mesh.material = this.app.mats[1];
        return mesh;
    }

    setupImpostor() {
        const impostor = new PhysicsImpostor(
            this.mesh,
            PhysicsImpostor.PlaneImpostor,
            {
                mass: 0,
            },
            this.app.scene
        );
        return impostor;
    }

    update() {

    }
}
