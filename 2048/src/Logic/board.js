// defines a single board you can import from anywhere in the app (initialized upon start)
import * as deepcopy from "deepcopy";
import {BOARD_SIZE, EMPTY_CELL, GAME_WON, INITIAL_CELL, NO_MOVES, WINNING_VALUE} from './consts';

class Board {
    board = [];

    GENERATORS = {
        "up": this.upGenerator.bind(this),
        "right": this.rightGenerator.bind(this),
        "down": this.downGenerator.bind(this),
        "left": this.leftGenerator.bind(this)
    }

    constructor(initialBoard) {
        this.board = deepcopy(initialBoard); // deep copy for the sake of immutability
    }

    async get() {
        return this.board;
    }

    async newGame() {
        this.board = deepcopy(generateInitialBoard());
        return this.board;
    }

    // returns true if the board has at least one empty cell
    hasEmptySpace() { 
        return !!this.board.filter(row => row.filter(cell => cell === EMPTY_CELL).length).length
    }

    // if there is empty space or adjacent cells with value
    // we go over all rows from left to right and bottom up, and if player can't move
    // in both directions, then he can't move at all.
    hasAvailableMoves() {
        // if there is empty space, for sure we have available moves
        if (this.hasEmptySpace()) {
            return true;
        }

        const leftGenerator = this.leftGenerator;
        const upGenerator = this.upGenerator;

        const canMove = (generator) => {
            let canMove = false;
            for (let { current, target } of generator()) {
                if (this.board[current.i][current.j] !== EMPTY_CELL && target) {
                    if (this.board[current.i][current.j] === this.board[target.i][target.j]) {
                        canMove = true;
                    }
                }
            }

            return canMove;
        }
        
        let canMoveSideways = canMove(leftGenerator);
        let canMoveUpOrDown = canMove(upGenerator);;

        return canMoveUpOrDown || canMoveSideways;
    }

    // returns new indices of a cell in which there is no value
    generateRandomCellIfEmpty() {
        let randomCell = generateRandomCell(BOARD_SIZE);
        while (this.board[randomCell.row][randomCell.col] !== EMPTY_CELL) {
            randomCell = generateRandomCell(BOARD_SIZE);
        }

        return randomCell;
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

    // main gameplay
    async shift(direction) {
        const generator = this.GENERATORS[direction];
        const combinedCells = [];
        let boardChanged = false; // we only spur a random cell if the board changed

        for (let pair of generator()) {
            const { current, target } = pair;
            if (this.board[current.i][current.j] !== EMPTY_CELL && target) {
                // move cell
                if (this.board[target.i][target.j] === EMPTY_CELL) {
                    this.board[target.i][target.j] = this.board[current.i][current.j];
                    this.board[current.i][current.j] = EMPTY_CELL;
                    boardChanged = true;
                // combine values
                } else if (this.board[target.i][target.j] === this.board[current.i][current.j]) {
                    // avoid combining twice in a single turn
                    if (!combinedCells.includes(String(target.i + target.j))) {
                        this.board[target.i][target.j] += this.board[current.i][current.j];

                        // if new value is winning value, win the game
                        if (this.board[target.i][target.j] === WINNING_VALUE) {
                            throw new MediaError(GAME_WON);
                        }

                        this.board[current.i][current.j] = EMPTY_CELL;
                        combinedCells.push(String(target.i + target.j));
                        boardChanged = true;
                    }
                }
            }
        }

        // check if game over
        if (!this.hasAvailableMoves()) {
            throw new RangeError(NO_MOVES);
        }

        // each shift randomly spurs a new cell with initial value (if there is space for it)
        if (this.hasEmptySpace() && boardChanged) {
            const randomCell = this.generateRandomCellIfEmpty();
            this.board[randomCell.row][randomCell.col] = INITIAL_CELL;
        }

        return this.board;
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
function generateInitialBoard() {
    const initialBoard = new Array(BOARD_SIZE).fill(EMPTY_CELL).map(() => new Array(BOARD_SIZE).fill(EMPTY_CELL));
    let randomCell1 = generateRandomCell(BOARD_SIZE);
    let randomCell2 = generateRandomCell(BOARD_SIZE);

    // in case random returned same cell twice
    // it can happen twice in a row, but very minimal change
    if (randomCell1.row === randomCell2.row && randomCell1.col === randomCell2.col) {
        randomCell1 = generateRandomCell(BOARD_SIZE);
        randomCell2 = generateRandomCell(BOARD_SIZE);
    }

    initialBoard[randomCell1.row][randomCell1.col] = INITIAL_CELL;
    initialBoard[randomCell2.row][randomCell2.col] = INITIAL_CELL;
    return initialBoard;
}

const board = new Board(generateInitialBoard());
// const board = new Board([
//     [null, null, null, null],
//     [null, null, null, null],
//     [null, null, null, null],
//     [2, 2, 2, 2]
// ]);
export default board;