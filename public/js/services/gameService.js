import {httpService} from "./httpService.js";

export class GameService {
    constructor(gameId, socket) {
        this.gameId = gameId;
        this.socket = socket;
    }

    async getPlayers() {
        const result = await httpService.ajax("GET", `/game/${this.gameId}/players`, undefined);
        console.log(result);
        return result;
    }

    startGame() {
        this.socket.emit("EVENT_CLIENT_INVOKE_START_GAME", this.gameId);
    }

    // socket.on('EVENT_START_GAME', function(msg) {
    //     console.log("MESSAGE: ");
    //     console.log(msg);
    // });
}