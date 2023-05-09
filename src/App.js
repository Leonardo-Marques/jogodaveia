import { knn } from './knn'
import React, { useState } from 'react';
import './App.css';

function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [IA, setIA] = useState('playing');



  const handleClick = (i) => {
    var newSquares = [...squares];
    if (calculateWinner(squares) || newSquares[i]) {
      return;
    }
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);

    readGameState();
  };

  const renderSquare = (i) => {
    return (
      <button className="square" onClick={() => handleClick(i)}>
        {squares[i]}
      </button>
    );
  };

  const winner = calculateWinner(squares);
  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${xIsNext ? 'X' : 'O'}`;
//<div className="status">{status}</div>
  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <div className="knn">
        {IA}
        </div>
    </div>
  );
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function readGameState() {
    await sleep(250);
    const gameState = [];
    const tableCells = document.querySelectorAll('.square');
    
    for (let i = 0; i < tableCells.length; i++) {
      if (tableCells[i].innerHTML == "X") {
        gameState.push(1);
      } else if (tableCells[i].innerHTML == "O") {
        gameState.push(-1);
      } else {
        gameState.push(0);
      }
    }
  
    const newIA = knn(5,gameState); // Calcula o novo valor de IA
    setIA(newIA); // Atualiza o estado de IA com o novo valor
    console.log("Resultado: "+newIA + "Array: "+gameState);
    return newIA
  }
}

function calculateWinner(squares) {
  const lines = [    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


export default App;
