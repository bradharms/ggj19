import App from "App";
import * as C from "C";
import { Mesh, PhysicsImpostor, Vector3 } from 'babylonjs';

let count = 0;

export default abstract class GameObject {

    idn: number;
    mesh: Mesh;
    impostor: PhysicsImpostor;
    timeouts: any[] = [];
    intervals: any[] = [];
    health = 1;
    vulnerable = true;

    constructor(public typeName: string, public app: App, position?: Vector3) {
        this.idn = count++;
        app.gameObjects.push(this);
        if (!app.gameObjectsByType[typeName]) {
            app.gameObjectsByType[typeName] = [];
        }
        app.gameObjectsByType[typeName].push(this);
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

    update() {
        if (!this.mesh) {
            return;
        }
        const {x,y,z} = this.mesh.position;
        const K = C.KILL_RADIUS;
        if (
            x > K ||
            x < -K ||
            y > K ||
            y < -K ||
            z > K ||
            z < -K ||
            this.health <= 0
        ) {
            this.destroy();
        }
    };

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

    hit(value: number) {
        if (!this.vulnerable) {
            return false;
        }
        this.onHit(value);
        this.vulnerable = false;
        this.setTimeout(this.onHitReset, 100);
        return true;
    }

    onHit(value: number) {
        this.health -= value;
        if (this.health <= 0) {
            this.destroy();
        }
    }

    onHitReset = () => {
        this.vulnerable = true;
    }

    destroy(isCanel = false) {
        if (this.app) {
            this.app.gameObjects =
                this.app.gameObjects.filter(o => o !== this);
            this.app.gameObjectsByType[this.typeName] =
                this.app.gameObjectsByType[this.typeName]
                    .filter(o => o !== this);
        }
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

