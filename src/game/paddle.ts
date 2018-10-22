import { Mesh, MeshFaceMaterial, MeshBasicMaterial, DoubleSide } from 'THREE';
import Game from '.';
import { loadJSON, getSize } from './util';

export class Paddle extends Mesh {
    public static async setupPaddles(game: Game){
        let {geometry, materials} = await loadJSON('../assets/models/paddle.js', game.jsonLoader);
        let scale = game.tableSize.scale;

        let paddle = new Paddle(geometry, new MeshFaceMaterial(materials));
        getSize(paddle, t => scale);
        paddle.position.set(0, game.tableSize.height, game.tableSize.depth/2);
        game.scene.add(paddle);

        let mat = new MeshFaceMaterial(materials)
        mat.side = DoubleSide;
        let paddleOp = new Paddle(geometry, mat);
        game.paddleSize = getSize(paddleOp, t => scale);
        paddleOp.position.set(0, game.tableSize.height, -game.tableSize.depth/2);
        game.scene.add(paddleOp);
        
        return [paddle, paddleOp];
    }
}