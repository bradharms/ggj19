import App from 'App';
import { MeshBuilder, Mesh, Vector3, StandardMaterial, Color3 } from 'babylonjs';
import AbstractGameObject from 'go/AbstractGameObject';
import * as C from 'C';

export default class House extends AbstractGameObject {

    mesh: Mesh;
    mat: StandardMaterial;

    constructor(public app: App) {
        super(app);
    }

    setupMesh() {
        const mesh = MeshBuilder.CreateBox(
            'house', {
                width: C.HOUSE_W,
                height: C.HOUSE_H,
                depth: C.HOUSE_D,
            },
            this.app.scene
        );
        mesh.material = this.app.mats[0];
        mesh.position.y = C.HOUSE_H / 2;
        return mesh;
    }

    update() {

    }
}

