import express from "express";
import {gameStore} from "../services/gameStore.js"
const router = express.Router();

router.get("/", function(req, res) {
    res.json(gameStore.all());
});

export const gamesRoutes = router;