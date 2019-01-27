import GameObject from 'go/GameObject';
import App from 'App';
import { Vector3 } from 'babylonjs';
import * as C from 'C'
import Trojan from 'go/Trojan';

export default class EnemySpawner extends GameObject {

    interval: any;

    constructor(
        app: App,
        public leftToSpawn: number,
        public initialDelay: number,
        public spawnRate: number,
        public enemySpeed: number,
        public onSpawn: () => void = null,
        public onAllDestroyed: () => void = null,
    ) {
        super('EnemySpawner', app);
        this.setTimeout(this.initialSpawn, initialDelay);
        this.app.sounds.ProbePing.play();
    }

    initialSpawn = () => {
        this.spawn();
        this.setInterval(this.spawn, this.spawnRate);
    }

    enemies: Trojan[] = [];

    spawn = () => {
        if (this.leftToSpawn <= 0) {
            return;
        }
        this.leftToSpawn--;
        console.log('Left to spawn', this.leftToSpawn);
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * C.NETFIELD_DIAMETER_BOTTOM / 2;
        const z = Math.sin(angle) * C.NETFIELD_DIAMETER_BOTTOM / 2;
        const v3 = new Vector3(x, C.TROJAN_H / 2, z);
        const t = new Trojan(this.app, v3);
        this.enemies.push(t);
        const oldDestory = t.destroy.bind(t);
        t.destroy = (isCancel = false) => {
            console.log('destroyed');
            oldDestory(isCancel);
            this.enemies = this.enemies.filter(t2 => t2 !== t);
            if (this.leftToSpawn <= 0 && this.enemies.length <= 0) {
                this.onAllDestroyed && this.onAllDestroyed();
            }
        }
        this.onSpawn && this.onSpawn();
    }

    destroy(isCancel = false) {
        this.enemies.forEach(e => e.destroy(isCancel));
        super.destroy(isCancel);
    }
}
