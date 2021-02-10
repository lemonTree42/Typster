import {gameService} from "../services/gameService.js";

const lobbyContainer = document.getElementById("lobby-container");
const gameContainer = document.getElementById("game-container");
const rankingContainer = document.getElementById("ranking-container");
const playersLobbyContainer = document.getElementById("players-container");

const playersLobbyTemplate = document.getElementById("players-template").innerHTML;
const createPlayersHtml = Handlebars.compile(playersLobbyTemplate);

const STATE_LOBBY = 0;
const STATE_GAME = 1;
const STATE_RANKING = 2;
let state = STATE_LOBBY;
const gameId = window.location.pathname.split('/')[2];

function renderUI() {
    switch(state) {
        case STATE_LOBBY:
            lobbyContainer.hidden = false;
            gameContainer.hidden = true;
            rankingContainer.hidden = true;
            break;
        case STATE_GAME:
            lobbyContainer.hidden = true;
            gameContainer.hidden = false;
            rankingContainer.hidden = true;
            break;
        case STATE_RANKING:
            lobbyContainer.hidden = true;
            gameContainer.hidden = true;
            rankingContainer.hidden = false;
            break;
    }
}

const updatePlayers = async function() {
    if(state === STATE_LOBBY) {
        const players = await gameService.getPlayers(gameId);
        playersLobbyContainer.innerHTML = createPlayersHtml(players);
        setTimeout(updatePlayers, 1000);
    }
};

updatePlayers();
renderUI();