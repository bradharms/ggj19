import {
    PerspectiveCamera,
    Scene,
    BoxBufferGeometry,
    MeshPhongMaterial
} from 'three';

class Main {
    camera = new PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        1000
    )

    scene = new Scene()

    geometry = new BoxBufferGeometry(200, 200, 200)

    constructor() {
        this.camera.position.z = 400;
    }
}

new Main();
