import express from "express";
import {gameRunnerStore} from "../services/gameRunnerStore.js"
const router = express.Router();

router.get("/", function(req, res) {
    const result = [];
    for(const e of gameRunnerStore.all('lobby')) {
        result.push({id: e.id, title: e.game.title, playerCount: e.playerStore.size()});
    }
    res.json(result);
});

export const gamesRoutes = router;