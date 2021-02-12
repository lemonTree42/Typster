import express from "express";
import {gameController} from "../controller/gameController.js";
const router = express.Router();

router.post("/", gameController.createGame);
router.get("/:gameId", gameController.renderGame);
router.get("/:gameId/lobby", gameController.getLobby);
router.post("/:gameId/player", gameController.addPlayer);

export const gameRoutes = router;