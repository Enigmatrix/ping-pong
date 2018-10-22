import { Mesh, RepeatWrapping, MeshPhongMaterial, MeshFaceMaterial, Vector3 } from "THREE";
import { loadJSON, loadTexture } from "./util";
import Game from ".";

export default class Table extends Mesh {
    public static async setup(game: Game) {
        const {geometry, materials} = await loadJSON("../assets/models/table.js", game.jsonLoader);
        const texture = await loadTexture("../assets/images/table.jpg", game.textureLoader);

        texture.repeat.x = 0.1;
        texture.repeat.y = 0.03;
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        materials[1] = new MeshPhongMaterial({ specular: 0x777777, map: texture });
        const table = new Table(geometry, new MeshFaceMaterial(materials));
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        const modelSize = {
            width: boundingBox.max.x - boundingBox.min.x,
            depth: boundingBox.max.z - boundingBox.min.z,
            height: boundingBox.max.y - boundingBox.min.y,
        };
        const scale = game.settings.tableWidth / modelSize.width;
        table.scale.set(scale, scale, scale);
        game.tableSize = {
            width: modelSize.width * scale,
            depth: modelSize.depth * scale,
            height: modelSize.height * scale,
            scale,
        };
        table.matrixAutoUpdate = false;
        table.updateMatrix();
        game.scene.add(table);
        return table;
    }
}
