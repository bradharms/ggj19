import App from 'App';
import { MeshBuilder, Mesh, Vector3, StandardMaterial, Color3 } from 'babylonjs';

export default class House {

    mesh: Mesh;
    mat: StandardMaterial;

    constructor(
        public app: App,
        size: [number, number, number]
    ) {
        this.setupGeometry(...size);
    }

    setupGeometry(width: number, height: number, depth: number) {
        this.mesh = MeshBuilder.CreateBox(
            'house', {
                width,
                height,
                depth,
            },
            this.app.scene
        );
        this.mesh.material = this.app.mats[0];
        this.mesh.position.y = height / 2;
    }

    update() {

    }
}

