export class Game {
    constructor(host, text, title) {
        this.players = [];
        this.players.push(host);
        this.host = host;
        this.text = text;
        this.title = title;
    }

    add(player) {
        this.players.push(player);
    }

    setID(id) {
        this.id = id;
    }
}