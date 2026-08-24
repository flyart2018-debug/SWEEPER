export class Chip {

    constructor(data) {

        this.id = data.id;

        this.name = data.name;

        this.type = data.type;

        this.description =
            data.description || "";

        this.damage =
            data.damage || 0;

        this.range =
            data.range || 0;

        this.movement =
            data.movement || 0;

        this.recovery =
            data.recovery || 0;

        this.damageReduction =
            data.damageReduction || 0;

        this.attackBonus =
            data.attackBonus || 0;

        this.requiresTarget =
            data.requiresTarget ?? false;

        this.canUseAfterAttack =
            data.canUseAfterAttack ?? false;

        this.isUnique =
            data.isUnique ?? false;

    }


    canUse() {

        return true;

    }


    getDescription() {

        return this.description;

    }


    hasDamage() {

        return this.damage > 0;

    }


    hasMovement() {

        return this.movement > 0;

    }


    hasRecovery() {

        return this.recovery > 0;

    }


    hasAttackBonus() {

        return this.attackBonus > 0;

    }


    hasDefenseEffect() {

        return this.damageReduction > 0;

    }

}