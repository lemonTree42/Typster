import {playerSocketMap} from "./playerSocketMap.js";

export class Game {
    constructor(hostId, text, title) {
        this.players = [hostId];
        this.hostId = hostId;
        this.text = text;
        this.title = title;
    }

    start() {
        console.log("------------------");
        for(const p of this.players) {
            playerSocketMap[p.nickname].emit('EVENT_START_GAME', {hoi: "duleu"});
        }
    }
}