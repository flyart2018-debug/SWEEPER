export class EnemyAI {

    constructor(
        gameState,
        gridManager,
        battleManager
    ) {

        this.gameState =
            gameState;

        this.grid =
            gridManager;

        this.battle =
            battleManager;

        this.difficulty =
            "NORMAL";

    }


    setDifficulty(
        difficulty
    ) {

        const allowed = [
            "EASY",
            "NORMAL",
            "HARD"
        ];


        if (
            allowed.includes(
                difficulty
            )
        ) {

            this.difficulty =
                difficulty;

        }

    }


    async executeTurn() {

        if (
            this.gameState.gameOver
        ) {

            return;

        }


        const enemy =
            this.gameState.enemy;


        const player =
            this.gameState.player;


        if (
            !enemy ||
            !player
        ) {

            return;

        }


        const distance =
            this.grid.getDistance(

                this.gameState.enemyPosition,

                this.gameState.playerPosition

            );


        /*
         * EASY
         *
         * 基本的な行動のみ。
         */

        if (
            this.difficulty === "EASY"
        ) {

            if (
                distance <=
                enemy.attackRange
            ) {

                this.enemyAttack();

            }
            else {

                this.moveTowardPlayer();

            }

            return;

        }


        /*
         * NORMAL
         *
         * HPが低い場合は一定確率で防御。
         */

        if (
            this.difficulty === "NORMAL"
        ) {

            if (
                enemy.hp <=
                enemy.maxHp * 0.3
            ) {

                if (
                    Math.random() < 0.35
                ) {

                    enemy.startGuard();

                    return;

                }

            }


            if (
                distance <=
                enemy.attackRange
            ) {

                this.enemyAttack();

            }
            else {

                this.moveTowardPlayer();

            }

            return;

        }


        /*
         * HARD
         *
         * 攻撃可能なら攻撃。
         * 距離がある場合は接近。
         * HPが低い場合は防御。
         */

        if (
            this.difficulty === "HARD"
        ) {

            if (
                enemy.hp <=
                enemy.maxHp * 0.25
            ) {

                enemy.startGuard();

            }


            if (
                distance <=
                enemy.attackRange
            ) {

                this.enemyAttack();

            }
            else {

                this.moveTowardPlayer();

            }

        }

    }


    enemyAttack() {

        const enemy =
            this.gameState.enemy;


        const damage =
            enemy.getAttackDamage();


        const result =
            this.battle.applyDamageToPlayer(
                damage
            );


        enemy.clearGuard();


        return result;

    }


    moveTowardPlayer() {

        const enemyPosition =
            this.gameState.enemyPosition;


        const playerPosition =
            this.gameState.playerPosition;


        const candidates =
            this.grid.getAdjacentPositions(
                enemyPosition
            );


        /*
         * プレイヤーに最も近づける
         * マスを選択する。
         */

        candidates.sort(
            (a, b) => {

                const distanceA =
                    this.grid.getDistance(
                        a,
                        playerPosition
                    );


                const distanceB =
                    this.grid.getDistance(
                        b,
                        playerPosition
                    );


                return (
                    distanceA -
                    distanceB
                );

            }
        );


        for (
            const position of candidates
        ) {

            /*
             * プレイヤーのマスには
             * 入らない。
             */

            if (
                this.grid.isSamePosition(

                    position,

                    playerPosition

                )
            ) {

                continue;

            }


            this.gameState.enemyPosition =
                position;

            return position;

        }


        return null;

    }

}