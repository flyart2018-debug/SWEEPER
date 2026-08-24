export class Character {

    constructor(data) {

        this.id = data.id;
        this.name = data.name;
        this.shortName = data.shortName;

        this.type = data.type;

        this.maxHp = data.maxHp;
        this.hp = data.maxHp;

        this.color = data.color;

        this.weapon = data.weapon;

        this.attackDamage =
            data.attackDamage;

        this.attackRange =
            data.attackRange;

        this.ability =
            data.ability;

        this.uniqueChip =
            data.uniqueChip;

        this.isGuarding = false;

        this.canStepAfterAttack = false;

        this.nextAttackBonus = 0;

        this.waitingTurns = 0;

    }


    reset() {

        this.hp =
            this.maxHp;

        this.isGuarding =
            false;

        this.canStepAfterAttack =
            false;

        this.nextAttackBonus =
            0;

        this.waitingTurns =
            0;

    }


    isAlive() {

        return this.hp > 0;

    }


    getHpRatio() {

        return (
            this.hp /
            this.maxHp
        );

    }


    getAttackDamage() {

        const damage =
            this.attackDamage +
            this.nextAttackBonus;


        this.nextAttackBonus =
            0;


        return damage;

    }


    addAttackBonus(
        amount
    ) {

        this.nextAttackBonus +=
            amount;

    }


    heal(amount) {

        const previousHp =
            this.hp;


        this.hp =
            Math.min(

                this.maxHp,

                this.hp + amount

            );


        return (
            this.hp -
            previousHp
        );

    }


    takeDamage(amount) {

        let damage =
            amount;


        if (
            this.isGuarding
        ) {

            damage =
                Math.floor(
                    damage * 0.5
                );

        }


        this.hp =
            Math.max(

                0,

                this.hp -
                damage

            );


        return damage;

    }


    startGuard() {

        this.isGuarding =
            true;

    }


    clearGuard() {

        this.isGuarding =
            false;

    }


    canUseAbility() {

        return true;

    }

}