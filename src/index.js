import "./styles/index.scss";
import "regenerator-runtime/runtime.js";

import Game from "./scripts/game";

window.addEventListener("DOMContentLoaded", () => {
    const game = new Game(
        document.getElementById("game-window")
    );
});