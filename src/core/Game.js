import { GameState } from "./GameState.js";
import { GridManager } from "./GridManager.js";
import { TurnManager } from "./TurnManager.js";
import { BattleManager } from "./BattleManager.js";

import { EnemyAI } from "../ai/EnemyAI.js";
import { EffectManager } from "../effects/EffectManager.js";

import { Ren } from "../characters/Ren.js";
import { Kai } from "../characters/Kai.js";

import { createCommonChips } from "../chips/CommonChips.js";
import { createUniqueChip } from "../chips/UniqueChips.js";


export class Game {

    constructor() {

        this.state =
            new GameState();


        this.grid =
            new GridManager(
                5,
                5
            );


        this.turnManager =
            new TurnManager(
                this.state
            );


        this.battle =
            new BattleManager(

                this.state,

                this.grid,

                this.turnManager

            );


        this.enemyAI =
            new EnemyAI(

                this.state,

                this.grid,

                this.battle

            );


        this.effects =
            new EffectManager();


        this.commonChips = [];

        this.uniqueChip = null;

    }


    /*
     * -----------------------------------------------
     * GAME START
     * -----------------------------------------------
     */

    start(
        characterId
    ) {

        this.state.reset();


        const player =
            this.createCharacter(
                characterId
            );


        const enemy =
            this.createEnemy();


        if (
            !player
        ) {

            throw new Error(
                "Unknown character: " +
                characterId
            );

        }


        this.state.player =
            player;


        this.state.enemy =
            enemy;


        this.battle.setCharacters(

            player,

            enemy

        );


        this.commonChips =
            createCommonChips();


        this.uniqueChip =
            createUniqueChip(

                player.uniqueChip

            );


        this.enemyAI.setDifficulty(
            "NORMAL"
        );


        this.effects.clear();


        return this.state;

    }


    /*
     * -----------------------------------------------
     * CHARACTER CREATION
     * -----------------------------------------------
     */

    createCharacter(
        characterId
    ) {

        if (
            characterId === "REN"
        ) {

            return new Ren();

        }


        if (
            characterId === "KAI"
        ) {

            return new Kai();

        }


        return null;

    }


    /*
     * -----------------------------------------------
     * ENEMY
     * -----------------------------------------------
     */

    createEnemy() {

        return {

            id:
                "TRAINING_UNIT",

            name:
                "TRAINING UNIT",

            shortName:
                "CPU",

            type:
                "TRAINING",

            maxHp:
                100,

            hp:
                100,

            attackDamage:
                20,

            attackRange:
                1,

            isGuarding:
                false,

            nextAttackBonus:
                0,


            getAttackDamage() {

                const damage =
                    this.attackDamage +
                    this.nextAttackBonus;


                this.nextAttackBonus =
                    0;


                return damage;

            },


            startGuard() {

                this.isGuarding =
                    true;

            },


            clearGuard() {

                this.isGuarding =
                    false;

            }

        };

    }


    /*
     * -----------------------------------------------
     * MOVEMENT
     * -----------------------------------------------
     */

    movePlayer(
        row,
        col
    ) {

        return this.battle.movePlayer(

            row,

            col

        );

    }


    /*
     * -----------------------------------------------
     * BASIC ATTACK
     * -----------------------------------------------
     */

    playerAttack() {

        if (
            this.state.gameOver
        ) {

            return {

                success: false,

                reason:
                    "GAME_OVER"

            };

        }


        const player =
            this.state.player;


        /*
         * Characterクラス側の
         * getAttackDamage()を使う。
         *
         * ここでレンの
         * オーバードライブも
         * 正しく反映される。
         */

        if (
            !this.battle.canPlayerAttack()
        ) {

            return {

                success: false,

                reason:
                    "OUT_OF_RANGE"

            };

        }


        const damage =
            player.getAttackDamage();


        const result =
            this.battle.applyDamageToEnemy(

                damage

            );


        player.clearGuard();


        if (
            result.defeated
        ) {

            return {

                ...result,

                gameOver: true,

                winner:
                    "PLAYER"

            };

        }


        return {

            ...result,

            gameOver:
                false

        };

    }


    /*
     * -----------------------------------------------
     * CHIP
     * -----------------------------------------------
     */

    getAllChips() {

        return [

            ...this.commonChips,

            this.uniqueChip

        ];

    }


    useChip(
        chipId
    ) {

        if (
            this.state.gameOver
        ) {

            return {

                success: false,

                reason:
                    "GAME_OVER"

            };

        }


        const chip =
            this.getAllChips()
                .find(
                    item =>
                        item &&
                        item.id ===
                        chipId
                );


        if (
            !chip
        ) {

            return {

                success: false,

                reason:
                    "CHIP_NOT_FOUND"

            };

        }


        switch (
            chip.id
        ) {

            case "SWORD":

                return this.useSword(
                    chip
                );


            case "SHOT":

                return this.useShot(
                    chip
                );


            case "SHIELD":

                return this.useShield(
                    chip
                );


            case "DASH":

                return this.useDash(
                    chip
                );


            case "RECOVER":

                return this.useRecover(
                    chip
                );


            case "OVER_BLADE":

                return this.useOverBlade(
                    chip
                );


            case "ACCEL_STEP":

                return this.useAccelStep(
                    chip
                );


            default:

                return {

                    success: false,

                    reason:
                        "UNSUPPORTED_CHIP"

                };

        }

    }


