export class GridManager {

    constructor(rows = 5, cols = 5) {

        this.rows = rows;

        this.cols = cols;

    }


    isInside(row, col) {

        return (
            row >= 0 &&
            row < this.rows &&
            col >= 0 &&
            col < this.cols
        );

    }


    getDistance(a, b) {

        return (
            Math.abs(a.row - b.row) +
            Math.abs(a.col - b.col)
        );

    }


    isAdjacent(a, b) {

        return (
            this.getDistance(a, b) === 1
        );

    }


    isSamePosition(a, b) {

        return (
            a.row === b.row &&
            a.col === b.col
        );

    }


    getAdjacentPositions(position) {

        const directions = [

            {
                row: -1,
                col: 0
            },

            {
                row: 1,
                col: 0
            },

            {
                row: 0,
                col: -1
            },

            {
                row: 0,
                col: 1
            }

        ];


        return directions

            .map(direction => ({

                row:
                    position.row +
                    direction.row,

                col:
                    position.col +
                    direction.col

            }))

            .filter(position =>

                this.isInside(
                    position.row,
                    position.col
                )

            );

    }


    getPositionAfterMove(
        position,
        direction,
        distance = 1
    ) {

        const result = {

            row: position.row,

            col: position.col

        };


        if (
            direction === "UP"
        ) {

            result.row -= distance;

        }


        if (
            direction === "DOWN"
        ) {

            result.row += distance;

        }


        if (
            direction === "LEFT"
        ) {

            result.col -= distance;

        }


        if (
            direction === "RIGHT"
        ) {

            result.col += distance;

        }


        if (
            !this.isInside(
                result.row,
                result.col
            )
        ) {

            return null;

        }


        return result;

    }


    getDirection(from, to) {

        const rowDifference =
            to.row - from.row;

        const colDifference =
            to.col - from.col;


        if (
            Math.abs(rowDifference) >
            Math.abs(colDifference)
        ) {

            if (
                rowDifference < 0
            ) {

                return "UP";

            }

            return "DOWN";

        }


        if (
            colDifference < 0
        ) {

            return "LEFT";

        }

        return "RIGHT";

    }

}