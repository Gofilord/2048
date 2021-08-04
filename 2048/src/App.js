import './App.css';
import board from './Logic/board';

function App() {

  console.log(board.get());
  console.log(board.hasAvailableMoves());

  const shiftLeft = () => {
    board.shift("left");
    console.log(board.get());
  }

  const shiftRight = () => {
    board.shift("right");
    console.log(board.get());
  }

  const shiftDown = () => {
    board.shift("down");
    console.log(board.get());
  }

  const shiftUp = () => {
    board.shift("up");
    console.log(board.get());
  }

  return (
    <div className="App">
      <h1>2048</h1>
      <button onClick={shiftLeft}>SHIFT LEFT</button>
      <button onClick={shiftRight}>SHIFT RIGHT</button>
      <button onClick={shiftDown}>SHIFT DOWN</button>
      <button onClick={shiftUp}>SHIFT UP</button>
    </div>
  );
}

export default App;
