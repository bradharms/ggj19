import App from "App";
import { Mesh, PhysicsImpostor, Vector3 } from 'babylonjs';

let count = 0;

export default abstract class GameObject {

    idn: number;
    mesh: Mesh;
    impostor: PhysicsImpostor;
    timeouts: any[] = [];
    intervals: any[] = [];

    abstract typeName: string;

    constructor(public app: App, position?: Vector3) {
        this.idn = count++;
        app.gameObjects.push(this);
        this.mesh = this.setupMesh();
        if (this.mesh) {
            this.mesh.isPickable = false;
            if (position) {
                this.mesh.position = position;
            }
        }
        this.impostor = this.setupImpostor();
    }

    setupMesh(): Mesh {
        return null;
    }

    setupImpostor(): PhysicsImpostor {
        return null;
    }

    update() { };

    get meshName() {
        return `${this.typeName}${this.idn}`;
    }

    setTimeout = (fn: Function, ms: number) => {
        const tm = setTimeout(() => {
            fn.call(this);
            this.timeouts = this.timeouts.filter(t => t === tm);
        }, ms);
        this.timeouts.push(tm);
        return tm;
    }

    setInterval = (fn: Function, ms: number) => {
        const iv = setInterval(() => { fn.call(this); }, ms);
        this.intervals.push(iv);
        return iv;
    }

    destroy() {
        this.app.gameObjects =
            this.app.gameObjects.filter(o => o !== this);
        if (this.mesh) {
            this.app.scene.removeMesh(this.mesh);
            this.mesh.dispose();
            this.mesh = null;
        }
        if (this.impostor) {
            this.app.physics.removePhysicsBody(this.impostor);
            this.impostor.dispose();
            this.impostor = null;
        }
        for (const tm of this.timeouts) {
            clearTimeout(tm);
        }
        this.timeouts = [];
        for (const iv of this.intervals) {
            clearInterval(iv);
        }
        this.intervals = [];
        this.app = null;
    }
}

