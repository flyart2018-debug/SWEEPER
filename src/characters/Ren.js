import { Character } from "./Character.js";
import { CHARACTER_DATA } from "./CharacterData.js";


export class Ren extends Character {

    constructor() {

        super(
            CHARACTER_DATA.REN
        );

    }


    /*
     * オーバードライブ
     *
     * HP30%以下で攻撃力+10
     */

    hasOverdrive() {

        return (
            this.hp <=
            this.maxHp * 0.3
        );

    }


    getAttackDamage() {

        let damage =
            super.getAttackDamage();


        if (
            this.hasOverdrive()
        ) {

            damage += 10;

        }


        return damage;

    }


    /*
     * オーバーブレード
     *
     * 次の攻撃 +50
     */

    activateOverBlade() {

        this.addAttackBonus(
            50
        );

    }

}