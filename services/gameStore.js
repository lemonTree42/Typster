class GameStore {
    constructor() {
        this.games = [];
    }

    add(game) {
        this.games.push(game);
        return this.games.length-1;
    }

    get(id) {
        return this.games[id];
    }

    all() {
        return this.games;
    }

    exists(id) {
        return this.games.length > id && id >= 0;
    }
}

export const gameStore = new GameStore();