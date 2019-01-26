import { Mesh } from "babylonjs";
import App from 'App';

export default interface IGameObject {
    update(): void;
    destroy(): void;
    mesh: Mesh;
    app: App;
}
