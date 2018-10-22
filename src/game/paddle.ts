import { Mesh, MeshFaceMaterial, MeshBasicMaterial, DoubleSide } from 'THREE';
import Game from '.';
import { loadJSON } from './util';

export class Paddle extends Mesh {
    public static async setupPaddles(game: Game){
        let {geometry, materials} = await loadJSON('../assets/models/paddle.js', game.jsonLoader);
        let scale = game.tableSize.scale;

        let paddle = new Paddle(geometry, new MeshFaceMaterial(materials));
        paddle.scale.set(scale, scale, scale);
        paddle.position.set(0, game.tableSize.height, game.tableSize.depth/2);
        game.scene.add(paddle);

        let mat = new MeshFaceMaterial(materials)
        mat.side = DoubleSide;
        let paddleOp = new Paddle(geometry, mat);
        paddleOp.scale.set(scale, scale, scale);
        paddleOp.position.set(0, game.tableSize.height, -game.tableSize.depth/2);
        game.scene.add(paddleOp);
        
        geometry.computeBoundingBox();
        let boundingBox = geometry.boundingBox;
        let modelSize = {
            width: boundingBox.max.x - boundingBox.min.x,
            depth: boundingBox.max.z - boundingBox.min.z,
            height: boundingBox.max.y - boundingBox.min.y
        };
        game.paddleSize = {
            width: modelSize.width * scale,
            depth: modelSize.depth * scale,
            height: modelSize.height * scale,
            scale
        };

        return [paddle, paddleOp];
    }
}