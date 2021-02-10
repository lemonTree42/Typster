function initIndex() {
    const indexContainer = document.getElementById("index-container");
    const joinContainer = document.getElementById("join-container");
    const hostContainer = document.getElementById("host-container");
    const joinButton = document.getElementById("join-button");
    const hostButton = document.getElementById("host-button");

    const STATE_INDEX = 0;
    const STATE_JOIN = 1;
    const STATE_HOST = 2;
    let state = STATE_INDEX;

    function renderUI() {
        switch(state) {
            case STATE_INDEX:
                indexContainer.hidden = false;
                joinContainer.hidden = true;
                hostContainer.hidden = true;
                break;
            case STATE_JOIN:
                indexContainer.hidden = true;
                joinContainer.hidden = false;
                hostContainer.hidden = true;
                break;
            case STATE_HOST:
                indexContainer.hidden = true;
                joinContainer.hidden = true;
                hostContainer.hidden = false;
                break;
        }
    }

    joinButton.addEventListener("click", () => {
        history.pushState(state, "test1");
        state = STATE_JOIN;
        renderUI();
    });

    hostButton.addEventListener("click", () => {
        history.pushState(state, "test2");
        state = STATE_HOST;
        renderUI();
    });

    renderUI();
}

window.addEventListener("load", initIndex);