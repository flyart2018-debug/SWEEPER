import { Character } from "./Character.js";
import { CHARACTER_DATA } from "./CharacterData.js";


export class Kai extends Character {

    constructor() {

        super(
            CHARACTER_DATA.KAI
        );

        this.stepAvailable =
            true;

    }


    reset() {

        super.reset();

        this.stepAvailable =
            true;

    }


    /*
     * ステップ
     *
     * 攻撃後に1マス移動可能。
     */

    useStep() {

        if (
            !this.stepAvailable
        ) {

            return false;

        }


        this.stepAvailable =
            false;


        return true;

    }


    /*
     * ターン開始時に
     * ステップを再使用可能にする。
     */

    refreshStep() {

        this.stepAvailable =
            true;

    }


    /*
     * アクセルステップ
     *
     * 2マス移動。
     * 移動後の攻撃力 +10。
     */

    activateAccelStep() {

        this.addAttackBonus(
            10
        );

    }

}