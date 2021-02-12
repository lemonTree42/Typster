import {Player} from "./player.js";
import Datastore from 'nedb-promises';

class PlayerStore {
    constructor() {
        this.db = new Datastore({filename: './data/players.db', autoload: true});
    }

    async add(nickname, gameId, host) {
        return await this.db.insert(new Player(nickname, gameId, host));
    }

    async get(id) {
        return await this.db.findOne({_id: id});
    }

    async all() {
        return await this.db.find({});
    }

    async allOfGame(gameId) {
        return await this.db.find({game: gameId});
    }

    async playerIsInGame(playerId, gameId) {
        return !!(await this.db.findOne({_id: playerId, game: gameId}));
    }

    async getHostOfGame(gameId) {
        return await this.db.findOne({game: gameId, host: true});
    }

    async countPlayers(gameId) {
        return await this.db.count({game: gameId});
    }
}

export const playerStore = new PlayerStore();