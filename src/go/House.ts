import App from 'App';
import { MeshBuilder, Mesh, Vector3, StandardMaterial, Color3, PhysicsImpostor } from 'babylonjs';
import AbstractGameObject from 'go/GameObject';
import * as C from 'C';

export default class House extends AbstractGameObject {
    constructor(public app: App) {
        super('House', app);
        this.health = C.INITIAL_SCORE;
    }

    get health() {
        return this.app ? this.app.score : 0;
    }

    set health(h: number) {
        if (!this.app) {
            return;
        }
        this.app.score = h;
    }

    setupMesh() {
        const mesh = MeshBuilder.CreateCylinder(
            this.meshName,
            {
                diameter: C.HOUSE_W,
                height: C.HOUSE_H,
            },
            this.app.scene
        );
        mesh.material = this.app.mats[0];
        mesh.position.y = C.HOUSE_H / 2;
        return mesh;
    }

    setupImpostor() {
        return new PhysicsImpostor(
            this.mesh,
            PhysicsImpostor.CylinderImpostor,
            {
                mass: 0
            },
            this.app.scene
        );
    }

    onHit(value: number) {
        if (this.app) {
            this.app.sounds.EnemyDestroy2.setPosition(this.mesh.position);
            this.app.sounds.EnemyDestroy2.play();
        }
        super.onHit(value);
    }

    destroy(isCancel = false) {
        if (!isCancel) {
            this.app && this.app.gameOver();
        }
        super.destroy(isCancel);
    }
}

