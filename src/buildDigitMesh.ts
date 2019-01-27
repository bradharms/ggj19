import { Mesh, MeshBuilder, Vector3, Scene } from "babylonjs";

const D = [
    '000'+
    '000'+
    '111',

    '000'+
    '010'+
    '000',

    '100'+
    '000'+
    '001',

    '100'+
    '010'+
    '001',

    '101'+
    '000'+
    '101',

    '101'+
    '010'+
    '101',

    '111'+
    '000'+
    '111',

    '111'+
    '010'+
    '111',

    '111'+
    '101'+
    '111',

    '111'+
    '111'+
    '111'
];

const size = .3;
const R = size;


export default function buildDigitMesh(scene: Scene, d: number) {
    Math.floor(d);
    const meshes: Mesh[] = [];
    const MB = (cell: number, x: number, y: number) => {
        if (!(+(D[d][cell]))) return;
        const mesh = MeshBuilder.CreateBox(
            'd' + d + 'c' + cell,
            { size: R },
            scene
        );
        mesh.position = new Vector3(x, y, 0);
        meshes.push(mesh);
    }
    MB(0, -R,  R); MB(1, 0,  R); MB(2, R,  R);
    MB(3, -R,  0); MB(4, 0,  0); MB(5, R,  0);
    MB(6, -R, -R); MB(7, 0, -R); MB(8, R, -R);
    return Mesh.MergeMeshes(meshes, true);
}

