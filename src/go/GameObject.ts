import App from "App";
import { Mesh } from 'babylonjs';

export default abstract class GameObject {
    constructor(public app: App) {
        app.gameObjects.push(this);
        this.mesh = this.setupMesh();
        this.mesh.isPickable = false;
    }

    mesh: Mesh;

    abstract setupMesh(): Mesh;

    update() { };

    destroy() {
        this.app.gameObjects =
            this.app.gameObjects.filter(o => o !== this);
        this.app.scene.removeMesh(this.mesh);
    }
}

