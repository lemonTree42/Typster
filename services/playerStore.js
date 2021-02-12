import {Player} from "./player.js";
import Datastore from 'nedb';

class PlayerStore {
    constructor() {
        this.db = new Datastore({filename: './data/players.db', autoload: true});
    }

    add(nickname, callback) {
        this.db.insert(new Player(nickname), function(err, doc) {
            callback(doc);
        });
    }

    get(id, callback) {
        this.db.findOne({_id: id}, function(err, doc) {
            callback(doc);
        });
    }

    all(callback) {
        this.db.find({}, function(err, docs) {
            callback(docs);
        });
    }
}

export const playerStore = new PlayerStore();