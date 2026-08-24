export class InputManager {

    constructor() {

        this.keys = new Set();

        this.directionCallbacks = [];
        this.attackCallbacks = [];
        this.chipCallbacks = [];

        this.bindKeyboard();
    }


    bindKeyboard() {

        window.addEventListener(
            "keydown",
            event => {

                const key =
                    event.key.toLowerCase();

                this.keys.add(key);


                if (
                    key === "arrowup" ||
                    key === "w"
                ) {

                    this.emitDirection("UP");

                }


                if (
                    key === "arrowdown" ||
                    key === "s"
                ) {

                    this.emitDirection("DOWN");

                }


                if (
                    key === "arrowleft" ||
                    key === "a"
                ) {

                    this.emitDirection("LEFT");

                }


                if (
                    key === "arrowright" ||
                    key === "d"
                ) {

                    this.emitDirection("RIGHT");

                }


                if (
                    key === " "
                ) {

                    event.preventDefault();

                    this.emitAttack();

                }

            }
        );


        window.addEventListener(
            "keyup",
            event => {

                this.keys.delete(
                    event.key.toLowerCase()
                );

            }
        );

    }


    onDirection(callback) {

        this.directionCallbacks.push(
            callback
        );

    }


    onAttack(callback) {

        this.attackCallbacks.push(
            callback
        );

    }


    onChip(callback) {

        this.chipCallbacks.push(
            callback
        );

    }


    emitDirection(direction) {

        this.directionCallbacks.forEach(
            callback => {

                callback(direction);

            }
        );

    }


    emitAttack() {

        this.attackCallbacks.forEach(
            callback => {

                callback();

            }
        );

    }


    emitChip(chipId) {

        this.chipCallbacks.forEach(
            callback => {

                callback(chipId);

            }
        );

    }

}