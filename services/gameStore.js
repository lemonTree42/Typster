import {Game} from "./game.js";
import Datastore from 'nedb-promises';

class GameStore {
    constructor() {
        this.db = new Datastore({filename: './data/games.db', autoload: true});
    }

    async add(hostId, gameText, gameTitle) {
        return await this.db.insert(new Game(hostId, gameText, gameTitle));
    }

    async get(id) {
        return await this.db.findOne({_id: id}, {players: 1, text: 1, title: 1});
    }

    async all() {
        return await this.db.find({});
    }

    exists(id) {
        return !!(this.get(id));
    }

    async addPlayerToGame(gameId, playerId) {
        return await this.db.update({ _id: gameId }, { $push: { players: playerId } }, {});
    }
}

export const gameStore = new GameStore();