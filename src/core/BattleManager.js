export class BattleManager {

    constructor(
        gameState,
        gridManager,
        turnManager
    ) {

        this.gameState =
            gameState;

        this.grid =
            gridManager;

        this.turnManager =
            turnManager;

    }


    setCharacters(
        player,
        enemy
    ) {

        this.gameState.player =
            player;

        this.gameState.enemy =
            enemy;

    }


    canPlayerMoveTo(
        row,
        col
    ) {

        if (
            !this.turnManager.isPlayerTurn()
        ) {

            return false;

        }


        const current =
            this.gameState.playerPosition;


        const target = {
            row,
            col
        };


        if (
            !this.grid.isInside(
                row,
                col
            )
        ) {

            return false;

        }


        if (
            this.grid.getDistance(
                current,
                target
            ) !== 1
        ) {

            return false;

        }


        if (
            this.grid.isSamePosition(
                target,
                this.gameState.enemyPosition
            )
        ) {

            return false;

        }


        return true;

    }


    movePlayer(
        row,
        col
    ) {

        if (
            !this.canPlayerMoveTo(
                row,
                col
            )
        ) {

            return {

                success: false,

                reason:
                    "INVALID_MOVE"

            };

        }


        this.gameState.playerPosition = {

            row,

            col

        };


        return {

            success: true

        };

    }


    getPlayerDistanceFromEnemy() {

        return this.grid.getDistance(

            this.gameState.playerPosition,

            this.gameState.enemyPosition

        );

    }


    canPlayerAttack() {

        if (
            !this.turnManager.isPlayerTurn()
        ) {

            return false;

        }


        const player =
            this.gameState.player;


        const distance =
            this.getPlayerDistanceFromEnemy();


        return (
            distance <=
            player.attackRange
        );

    }


    playerAttack() {

        if (
            !this.canPlayerAttack()
        ) {

            return {

                success: false,

                reason:
                    "OUT_OF_RANGE"

            };

        }


        const player =
            this.gameState.player;


        let damage =
            player.attackDamage;


        /*
         * REN
         * Overdrive
         *
         * HP 30%以下で攻撃+10
         */

        if (
            player.id === "REN" &&
            player.hp <=
                player.maxHp * 0.3
        ) {

            damage += 10;

        }


        this.gameState.enemy.hp =
            Math.max(

                0,

                this.gameState.enemy.hp -
                damage

            );


        if (
            this.gameState.enemy.hp <= 0
        ) {

            this.gameState.endGame(
                "PLAYER"
            );

        }


        return {

            success: true,

            damage,

            defeated:
                this.gameState.enemy.hp <= 0

        };

    }


    applyDamageToPlayer(
        damage
    ) {

        const player =
            this.gameState.player;


        let finalDamage =
            damage;


        if (
            player.isGuarding
        ) {

            finalDamage =
                Math.floor(
                    damage * 0.5
                );

        }


        player.hp =
            Math.max(

                0,

                player.hp -
                finalDamage

            );


        if (
            player.hp <= 0
        ) {

            this.gameState.endGame(
                "ENEMY"
            );

        }


        return {

            damage:
                finalDamage,

            defeated:
                player.hp <= 0

        };

    }


    applyDamageToEnemy(
        damage
    ) {

        const enemy =
            this.gameState.enemy;


        enemy.hp =
            Math.max(

                0,

                enemy.hp -
                damage

            );


        if (
            enemy.hp <= 0
        ) {

            this.gameState.endGame(
                "PLAYER"
            );

        }


        return {

            damage,

            defeated:
                enemy.hp <= 0

        };

    }

}