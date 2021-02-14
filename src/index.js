import "./styles/index.scss";
import "regenerator-runtime/runtime.js";

import Game from "./scripts/game";

window.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startButton");
    startButton.addEventListener("click", () => {
        const game = new Game(
            document.getElementById("game-window")
        );
        startButton.setAttribute("class", "display-none");
    });
});