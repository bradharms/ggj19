import App from 'App';
import { MeshBuilder, Mesh, Vector3, StandardMaterial, Color3, PhysicsImpostor } from 'babylonjs';
import AbstractGameObject from 'go/GameObject';
import * as C from 'C';

export default class House extends AbstractGameObject {
    typeName: 'House';

    constructor(public app: App) {
        super(app);
        this.impostor = new PhysicsImpostor(
            this.mesh,
            PhysicsImpostor.BoxImpostor,
            {
                mass: 0
            },
            this.app.scene
        );

    }

    setupMesh() {
        const mesh = MeshBuilder.CreateBox(
            this.meshName,
            {
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

