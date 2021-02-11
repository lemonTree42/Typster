import createError from 'http-errors';
import {Player} from "../services/player.js";
import {Game} from "../services/game.js";
import {gameStore} from "../services/gameStore.js"
import {playerStore} from "../services/playerStore.js"
import path from "path";

class GameController {
    async createGame(req, res) {
        const host = await playerStore.add(req.session.user.nickname);
        req.session.user.playerId = host._id;
        const game = await gameStore.add(host._id, req.body.gameText, req.body.gameTitle);
        res.redirect(`/game/${game._id}`);
    }

    async renderGame(req, res, next) {
        if(! await gameStore.exists(req.params.gameId)) {
            next(createError(404, "Game ID doesn't exist!"));
        } else if(! await gameStore.gameContainsPlayer(req.params.gameId, req.session.user.playerId)) {
            res.redirect("/join");
        } else {
            res.sendFile("html/game.html", {root: path.resolve('public')});
        }
    }

    async addPlayer(req, res) {
        const player = await playerStore.add(req.session.user.nickname);
        req.session.user.playerId = player._id;
        await gameStore.addPlayerToGame(req.params.gameId, player._id);
        res.redirect(`/game/${req.params.gameId}`);
    }

    async getPlayers(req, res, next) {
        const game = await gameStore.get(req.params.gameId);
        if(game) {
            res.json({game: game, isHost: game.host.nickname === req.session.user.nickname});
        } else {
            next(createError(404, "Game not found"));
        }
    }
}

export const gameController = new GameController();