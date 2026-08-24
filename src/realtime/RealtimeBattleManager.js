import { CooldownSystem } from "./CooldownSystem.js";


export class RealtimeBattleManager {

    constructor(game) {

        this.game =
            game;

        this.cooldowns =
            new CooldownSystem();


        this.running =
            false;


        this.loopId =
            null;


        this.lastEnemyMove =
            0;


        this.lastEnemyAttack =
            0;


        this.enemyMoveInterval =
            650;


        this.enemyAttackCooldown =
            750;


        this.playerMoveCooldown =
            130;


        this.attackCooldown =
            450;


        this.lastPlayerMove =
            0;

    }


    start() {

        this.running =
            true;


        this.cooldowns.clearAll();


        this.lastEnemyMove =
            performance.now();


        this.lastEnemyAttack =
            0;


        this.lastPlayerMove =
            0;


        this.loop();

    }


    stop() {

        this.running =
            false;


        if (
            this.loopId !== null
        ) {

            cancelAnimationFrame(
                this.loopId
            );

            this.loopId =
                null;

        }

    }


    loop() {

        if (
            !this.running
        ) {

            return;

        }


        if (
            this.game.state.gameOver
        ) {

            this.stop();

            return;

        }


        const now =
            performance.now();


        this.updateEnemy(
            now
        );


        this.loopId =
            requestAnimationFrame(
                () => this.loop()
            );

    }


    canPlayerMove() {

        return (
            this.cooldowns.isReady(
                "PLAYER_MOVE"
            )
        );

    }


    movePlayer(direction) {

        if (
            !this.running ||
            this.game.state.gameOver
        ) {

            return false;

        }


        if (
            !this.canPlayerMove()
        ) {

            return false;

        }


        const player =
            this.game.state.player;


        const current =
            this.game.state.playerPosition;


        const target =
            this.game.grid
                .getPositionAfterMove(

                    current,

                    direction,

                    1

                );


        if (!target) {

            return false;

        }


        if (
            this.game.grid.isSamePosition(

                target,

                this.game.state.enemyPosition

            )
        ) {

            return false;

        }


        this.game.state.playerDirection =
            direction;


        this.game.state.playerPosition =
            target;


        this.cooldowns.set(

            "PLAYER_MOVE",

            this.playerMoveCooldown

        );


        return true;

    }


    playerAttack() {

        if (
            !this.running ||
            this.game.state.gameOver
        ) {

            return {

                success: false

            };

        }


        if (
            !this.cooldowns.isReady(
                "ATTACK"
            )
        ) {

            return {

                success: false,

                reason:
                    "COOLDOWN"

            };

        }


        const player =
            this.game.state.player;


        const direction =
            this.game.state.playerDirection;


        const target =
            this.game.grid
                .getPositionAfterMove(

                    this.game.state.playerPosition,

                    direction,

                    player.attackRange

                );


        if (!target) {

            return {

                success: false,

                reason:
                    "OUT_OF_FIELD"

            };

        }


        const enemy =
            this.game.state.enemyPosition;


        let hit =
            false;


        if (
            player.attackRange === 1
        ) {

            hit =
                this.game.grid
                    .isSamePosition(
                        target,
                        enemy
                    );

        }
        else {

            hit =
                this.isInLine(
                    this.game.state.playerPosition,
                    enemy,
                    direction,
                    player.attackRange
                );

        }


        if (!hit) {

            this.cooldowns.set(

                "ATTACK",

                this.attackCooldown

            );


            return {

                success: true,

                hit: false,

                damage: 0

            };

        }


        const damage =
            player.getAttackDamage();


        const result =
            this.game.battle
                .applyDamageToEnemy(
                    damage
                );


        this.cooldowns.set(

            "ATTACK",

            this.attackCooldown

        );


        return {

            success: true,

            hit: true,

            damage,

            defeated:
                result.defeated

        };

    }


    useChip(chipId) {

        if (
            !this.running ||
            this.game.state.gameOver
        ) {

            return {

                success: false

            };

        }


        const cooldownId =
            `CHIP_${chipId}`;


        if (
            !this.cooldowns.isReady(
                cooldownId
            )
        ) {

            return {

                success: false,

                reason:
                    "COOLDOWN"

            };

        }


        let result;


        switch (
            chipId
        ) {

            case "SWORD":

                result =
                    this.useSword();

                break;


            case "SHOT":

                result =
                    this.useShot();

                break;


            case "SHIELD":

                result =
                    this.useShield();

                break;


            case "DASH":

                result =
                    this.useDash();

                break;


            case "RECOVER":

                result =
                    this.useRecover();

                break;


            case "OVER_BLADE":

                result =
                    this.useOverBlade();

                break;


            case "ACCEL_STEP":

                result =
                    this.useAccelStep();

                break;


            default:

                result = {

                    success: false,

                    reason:
                        "UNKNOWN_CHIP"

                };

        }


        if (
            result.success
        ) {

            this.cooldowns.set(

                cooldownId,

                700

            );

        }


        return result;

    }


