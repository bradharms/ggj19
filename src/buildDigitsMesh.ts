import buildDigitMesh from "buildDigitMesh";
import { Scene, Mesh } from "babylonjs";

export default function buildDigitsMesh(scene: Scene, value: number) {
    value = Math.round(value);
    const strV = `${value}`;
    const meshes = Array.from(strV).map((s, i) => {
        const mesh = buildDigitMesh(scene, +s);
        mesh.position.x = i - (strV.length / 2);
        return mesh;
    });
    return Mesh.MergeMeshes(meshes, true);
}