    /*
     * -----------------------------------------------
     * SWORD
     * -----------------------------------------------
     */

    useSword(
        chip
    ) {

        const distance =
            this.grid.getDistance(

                this.state.playerPosition,

                this.state.enemyPosition

            );


        if (
            distance > chip.range
        ) {

            return {

                success: false,

                reason:
                    "OUT_OF_RANGE"

            };

        }


        const result =
            this.battle.applyDamageToEnemy(

                chip.damage

            );


        this.effects.slashEffect(

            0,

            0,

            "UP"

        );


        return result;

    }


    /*
     * -----------------------------------------------
     * SHOT
     * -----------------------------------------------
     */

    useShot(
        chip
    ) {

        const distance =
            this.grid.getDistance(

                this.state.playerPosition,

                this.state.enemyPosition

            );


        if (
            distance > chip.range
        ) {

            return {

                success: false,

                reason:
                    "OUT_OF_RANGE"

            };

        }


        return this.battle.applyDamageToEnemy(

            chip.damage

        );

    }


    /*
     * -----------------------------------------------
     * SHIELD
     * -----------------------------------------------
     */

    useShield(
        chip
    ) {

        this.state.player.startGuard();


        return {

            success: true,

            type:
                "DEFENSE",

            damageReduction:
                chip.damageReduction

        };

    }


    /*
     * -----------------------------------------------
     * DASH
     * -----------------------------------------------
     */

    useDash(
        chip
    ) {

        const current =
            this.state.playerPosition;


        const target = {

            row:
                current.row -
                chip.movement,

            col:
                current.col

        };


        if (
            !this.grid.isInside(

                target.row,

                target.col

            )
        ) {

            return {

                success: false,

                reason:
                    "OUT_OF_RANGE"

            };

        }


        if (
            this.grid.isSamePosition(

                target,

                this.state.enemyPosition

            )
        ) {

            return {

                success: false,

                reason:
                    "TARGET_OCCUPIED"

            };

        }


        this.state.playerPosition =
            target;


        return {

            success: true,

            movement:
                chip.movement

        };

    }


    /*
     * -----------------------------------------------
     * RECOVER
     * -----------------------------------------------
     */

    useRecover(
        chip
    ) {

        const recovered =
            this.state.player.heal(

                chip.recovery

            );


        return {

            success: true,

            recovered

        };

    }


    /*
     * -----------------------------------------------
     * REN
     * -----------------------------------------------
     */

    useOverBlade(
        chip
    ) {

        const player =
            this.state.player;


        if (
            player.id !== "REN"
        ) {

            return {

                success: false,

                reason:
                    "INVALID_CHARACTER"

            };

        }


        player.activateOverBlade();


        return {

            success: true,

            attackBonus:
                chip.attackBonus

        };

    }


    /*
     * -----------------------------------------------
     * KAI
     * -----------------------------------------------
     */

    useAccelStep(
        chip
    ) {

        const player =
            this.state.player;


        if (
            player.id !== "KAI"
        ) {

            return {

                success: false,

                reason:
                    "INVALID_CHARACTER"

            };

        }


        const current =
            this.state.playerPosition;


        const target = {

            row:
                current.row -
                chip.movement,

            col:
                current.col

        };


        if (
            !this.grid.isInside(

                target.row,

                target.col

            )
        ) {

            return {

                success: false,

                reason:
                    "OUT_OF_RANGE"

            };

        }


        if (
            this.grid.isSamePosition(

                target,

                this.state.enemyPosition

            )
        ) {

            return {

                success: false,

                reason:
                    "TARGET_OCCUPIED"

            };

        }


        this.state.playerPosition =
            target;


        player.activateAccelStep();


        return {

            success: true,

            movement:
                chip.movement,

            attackBonus:
                chip.attackBonus

        };

    }


    /*
     * -----------------------------------------------
     * ENEMY TURN
     * -----------------------------------------------
     */

    async executeEnemyTurn() {

        if (
            this.state.gameOver
        ) {

            return null;

        }


        this.turnManager.startEnemyTurn();


        this.state.player.clearGuard();


        const result =
            await this.enemyAI.executeTurn();


        if (
            !this.state.gameOver
        ) {

            this.turnManager.finishEnemyTurn();

        }


        return result;

    }


    /*
     * -----------------------------------------------
     * RESULT
     * -----------------------------------------------
     */

    getResult() {

        if (
            !this.state.gameOver
        ) {

            return null;

        }


        return {

            winner:
                this.state.winner,

            playerWon:
                this.state.winner ===
                "PLAYER"

        };

    }

}