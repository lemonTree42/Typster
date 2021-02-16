import {Player} from "./player.js";

export class PlayerStore {
    constructor() {
        this.store = {};
    }

    add(id, nickname, color) {
        this.store[id] = new Player(nickname, color);
    }

    get(id) {
        return this.store[id];
    }

    allIDs() {
        return Object.keys(this.store);
    }

    entries() {
        return Object.entries(this.store);
    }

    contains(id) {
        return !!this.store[id];
    }

    size() {
        return Object.keys(this.store).length;
    }

    update(id, progress, cpm) {
        this.store[id].progress = progress;
        this.store[id].cpm = cpm;
    }
}