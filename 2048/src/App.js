import './App.css';
import board from './Logic/board';

function App() {

  console.log(board.get());

  const shiftLeft = () => {
    board.shiftLeft();
    console.log(board.get());
  }

  return (
    <div className="App">
      <h1>2048</h1>
      <button onClick={shiftLeft}>SHIFT LEFT</button>
    </div>
  );
}

export default App;
