import "./styles/index.scss";

import Game from "./scripts/game";

window.addEventListener("DOMContentLoaded", () => {
    const game = new Game(
        document.getElementById("game-window")
    );
    game.start();
});