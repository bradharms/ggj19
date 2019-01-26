import IGameObject from "go/IGameObject";
import App from "App";
import { Mesh } from 'babylonjs';

export default abstract class AbstractGameObject implements IGameObject {
    constructor(public app: App) {
        app.gameObjects.push(this);
        this.mesh = this.setupMesh();
        this.mesh.isPickable = false;
    }

    mesh: Mesh;

    abstract setupMesh(): Mesh;

    update() { };

    destroy() {
        throw new Error('TODO: Not implemented');
    }
}

