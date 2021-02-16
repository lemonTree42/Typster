import createError from 'http-errors';
import {gameRunnerStore} from "../services/gameRunnerStore.js"
import path from "path";

class GameController {
    createGame(req, res) {
        const gameRunner = gameRunnerStore.add(req.body.gameText, req.body.gameTitle, req.sessionID, req.body.maxTime);
        gameRunner.addPlayer(req.sessionID, req.session.user.nickname);
        res.redirect(`/game/${gameRunner.id}`);
    }

    reloadGame(req, res) {
        let gameRunner = gameRunnerStore.get(req.params.gameId);
        if(gameRunner.status!=='lobby') {
            gameRunner = gameRunnerStore.reload(req.params.gameId, req.sessionID);
        }
        gameRunner.addPlayer(req.sessionID, req.session.user.nickname);
        res.redirect(`/game/${gameRunner.id}`);
    }

    renderGame(req, res, next) {
        if(!gameRunnerStore.exists(req.params.gameId)) {
            next(createError(404, "Game ID doesn't exist!"));
        } else if(!gameRunnerStore.get(req.params.gameId).playerStore.contains(req.sessionID)) {
            res.redirect("/join");
        } else {
            res.sendFile("html/game.html", {root: path.resolve('public')});
        }
    }

    addPlayer(req, res) {
        gameRunnerStore.get(req.params.gameId).addPlayer(req.sessionID, req.session.user.nickname);
        res.redirect(`/game/${req.params.gameId}`);
    }

    getGame(req, res, next) {
        const gameRunner = gameRunnerStore.get(req.params.gameId);
        if(gameRunner) {
            res.json({isHost: gameRunner.game.hostId===req.sessionID, ...gameRunner.game});
        } else {
            next(createError(404, "Game not found"));
        }
    }

    getPlayers(req, res, next) {
        const gameRunner = gameRunnerStore.get(req.params.gameId);
        if(gameRunner) {
            const players = gameRunner.playerStore.entries();
            res.json({players});
        } else {
            next(createError(404, "Game not found"));
        }
    }
}

export const gameController = new GameController();