export class CooldownSystem {

    constructor() {

        this.cooldowns = {};

    }


    set(id, duration) {

        this.cooldowns[id] = {
            duration,
            startedAt: performance.now()
        };

    }


    isReady(id) {

        if (!this.cooldowns[id]) {

            return true;

        }


        return (
            this.getRemaining(id) <= 0
        );

    }


    getRemaining(id) {

        const cooldown =
            this.cooldowns[id];


        if (!cooldown) {

            return 0;

        }


        const elapsed =
            performance.now() -
            cooldown.startedAt;


        return Math.max(
            0,
            cooldown.duration -
            elapsed
        );

    }


    getRemainingRatio(id) {

        const cooldown =
            this.cooldowns[id];


        if (!cooldown) {

            return 0;

        }


        if (
            cooldown.duration <= 0
        ) {

            return 0;

        }


        return Math.min(
            1,
            this.getRemaining(id) /
            cooldown.duration
        );

    }


    clear(id) {

        delete this.cooldowns[id];

    }


    clearAll() {

        this.cooldowns = {};

    }

}