import App from 'App';
import {
    BoxBufferGeometry,
    WireframeGeometry,
    LineSegments,
    Material
} from 'three';

export default class House {

    geometry: BoxBufferGeometry
    geometryW: WireframeGeometry
    line: LineSegments;
    lineM: Material;

    constructor(
        public app: App,
        size: [number, number, number]
    ) {
        this.setupGeometry(...size);
    }

    setupGeometry(w: number, h: number, d: number) {
        this.geometry = new BoxBufferGeometry(w, h, d);
        this.geometryW = new WireframeGeometry(this.geometry);
        this.line = new LineSegments(this.geometryW);
        this.line.position.y = d / 2;
        this.lineM = this.line.material as Material;
        this.lineM.depthTest = false;
        this.lineM.opacity = 1;
        this.lineM.transparent = true;
        this.app.scene.add(this.line);
    }

    update() {

    }
}

