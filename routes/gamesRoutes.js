import express from "express";
import {gameStore} from "../services/gameStore.js"
import {playerStore} from "../services/playerStore.js"
const router = express.Router();

router.get("/", async function(req, res) {
    const result = (await gameStore.all());
    for(const e of result) {
        e.playerCount = await playerStore.countPlayers(e._id);
    }
    await res.json(result);
});

export const gamesRoutes = router;