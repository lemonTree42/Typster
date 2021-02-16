import {GameService} from "../services/gameService.js";

async function initApp() {
    const lobbyContainer = document.getElementById("lobby-container");
    const lobbyTitleContainer = document.getElementById("lobby-game-title");
    const lobbyGameTextContainer = document.getElementById("lobby-game-text");
    const gameContainer = document.getElementById("game-container");
    const rankingContainer = document.getElementById("ranking-container");
    const playersLobbyContainer = document.getElementById("players-container");
    const startButton = document.getElementById("start-button");
    const lobbyWaitingForHostText = document.getElementById("waiting-for-host-text");

    const gameTextContainer = document.getElementById("game-text-container");
    const gameInputField = document.getElementById("game-input-field");
    let gameCurrentSpan = document.getElementById("0");
    let gameTextCursorOwn;
    let gameTextCursorOwnColor = {};

    const playersLobbyTemplate = document.getElementById("players-template").innerHTML;
    const createPlayersHtml = Handlebars.compile(playersLobbyTemplate);

    const STATE_LOBBY = 0;
    const STATE_GAME = 1;
    const STATE_RANKING = 2;
    let state = STATE_LOBBY;
    const gameId = window.location.pathname.split('/')[2];
    let playerId = -1;
    let game;
    const socket = io();
    const gameService = new GameService(gameId, socket);

    let cursor = 0;

    socket.on('EVENT_SERVER_PLAYERID', function(id) {
        playerId = id;
    });

    socket.on('EVENT_SERVER_START_GAME', function() {
        state = STATE_GAME;
        renderUI();
    });

    socket.on("EVENT_SERVER_UPDATE_DATA", function(players) {
        updateOtherCursors(players);
    });

    socket.on("EVENT_SERVER_RANKING", function(ranking) {
        state = STATE_RANKING;
        renderUI();
        renderRanking(ranking);
        renderPlayAgainButton();
    });

    function updateOtherCursors(players) {
        for(const p of players) {
            if(p[0]!==playerId) {
                const cursor = document.getElementById(`game-text-cursor-${p[0]}`);
                renderCursor(cursor, p[1].progress);
            }
        }
    }

    async function renderUI() {
        switch (state) {
            case STATE_LOBBY:
                await renderLobby();
                await renderPlayers();
                lobbyContainer.hidden = false;
                gameContainer.hidden = true;
                rankingContainer.hidden = true;
                break;
            case STATE_GAME:
                renderGame();
                lobbyContainer.hidden = true;
                gameContainer.hidden = false;
                rankingContainer.hidden = true;
                normalizeSpanWidth();
                const result = await gameService.getPlayers();
                renderAllCursors(result.players);
                break;
            case STATE_RANKING:
                lobbyContainer.hidden = true;
                gameContainer.hidden = true;
                rankingContainer.hidden = false;
                break;
        }
    }

    async function renderLobby() {
        game = await gameService.getGame();
        lobbyTitleContainer.innerText = game.title;
        lobbyGameTextContainer.innerText = game.text;
        if(game.isHost) {
            startButton.style.display = "static";
            lobbyWaitingForHostText.style.display = "none";
        } else {
            startButton.style.display = "none";
            lobbyWaitingForHostText.style.display = "static";
        }
    }

    async function renderPlayers() {
        if(state===STATE_LOBBY) {
            const players = await gameService.getPlayers();
            playersLobbyContainer.innerHTML = createPlayersHtml(players);
            setTimeout(renderPlayers, 1000);
        }
    }

    function renderGame() {
        gameTextContainer.innerHTML = createGameTextStructure(game.text);
    }

    function createGameTextStructure(text) {
        let result = "";
        for(let i=0; i<text.length; i++) {
            result += `<span id='${i}' class="game-text-span">${text.charAt(i)}</span>`;
        }
        return result;
    }

    function renderRanking(ranking) {
        let result = '';
        for(const i in ranking) {
            result += `<tr><td>${Number(i)+1}</td><td>${ranking[i][1].nickname}</td><td>${Math.round(ranking[i][1].cpm)}</td></tr>`;
        }
        document.getElementById("ranking-container-tbody").innerHTML = result;
    }

    function renderPlayAgainButton() {
        const rankingPlayAgainForm = document.getElementById("ranking-play-again-form");
        rankingPlayAgainForm.action = `/game/${gameId}`;
    }

    function normalizeSpanWidth() {
        const spans = [...document.querySelectorAll("span")];
        debugger;
        const max = Math.max.apply(Math, spans.map(e => e.getBoundingClientRect().width));
        console.log(max);
        spans.forEach(e => e.style.flex = `0 0 ${max}px`);
    }

    startButton.addEventListener('click', () => {
        gameService.startGame();
    });

    gameInputField.addEventListener('input', (e) => {
        const input = e.target.value;
        const lastCharacter = input[input.length-1];
        const prevCharacters = input.substr(0, input.length-1);
        if(lastCharacter===game.text[cursor]) {
            gameTextCursorOwn.style.background = `rgba(${gameTextCursorOwnColor.r}, ${gameTextCursorOwnColor.g}, ${gameTextCursorOwnColor.b}, 0.3)`;
            gameService.sendCorrectInput(cursor+1);
            if(++cursor<game.text.length) {
                renderCursor(gameTextCursorOwn, cursor);
            } else {
                renderWaitingText();
            }
        } else {
            gameTextCursorOwn.style.background = `rgba(198, 40, 40, 0.3)`;
            gameInputField.value = prevCharacters;
        }
    });

    function renderWaitingText() {
        gameTextCursorOwn.hidden = true;
        gameInputField.hidden = true;
        gameTextContainer.insertAdjacentHTML('afterend', 'Waiting for other players to finish.');
    }

    function renderCursor(cursor, index) {
        const span = document.getElementById(""+(index));
        cursor.style.top = span.getBoundingClientRect().top + "px";
        cursor.style.left = span.getBoundingClientRect().left + "px";
        cursor.style.width = span.getBoundingClientRect().width + "px";
        cursor.style.height = span.getBoundingClientRect().height + "px";
    }

    function renderAllCursors(players) {
        for(const p of players) {
            gameTextContainer.insertAdjacentHTML('beforebegin', `<div id="game-text-cursor-${p[0]}" class="cursor" style="background-color: rgba(${p[1].color.r}, ${p[1].color.g}, ${p[1].color.b}, 0.3)"></div>`);
            if(p[0]===playerId) {
                gameTextCursorOwn = document.getElementById(`game-text-cursor-${p[0]}`);
                gameTextCursorOwnColor = p[1].color;
            }
        }
        for(const p of players) {
            const cursor = document.getElementById(`game-text-cursor-${p[0]}`);
            renderCursor(cursor, p[1].progress);
        }
    }

    await renderUI();
}

window.addEventListener('load', initApp);