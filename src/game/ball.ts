import { Mesh, SphereGeometry, MeshLambertMaterial } from "THREE";
import Game from ".";

export class Ball extends Mesh {
    static async setup(game: Game){
        var ballRadius = game.paddleSize.width * 0.13;
        var ballGeometry = new SphereGeometry(ballRadius,16,16);
        var ballMaterial = new MeshLambertMaterial({ color: 0xffffff });
        let ball = new Ball(ballGeometry, ballMaterial);
        ball.position.set(0, game.tableSize.height * 2, game.tableSize.depth * 0.25);
        game.scene.add(ball);
        return ball;
    }
}