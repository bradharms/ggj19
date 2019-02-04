import GameObject from 'go/GameObject';
import App from 'App';
import { Vector3 } from 'babylonjs';
import * as C from 'C'
import Trojan from 'go/Trojan';

export default class EnemySpawner extends GameObject {

    interval: any;

    enemiesKilled = 0;
    initialEnemyCount = 0;

    constructor(
        app: App,
        public leftToSpawn: number,
        public initialDelay: number,
        public spawnRate: number,
        public enemySpeed: number
    ) {
        super('EnemySpawner', app);
        this.initialEnemyCount = leftToSpawn;
        this.setTimeout(this.initialSpawn, initialDelay);
        this.app.sounds.ProbePing.play();
    }

    initialSpawn = () => {
        this.spawn();
        this.setInterval(this.spawn, this.spawnRate);
    }

    enemies: Trojan[] = [];

    spawn = () => {
        if (!this.app) return;
        if (this.leftToSpawn <= 0) {
            return;
        }
        this.leftToSpawn--;
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * C.NETFIELD_DIAMETER_BOTTOM / 2;
        const z = Math.sin(angle) * C.NETFIELD_DIAMETER_BOTTOM / 2;
        const v3 = new Vector3(x, C.TROJAN_H / 2, z);
        this.enemies.push(new SpawnerTrojan(this, v3));
    }
    
    onKill() {
        this.enemies.forEach(e => e.kill());
        super.onKill();
    }
    
    onEnemyKilled(enemy: SpawnerTrojan) {
        this.enemiesKilled ++;
        this.enemies = this.enemies.filter(t2 => t2 !== enemy);
        if (this.leftToSpawn <= 0 && this.enemiesKilled >= this.initialEnemyCount) {
            this.kill();
        }
    }
}

class SpawnerTrojan extends Trojan {
    constructor(public spawner: EnemySpawner, position: Vector3) {
        super(spawner.app, position);
    }
    onKill() {
        super.onKill();
        this.spawner.onEnemyKilled(this);
    }
}
