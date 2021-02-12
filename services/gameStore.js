import {Game} from "./game.js";
import Datastore from 'nedb';

class GameStore {
    constructor() {
        this.db = new Datastore({filename: './data/games.db', autoload: true});
    }

    add(hostId, gameText, gameTitle, callback) {
        this.db.insert(new Game(hostId, gameText, gameTitle), function(err, doc) {
            callback(doc);
        });
    }

    get(id, callback) {
        this.db.findOne({_id: id}, function(err, doc) {
            if(err) throw err;
            callback(doc);
        });
    }

    all(callback) {
        this.db.find({}, function(err, doc) {
            callback(doc);
        });
    }

    exists(id, callback) {
        this.get(id, function(doc) {
            callback(!!doc);
        });
    }

    addPlayerToGame(gameId, playerId, callback) {
        this.db.update({ _id: gameId }, { $push: { players: playerId } }, {}, function(err, doc) {
            callback(doc);
        });
    }

    gameContainsPlayer(gameId, playerId, callback) {
        this.db.findOne({_id: gameId, players: [playerId]}, function(err, doc) {
            callback(!!doc);
        });
    }
}

export const gameStore = new GameStore();