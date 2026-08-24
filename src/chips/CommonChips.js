import { Chip } from "./Chip.js";


export const COMMON_CHIP_DATA = [

    {
        id: "SWORD",

        name: "ソード",

        type: "ATTACK",

        description:
            "前方1マスに40ダメージ。",

        damage: 40,

        range: 1,

        requiresTarget: true

    },


    {
        id: "SHOT",

        name: "ショット",

        type: "ATTACK",

        description:
            "前方3マスに20ダメージ。",

        damage: 20,

        range: 3,

        requiresTarget: true

    },


    {
        id: "SHIELD",

        name: "シールド",

        type: "DEFENSE",

        description:
            "自分の前方をガードし、受けるダメージを50%軽減。",

        damageReduction: 0.5

    },


    {
        id: "DASH",

        name: "ダッシュ",

        type: "MOVE",

        description:
            "前方に2マス移動。攻撃後でも使用可能。",

        movement: 2,

        canUseAfterAttack: true

    },


    {
        id: "RECOVER",

        name: "リカバー",

        type: "RECOVERY",

        description:
            "HPを30回復。",

        recovery: 30

    }

];


export function createCommonChips() {

    return COMMON_CHIP_DATA.map(

        data =>
            new Chip(data)

    );

}