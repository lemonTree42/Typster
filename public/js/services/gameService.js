import {httpService} from "./httpService.js";

class GameService {
    async getPlayers(gameId) {
        const result = await httpService.ajax("GET", `/game/${gameId}/players`, undefined);
        console.log(result);
        return result;
    }
}

export const gameService = new GameService();