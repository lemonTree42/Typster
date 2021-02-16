import {httpService} from "./httpService.js";

export class GameService {
    constructor(gameId, socket) {
        this.gameId = gameId;
        this.socket = socket;
    }

    async getGame() {
        return await httpService.ajax("GET", `/game/${this.gameId}/data`, undefined);
    }

    async getPlayers() {
        return await httpService.ajax("GET", `/game/${this.gameId}/players`, undefined);
    }

    startGame() {
        this.socket.emit("EVENT_CLIENT_INVOKE_START_GAME", this.gameId);
    }

    sendCorrectInput(progress) {
        this.socket.emit("EVENT_CLIENT_CORRECT_INPUT", {gameId: this.gameId, progress});
    }
}