// defines a single board you can import from anywhere in the app (initialized upon start)
import {BOARD_SIZE, EMPTY_CELL, INITIAL_CELL} from './consts';

class Board {
    board = [];

    GENERATORS = {
        "up": this.upGenerator.bind(this),
        "right": this.rightGenerator.bind(this),
        "down": this.downGenerator.bind(this),
        "left": this.leftGenerator.bind(this)
    }

    constructor(initialBoard) {
        this.board = initialBoard;
    }

    get() {
        return this.board;
    }

    * upGenerator() {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                for (let k = i; k > 0; k--) {
                    yield ({
                        current: { i: k, j },
                        target: { i: k - 1, j }
                    });
                }
            }
        }
    }

    * rightGenerator() {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = BOARD_SIZE - 1; j >= 0; j--) {
                for (let k = j; k < BOARD_SIZE - 1; k++) {
                    yield ({
                        current: { i, j: k },
                        target: { i, j: k + 1 }
                    });
                }
            }
        }
    }

    * downGenerator() {
        for (let i = BOARD_SIZE - 1; i >= 0; i--) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                for (let k = i; k < BOARD_SIZE - 1; k++) {
                    yield ({
                        current: { i: k, j },
                        target: { i: k + 1, j }
                    });
                }
            }
        }
    }

    // yields the next non-empty cell indices when scanning the board top to bottom, left to right 
    * leftGenerator() {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                for (let k = j; k > 0; k--) {
                    yield ({
                        current: { i, j: k },
                        target: { i, j: k - 1 }
                    });
                }
            }
        }
    }

    shift(direction) {
        const generator = this.GENERATORS[direction];
        for (let pair of generator()) {
            const { current, target } = pair;
            if (this.board[current.i][current.j] !== EMPTY_CELL && target) {
                if (this.board[target.i][target.j] === EMPTY_CELL) {
                    this.board[target.i][target.j] = this.board[current.i][current.j];
                    this.board[current.i][current.j] = EMPTY_CELL;
                } else if (this.board[target.i][target.j] === this.board[current.i][current.j]) {
                    this.board[target.i][target.j] += this.board[current.i][current.j];
                    this.board[current.i][current.j] = EMPTY_CELL;
                }
            }
        }
    }
}

function generateRandomIndex(max) {
    return Math.floor(Math.random(max) * max);
}

function generateRandomCell(boardSize) {
    return {
        row: generateRandomIndex(boardSize),
        col: generateRandomIndex(boardSize)
    }
}

// initial board is always empty except for two initial cells, randomly chosen
// TODO: handle edge case of same indices
function generateInitialBoard() {
    const initialBoard = new Array(BOARD_SIZE).fill(EMPTY_CELL).map(() => new Array(BOARD_SIZE).fill(EMPTY_CELL));
    const randomCell1 = generateRandomCell(BOARD_SIZE);
    const randomCell2 = generateRandomCell(BOARD_SIZE);

    initialBoard[randomCell1.row][randomCell1.col] = INITIAL_CELL;
    initialBoard[randomCell2.row][randomCell2.col] = INITIAL_CELL;
    return initialBoard;
}

// const board = new Board(generateInitialBoard());
const board = new Board([
    [null, null, null, null],
    [null, null, 2, null],
    [null, null, 2, 2],
    [4, null, 2, null]
])
export default board;