    useSword() {

        const direction =
            this.game.state.playerDirection;


        const target =
            this.game.grid
                .getPositionAfterMove(

                    this.game.state.playerPosition,

                    direction,

                    1

                );


        if (!target) {

            return {

                success: false

            };

        }


        if (
            !this.game.grid
                .isSamePosition(

                    target,

                    this.game.state.enemyPosition

                )
        ) {

            return {

                success: false,

                reason:
                    "MISS"

            };

        }


        const result =
            this.game.battle
                .applyDamageToEnemy(
                    40
                );


        return {

            success: true,

            hit: true,

            damage: 40,

            defeated:
                result.defeated

        };

    }


    useShot() {

        const start =
            this.game.state.playerPosition;


        const enemy =
            this.game.state.enemyPosition;


        const direction =
            this.game.state.playerDirection;


        if (
            !this.isInLine(

                start,

                enemy,

                direction,

                3

            )
        ) {

            return {

                success: false,

                reason:
                    "MISS"

            };

        }


        const result =
            this.game.battle
                .applyDamageToEnemy(
                    20
                );


        return {

            success: true,

            hit: true,

            damage: 20,

            defeated:
                result.defeated

        };

    }


    useShield() {

        this.game.state.player
            .startGuard();


        return {

            success: true,

            damageReduction:
                0.5

        };

    }


    useDash() {

        const direction =
            this.game.state.playerDirection;


        const target =
            this.game.grid
                .getPositionAfterMove(

                    this.game.state.playerPosition,

                    direction,

                    2

                );


        if (!target) {

            return {

                success: false,

                reason:
                    "OUT_OF_FIELD"

            };

        }


        if (
            this.game.grid
                .isSamePosition(

                    target,

                    this.game.state.enemyPosition

                )
        ) {

            return {

                success: false,

                reason:
                    "BLOCKED"

            };

        }


        this.game.state.playerPosition =
            target;


        return {

            success: true,

            movement: 2

        };

    }


    useRecover() {

        const recovered =
            this.game.state.player
                .heal(30);


        return {

            success: true,

            recovered

        };

    }


    useOverBlade() {

        const player =
            this.game.state.player;


        if (
            player.id !==
            "REN"
        ) {

            return {

                success: false

            };

        }


        player.activateOverBlade();


        return {

            success: true,

            attackBonus: 50

        };

    }


    useAccelStep() {

        const player =
            this.game.state.player;


        if (
            player.id !==
            "KAI"
        ) {

            return {

                success: false

            };

        }


        const result =
            this.useDash();


        if (
            !result.success
        ) {

            return result;

        }


        player.activateAccelStep();


        return {

            success: true,

            movement: 2,

            attackBonus: 10

        };

    }


    updateEnemy(now) {

        const enemy =
            this.game.state.enemy;


        const enemyPosition =
            this.game.state.enemyPosition;


        const playerPosition =
            this.game.state.playerPosition;


        const distance =
            this.game.grid.getDistance(

                enemyPosition,

                playerPosition

            );


        /*
         * 攻撃
         */

        if (
            distance === 1 &&
            now -
                this.lastEnemyAttack >=
                this.enemyAttackCooldown
        ) {

            const damage =
                enemy.getAttackDamage();


            const result =
                this.game.battle
                    .applyDamageToPlayer(
                        damage
                    );


            this.lastEnemyAttack =
                now;


            if (
                result.defeated
            ) {

                this.stop();

            }


            return;

        }


        /*
         * 接近
         */

        if (
            now -
                this.lastEnemyMove <
                this.enemyMoveInterval
        ) {

            return;

        }


        this.lastEnemyMove =
            now;


        const candidates =
            this.game.grid
                .getAdjacentPositions(
                    enemyPosition
                );


        candidates.sort(
            (a, b) => {

                const aDistance =
                    this.game.grid
                        .getDistance(
                            a,
                            playerPosition
                        );


                const bDistance =
                    this.game.grid
                        .getDistance(
                            b,
                            playerPosition
                        );


                return (
                    aDistance -
                    bDistance
                );

            }
        );


        for (
            const candidate
            of candidates
        ) {

            if (
                this.game.grid
                    .isSamePosition(

                        candidate,

                        playerPosition

                    )
            ) {

                continue;

            }


            this.game.state.enemyPosition =
                candidate;


            break;

        }

    }


    isInLine(
        start,
        target,
        direction,
        range
    ) {

        for (
            let distance = 1;
            distance <= range;
            distance++
        ) {

            const position =
                this.game.grid
                    .getPositionAfterMove(

                        start,

                        direction,

                        distance

                    );


            if (!position) {

                break;

            }


            if (
                this.game.grid
                    .isSamePosition(

                        position,

                        target

                    )
            ) {

                return true;

            }

        }


        return false;

    }


    getCooldown(id) {

        return this.cooldowns
            .getRemaining(id);

    }


    getCooldownRatio(id) {

        return this.cooldowns
            .getRemainingRatio(id);

    }

}