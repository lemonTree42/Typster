import createError from 'http-errors';
import {Player} from "../services/player.js";
import {Game} from "../services/game.js";
import {gameStore} from "../services/gameStore.js"
import path from "path";

class GameController {
    createGame(req, res) {
        const host = new Player(req.session.user.nickname);
        const game = new Game(host, req.body.gameText, req.body.gameTitle);
        const id = gameStore.add(game);
        game.setID(id);
        res.redirect(`/game/${id}`);
    }

    renderGame(req, res, next) {
        if(gameStore.exists(req.params.gameId)) {
            res.sendFile("html/game.html", {root: path.resolve('public')});
        } else {
            next(createError(404))
        }
    }

    addPlayer(req, res) {
        const player = new Player(req.session.user.nickname);
        gameStore.get(req.params.gameId).add(player);
        res.redirect(`/game/${req.params.gameId}`);
    }

    getPlayers(req, res, next) {
        const game = gameStore.get(req.params.gameId);
        if(game) {
            res.json({game: game, isHost: game.host.nickname === req.session.user.nickname});
        } else {
            console.log('noooo');
            next(createError(404))
        }
    }
}

export const gameController = new GameController();