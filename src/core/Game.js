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

        this.grid = new GridManager(5, 5);

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


        this.state.playerDirection =
            "UP";


        // プレイヤー初期位置
        this.state.playerPosition = {
            row: 4,
            col: 2
        };


        // CPU初期位置
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

                return damage