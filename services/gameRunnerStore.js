import {Game} from "./game.js";
import {GameRunner} from "./gameRunner.js";

class GameRunnerStore {
    constructor() {
        this.store = [];
    }

    add(gameText, gameTitle, hostId) {
        const result = new GameRunner(this.store.length, new Game(gameText, gameTitle, hostId));
        this.store.push(result);
        return result;
    }

    get(id) {
        return this.store[id];
    }

    all(state) {
        if(state) {
            return this.store.filter(e => e.status===state);
        } else {
            return this.store;
        }
    }

    exists(id) {
        return !!(this.store[id]);
    }

    reload(id, hostId) {
        const old = this.store[id];
        const result = new GameRunner(id, new Game(old.game.text, old.game.title, hostId));
        this.store[id] = result;
        return result;
    }
}

export const gameRunnerStore = new GameRunnerStore();