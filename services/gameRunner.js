import {PlayerStore} from "./playerStore.js";
import {playerSocketMap} from "./playerSocketMap.js";
import {colors} from "./colors.js";
import {performance} from 'perf_hooks';

export class GameRunner {
    constructor(id, game) {
        this.id = id;
        this.status = "lobby";
        this.playerStore = new PlayerStore();
        this.game = game;
    }

    addPlayer(playerId, nickname) {
        this.playerStore.add(playerId, nickname, colors.player[this.playerStore.size()]);
    }

    addSocketToPlayer(playerId, socket) {
        this.playerStore.get(playerId).socket = socket;
    }

    broadcast(event, data) {
        for(const id of this.playerStore.allIDs()) {
            playerSocketMap[id].emit(event, data);
        }
    }

    start() {
        this.status = "ingame";
        this.broadcast("EVENT_SERVER_START_GAME", undefined);
        this.START_TIME = performance.now();
    }

    showRanking() {
        this.status = "ranking";
        this.broadcast("EVENT_SERVER_RANKING", this.playerStore.entries().sort(e => e[1].cpm));
    }

    updatePlayerScore(playerId, progress) {
        this.playerStore.update(playerId, progress, progress/((performance.now()-this.START_TIME)/(1000*60)));
        if(this.checkProgressAllFinished()) {
            this.showRanking();
        } else {
            this.broadcast("EVENT_SERVER_UPDATE_DATA", this.playerStore.entries());
        }
    }

    checkProgressAllFinished(progress) {
        return this.playerStore.entries().every(e => e[1].progress>=this.game.text.length);
    }
}