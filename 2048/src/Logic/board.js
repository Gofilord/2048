// defines a single board you can import from anywhere in the app (initialized upon start)
import {BOARD_SIZE, EMPTY_CELL, INITIAL_CELL} from './consts';

class Board {
    board = [];

    constructor(initialBoard) {
        this.board = initialBoard;
    }

    get() {
        return this.board;
    }

    // main logic of shifting to left
    shiftLeft() {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = BOARD_SIZE - 1; j > 0; j--) { 
                const currentCell = this.board[i][j];

                if (currentCell === EMPTY_CELL) {
                    continue;
                }

                if (this.board[i][j - 1] === EMPTY_CELL) {
                    this.board[i][j - 1] = currentCell;
                    this.board[i][j] = EMPTY_CELL;
                } else if (this.board[i][j - 1] === currentCell) {
                    this.board[i][j - 1] += currentCell;
                    this.board[i][j] = EMPTY_CELL;
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