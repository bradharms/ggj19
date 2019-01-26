import App from "App";
import { Mesh, MeshBuilder } from "babylonjs";
import * as C from 'C';

interface Opts {
}

export default class NetField {

    toruses: Mesh[] = [];

    constructor(public app: App) {
        this.setupGeometry();
    }

    setupGeometry() {
        let i = 1;
        const torus = MeshBuilder.CreateCylinder(
            `torus${i}`,
            {
                diameterBottom: C.NETFIELD_DIAMETER_BOTTOM,
                diameterTop: C.NETFIELD_DIAMETER_TOP,
                height: C.NETFIELD_HEIGHT,
                subdivisions: C.NETFIELD_SUBDIVISIONS,
                tessellation: C.NETFIELD_TESSELLATION
            },
            this.app.scene
        );
        torus.material = this.app.mats[1];
        this.toruses.push(torus);
    }

    update() {

    }
}
