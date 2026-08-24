import { GameState } from "./GameState.js";
import { GridManager } from "./GridManager.js";
import { TurnManager } from "./TurnManager.js";
import { BattleManager } from "./BattleManager.js";

import { EnemyAI } from "../ai/EnemyAI.js";
import { EffectManager } from "../effects/EffectManager.js";
import { RealtimeBattleManager } from "../realtime/RealtimeBattleManager.js";

import { Ren } from "../characters/Ren.js";
import { Kai } from "../characters/Kai.js";

import { createCommonChips } from "../chips/CommonChips.js";
import { createUniqueChip } from "../chips/UniqueChips.js";


export class Game {

    constructor() {

        this.state = new GameState();

        this.grid =
            new GridManager(5, 5);

        this.turnManager =
            new TurnManager(this.state);

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

        this.realtime =
            new RealtimeBattleManager(this);

        this.commonChips = [];

        this.uniqueChip = null;

    }


    start(characterId) {

        this.realtime.stop();

        this.state.reset();

        const player =
            this.createCharacter(characterId);

        const enemy =
            this.createEnemy();

        if (!player) {

            throw new Error(
                "Unknown character: " +
                characterId
            );

        }

        this.state.player =
            player;

        this.state.enemy =
            enemy;

        /*
         * リアルタイム戦闘用
         */

        this.state.playerDirection =
            "UP";

        /*
         * 初期位置
         *
         * プレイヤー側
         * 敵側
         */

        this.state.playerPosition = {
            row: 4,
            col: 2
        };

        this.state.enemyPosition = {
            row: 0,
            col: 2
        };

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

        /*
         * リアルタイム戦闘開始
         */

        this.realtime.start();

        return this.state;

    }


    createCharacter(characterId) {

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

                this.nextAttackBonus = 0;

                return damage;

            },


            startGuard() {

                this.isGuarding = true;

            },


            clearGuard() {

                this.isGuarding = false;

            }

        };

    }


    movePlayer(
        row,
        col
    ) {

        const current =
            this.state.playerPosition;

        const distance =
            Math.abs(
                current.row - row
            ) +
            Math.abs(
                current.col - col
            );

        if (
            distance !== 1
        ) {

            return {
                success: false
            };

        }

        const direction =
            this.getDirection(
                current,
                { row, col }
            );

        const moved =
            this.realtime.movePlayer(
                direction
            );

        return {

            success: moved

        };

    }


    getDirection(
        current,
        target
    ) {

        if (
            target.row <
            current.row
        ) {

            return "UP";

        }

        if (
            target.row >
            current.row
        ) {

            return "DOWN";

        }

        if (
            target.col <
            current.col
        ) {

            return "LEFT";

        }

        return "RIGHT";

    }


    playerAttack() {

        return this.realtime.playerAttack();

    }


    getAllChips() {

        return [

            ...this.commonChips,

            this.uniqueChip

        ].filter(Boolean);

    }


    useChip(chipId) {

        return this.realtime.useChip(
            chipId
        );

    }


    async executeEnemyTurn() {

        /*
         * リアルタイム版では
         * ターン終了という概念を使わない。
         */

        return null;

    }


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