import createError from 'http-errors';
import {Player} from "../services/player.js";
import {Game} from "../services/game.js";
import {gameStore} from "../services/gameStore.js"
import {playerStore} from "../services/playerStore.js"
import path from "path";

class GameController {
    createGame(req, res) {
        playerStore.add(req.session.user.nickname, function(host) {
            req.session.user.playerId = host._id;
            gameStore.add(host._id, req.body.gameText, req.body.gameTitle, function(game) {
                res.redirect(`/game/${game._id}`);
            });
        });
    }

    renderGame(req, res, next) {
        // if(! await gameStore.exists(req.params.gameId)) {
        //     next(createError(404, "Game ID doesn't exist!"));
        // } else if(! await gameStore.gameContainsPlayer(req.params.gameId, req.session.user.playerId)) {
        //     res.redirect("/join");
        // } else {
            res.sendFile("html/game.html", {root: path.resolve('public')});
        // }
    }

    addPlayer(req, res) {
        playerStore.add(req.session.user.nickname, function(player) {
            req.session.user.playerId = player._id;
            gameStore.addPlayerToGame(req.params.gameId, player._id, function() {
                res.redirect(`/game/${req.params.gameId}`);
            });
        });
    }

    getPlayers(req, res, next) {
        gameStore.get(req.params.gameId, function(game) {
            if(game) {
                res.json({game: game, isHost: game.hostId === req.session.user.playerId});
            } else {
                next(createError(404, "Game not found"));
            }
        });
    }
}

export const gameController = new GameController();