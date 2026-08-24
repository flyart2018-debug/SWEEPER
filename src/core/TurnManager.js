export class TurnManager {

    constructor(gameState) {

        this.gameState =
            gameState;

    }


    startPlayerTurn() {

        if (
            this.gameState.gameOver
        ) {

            return;

        }


        this.gameState.phase =
            "PLAYER";

    }


    startEnemyTurn() {

        if (
            this.gameState.gameOver
        ) {

            return;

        }


        this.gameState.phase =
            "ENEMY";

    }


    finishEnemyTurn() {

        if (
            this.gameState.gameOver
        ) {

            return;

        }


        this.gameState.nextTurn();

    }


    isPlayerTurn() {

        return (
            this.gameState.phase ===
            "PLAYER"
        );

    }


    isEnemyTurn() {

        return (
            this.gameState.phase ===
            "ENEMY"
        );

    }

}