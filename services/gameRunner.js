import {playerSocketMap} from "./playerSocketMap.js";
import {playerStore} from "./playerStore.js"

export class GameRunner {
    constructor(gameId, status) {
        this.gameId = gameId;
        this.status = status;
    }

    async start() {
        this.status = 'ingame';
        for(const p of await playerStore.allOfGame(this.gameId)) {
            playerSocketMap[p._id].emit('EVENT_START_GAME', {hoi: "duleu"});
        }
    }
}