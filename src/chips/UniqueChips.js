import { Chip } from "./Chip.js";


export const UNIQUE_CHIP_DATA = {

    OVER_BLADE: {

        id: "OVER_BLADE",

        name: "オーバーブレード",

        type: "UNIQUE_ATTACK",

        description:
            "次の攻撃を強化。ダメージ+50。使用後1ターン待機。",

        attackBonus: 50,

        isUnique: true

    },


    ACCEL_STEP: {

        id: "ACCEL_STEP",

        name: "アクセルステップ",

        type: "UNIQUE_MOVE",

        description:
            "一気に2マス移動。移動後、そのターンの攻撃力+10。",

        movement: 2,

        attackBonus: 10,

        canUseAfterAttack: true,

        isUnique: true

    }

};


export function createUniqueChip(
    chipId
) {

    const data =
        UNIQUE_CHIP_DATA[
            chipId
        ];


    if (!data) {

        return null;

    }


    return new Chip(data);

}