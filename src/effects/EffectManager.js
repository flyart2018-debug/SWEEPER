export class EffectManager {

    constructor() {

        this.effects = [];

    }


    clear() {

        this.effects = [];

    }


    addEffect(
        effect
    ) {

        this.effects.push({

            ...effect,

            createdAt:
                performance.now()

        });

    }


    hitEffect(
        x,
        y,
        damage,
        type = "NORMAL"
    ) {

        this.addEffect({

            type: "HIT",

            x,

            y,

            damage,

            effectType:
                type,

            duration:
                350

        });

    }


    slashEffect(
        x,
        y,
        direction = "UP"
    ) {

        this.addEffect({

            type: "SLASH",

            x,

            y,

            direction,

            duration:
                250

        });

    }


    dashEffect(
        x,
        y,
        color
    ) {

        this.addEffect({

            type: "DASH",

            x,

            y,

            color,

            duration:
                300

        });

    }


    abilityEffect(
        x,
        y,
        color
    ) {

        this.addEffect({

            type: "ABILITY",

            x,

            y,

            color,

            duration:
                500

        });

    }


    update() {

        const now =
            performance.now();


        this.effects =
            this.effects.filter(
                effect => {

                    return (
                        now -
                        effect.createdAt <
                        effect.duration
                    );

                }
            );

    }


    getActiveEffects() {

        this.update();

        return [
            ...this.effects
        ];

    }

}