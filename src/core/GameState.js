export class GameState {

    constructor() {

        this.turn = 1;

        this.phase = "PLAYER";

        this.player = null;

        this.enemy = null;

        this.playerPosition = {
            row: 4,
            col: 2
        };

        this.enemyPosition = {
            row: 0,
            col: 2
        };

        this.selectedChip = null;

        this.gameOver = false;

        this.winner = null;

    }


    reset() {

        this.turn = 1;

        this.phase = "PLAYER";

        this.playerPosition = {
            row: 4,
            col: 2
        };

        this.enemyPosition = {
            row: 0,
            col: 2
        };

        this.selectedChip = null;

        this.gameOver = false;

        this.winner = null;

    }


    isPlayerTurn() {

        return (
            this.phase === "PLAYER" &&
            !this.gameOver
        );

    }


    isEnemyTurn() {

        return (
            this.phase === "ENEMY" &&
            !this.gameOver
        );

    }


    endGame(winner) {

        this.gameOver = true;

        this.winner = winner;

        this.phase = "GAME_OVER";

    }


    nextTurn() {

        this.turn++;

        this.phase = "PLAYER";

    }

}