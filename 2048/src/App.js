import React, {useState, useEffect} from "react";
import * as deepcopy from "deepcopy";
import useKepress from "react-use-keypress";
import Modal from "react-modal";
import './App.css';
import board from './Logic/board';
import Board from "./Board/Board";
import { GAME_WON, NO_MOVES } from "./Logic/consts";

function App() {
    const [boardView, setBoardView] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    // initial load
    useEffect(() => {
        board.get().then(board => {
            setBoardView(deepcopy(board));
        });
    }, []);

    // gameplay
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
        if (!gameWon && !gameOver) {
            const mapping = {
                "ArrowLeft": () => shift("left"),
                "ArrowRight": () => shift("right"),
                "ArrowUp": () => shift("up"),
                "ArrowDown": () => shift("down")
            };
    
            mapping[event.key]();
        }
    });

    const newGame = () => {
        board.newGame().then(newBoard => {
            setGameWon(false);
            setGameOver(false);
            setBoardView(deepcopy(newBoard));
        });
    }

    return (
        <div className="App" onKeyPress={e => console.log(e.key)}>
            <div className="game-container">
                <h1 className="title">2048</h1>
                <button className="new-game-btn" onClick={newGame}>New Game</button>
                <Board data={boardView} />
            </div>
            
            <Modal
                isOpen={gameWon || gameOver}
                style={{
                    content: {
                        width: "30%",
                        height: "200px",
                        inset: "none",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)"
                    }
                }}
                contentLabel="important modal">
                <h2>{gameOver ? "Sorry, you lost." : "You won the game!"}</h2>
                <button className="new-game-btn" onClick={newGame}>Try Again</button>
            </Modal>
        </div>
    );
}

export default App;
