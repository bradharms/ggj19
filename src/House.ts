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
        this.mat = new StandardMaterial(
            'houseMat',
            this.app.scene
        );
        this.mat.emissiveColor = new Color3(0, 1, 0);
        this.mesh = MeshBuilder.CreateBox(
            'house', {
                width,
                height,
                depth,
            },
            this.app.scene
        );
        this.mesh.position.y = height / 2;
        this.mesh.material = this.mat;
        this.mesh.material.wireframe = true;
    }

    update() {

    }
}

