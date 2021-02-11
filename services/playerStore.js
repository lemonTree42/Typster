import {Player} from "./player.js";
import Datastore from 'nedb-promises';

class PlayerStore {
    constructor() {
        this.db = new Datastore({filename: './data/players.db', autoload: true});
    }

    async add(nickname, req) {
        return await this.db.insert(new Player(nickname));
    }

    async get(id) {
        return await this.db.findOne({_id: id});
    }

    async all() {
        return await this.db.find({});
    }
}

export const playerStore = new PlayerStore();