import React, {useState, useEffect} from "react";
import * as deepcopy from "deepcopy";
import useKepress from "react-use-keypress";
import './App.css';
import board from './Logic/board';
import Board from "./Board/Board";
import { GAME_WON, NO_MOVES } from "./Logic/consts";

function App() {
    const [boardView, setBoardView] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    useEffect(() => {
        board.get().then(board => {
            setBoardView(deepcopy(board));
        });
    }, []);

    const shift = (direction) => {
        board.shift(direction).then(newBoard => {
            setBoardView(deepcopy(newBoard));
        }).catch(event => {
            if (event.message === GAME_WON) {
                setGameWon(true);
            } else if (event.message === NO_MOVES) {
                setGameOver(true);
            }
        });
    };

    useKepress(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"], (event) => {
        const mapping = {
            "ArrowLeft": () => shift("left"),
            "ArrowRight": () => shift("right"),
            "ArrowUp": () => shift("up"),
            "ArrowDown": () => shift("down")
        };

        mapping[event.key]();
    });

    return (
        <div className="App" onKeyPress={e => console.log(e.key)}>
            <h1>2048</h1>

            <Board data={boardView} />
        </div>
    );
}

export default App;
