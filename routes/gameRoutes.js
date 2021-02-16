import express from "express";
import {gameController} from "../controller/gameController.js";
const router = express.Router();

router.post("/", gameController.createGame);
router.get("/:gameId", gameController.renderGame);
router.post("/:gameId", gameController.reloadGame);
router.get("/:gameId/data", gameController.getGame);
router.get("/:gameId/players", gameController.getPlayers);
router.post("/:gameId/player", gameController.addPlayer);

export const gameRoutes = router;