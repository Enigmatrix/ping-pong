import { Mesh, RepeatWrapping, MeshPhongMaterial, MeshFaceMaterial, Vector3 } from "THREE";
import { loadJSON, loadTexture, getSize } from "./util";
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
        game.tableSize = getSize(table, t => game.settings.tableWidth / t);
        table.matrixAutoUpdate = false;
        table.updateMatrix();
        game.scene.add(table);
        return table;
    }
}
