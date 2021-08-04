import React, {useState, useEffect} from "react";
import * as deepcopy from "deepcopy";
import './App.css';
import board from './Logic/board';
import Board from "./Board/Board";

function App() {
  const [boardView, setBoardView] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    board.get().then(board => {
      setBoardView(deepcopy(board));
    })
  }, []);

  const shift = (direction) => {
    board.shift(direction).then(newBoard => {
      console.log("got new board", newBoard);
      setBoardView(deepcopy(newBoard));
    }).catch(event => {
      setGameOver(true);
    });
  }

  console.log("re render")
  return (
    <div className="App">
      <h1>2048</h1>
      <div>
      <button onClick={() => shift("left")}>SHIFT LEFT</button>
      <button onClick={() => shift("right")}>SHIFT RIGHT</button>
      <button onClick={() => shift("down")}>SHIFT DOWN</button>
      <button onClick={() => shift("up")}>SHIFT UP</button>
      </div>  

      <Board data={boardView} />
    </div>
  );
}

export default App;
