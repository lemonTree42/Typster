import createError from 'http-errors';
import {Player} from "../services/player.js";
import {Game} from "../services/game.js";
import {gameStore} from "../services/gameStore.js"
import {playerStore} from "../services/playerStore.js"
import {GameRunner} from "../services/gameRunner.js"
import {gameRunnerMap} from "../services/gameRunnerMap.js";
import path from "path";

class GameController {
    async createGame(req, res) {
        const game = await gameStore.add(req.body.gameText, req.body.gameTitle);
        const host = await playerStore.add(req.session.user.nickname, game._id, true);
        req.session.user.playerId = host._id;
        gameRunnerMap[game._id] = new GameRunner(game._id, "lobby");
        res.redirect(`/game/${game._id}`);
    }

    async renderGame(req, res, next) {
        if(! await gameStore.exists(req.params.gameId)) {
            next(createError(404, "Game ID doesn't exist!"));
        } else if(! await playerStore.playerIsInGame(req.session.user.playerId, req.params.gameId)) {
            res.redirect("/join");
        } else {
            res.sendFile("html/game.html", {root: path.resolve('public')});
        }
    }

    async addPlayer(req, res) {
        const player = await playerStore.add(req.session.user.nickname, req.params.gameId, false);
        req.session.user.playerId = player._id;
        res.redirect(`/game/${req.params.gameId}`);
    }

    async getLobby(req, res, next) {
        if(gameStore.exists(req.params.gameId)) {
            const players = await playerStore.allOfGame(req.params.gameId);
            const host = (await playerStore.getHostOfGame(req.params.gameId))._id;
            res.json({players, isHost: host===req.session.user.playerId});
        } else {
            next(createError(404, "Game not found"));
        }
    }
}

export const gameController = new GameController();