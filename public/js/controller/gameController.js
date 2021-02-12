import {GameService} from "../services/gameService.js";

async function initApp() {
    const lobbyContainer = document.getElementById("lobby-container");
    const gameContainer = document.getElementById("game-container");
    const rankingContainer = document.getElementById("ranking-container");
    const playersLobbyContainer = document.getElementById("players-container");
    const startButton = document.getElementById("start-button");

    const playersLobbyTemplate = document.getElementById("players-template").innerHTML;
    const createPlayersHtml = Handlebars.compile(playersLobbyTemplate);

    const STATE_LOBBY = 0;
    const STATE_GAME = 1;
    const STATE_RANKING = 2;
    let state = STATE_LOBBY;
    const gameId = window.location.pathname.split('/')[2];
    let isHost = false;
    const socket = io();
    const gameService = new GameService(gameId, socket);

    socket.on('EVENT_START_GAME', function(msg) {
        console.log("MESSAGE: ");
        console.log(msg);
    });

    function renderUI() {
        switch(state) {
            case STATE_LOBBY:
                lobbyContainer.hidden = false;
                gameContainer.hidden = true;
                rankingContainer.hidden = true;
                isHost?startButton.hidden=false:startButton.hidden=true;
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
            const result = await gameService.getLobby();
            isHost = result.isHost;
            playersLobbyContainer.innerHTML = createPlayersHtml(result);
            setTimeout(updatePlayers, 1000);
        }
    };

    startButton.addEventListener('click', () => {
        gameService.startGame();
    });

    await updatePlayers();
    renderUI();
}

window.addEventListener('load', initApp);