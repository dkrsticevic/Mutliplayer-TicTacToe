import { useEffect, useState, useRef } from "react";
import Cell from "./Cell";
import "./Game.css";

const WINS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6],
]

const Game = ( {socket, roomCode, gameReady }) => {  
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [canPlay, setCanPlay] = useState(true);
  const [turn, setTurn] = useState(0); //counting each turn (can be used for both draws and whos turn)
  const [victoryText, setVictoryText] = useState("");

  useEffect(() => { //checks on update of board if new winner found
    if (turn === 9){
      setVictoryText('Draw');
      return;
    }
    else if (checkWin()){
      setVictoryText(whichTurn(turn + 1) +"'s Win");
      return;
    }
    console.log(board);
  }, [board]);

  useEffect(() => { //if room code changes restart game(for client)
      console.log("handle restart on room change name")
      if (roomCode!== ""){
      handleRestart();
      }
  }, [roomCode, gameReady]);

  useEffect(() => {
    socket.on("updateGame", (id) => {
      setBoard((data) => ({ ...data, [id]: whichTurn(turn) }));
      setCanPlay(true);   
      setTurn(turn + 1);
    });
    return () => socket.off("updateGame");
  });

  useEffect(() => {
      socket.on("restart", () => {
        setBoard(["", "", "", "", "", "", "", "", ""]);
        setCanPlay(true);
        setTurn(0);
        setVictoryText("");
      });
      return () => socket.off("restart");
  });

  function whichTurn(count){
    if (count % 2 === 0){
      return "X"
    } else{
      return "O"
    }
  }

  function checkWin() {
      for (let i = 0; i< WINS.length; i++){
        const [a,b,c] = WINS[i];

        if (board[a] === board[b] && board[b] === board[c] && board[a] !== ""){
          return true;
        }
      }
      return false;
  }


  const handleCellClick = (e) => {
    const id = e.currentTarget.id;
    if (canPlay && board[id] === "" && victoryText === ""  && roomCode!== "" && gameReady){//&& hasOpp) {//added roomcode check but didnt confimr if still works.
      console.log(id);
      setBoard((data) => ({ ...data, [id]: whichTurn(turn) }));
      setTurn(turn + 1);
      setCanPlay(false);
      
      socket.emit("play", { id, roomCode });

    }
  };

  const handleRestart = () => { 
      console.log("this should be reached by both every room change");
      setBoard(["", "", "", "", "", "", "", "", ""]);
      setCanPlay(true);
      setVictoryText("");
      setTurn(0);
      if (roomCode !== ""){
        socket.emit("restart", { roomCode });
      }
  }



  return (
    <game>
        {gameReady ?(
              <text className="whoTurn"> {whichTurn(turn)}'s turn </text>
              ) :( <text className="whoTurn"> Join A Game! </text>)
        }
      <div className="main-section">
        <Cell handleCellClick={handleCellClick} id={"0"} text={board[0]} />
        <Cell handleCellClick={handleCellClick} id={"1"} text={board[1]} />
        <Cell handleCellClick={handleCellClick} id={"2"} text={board[2]} />

        <Cell handleCellClick={handleCellClick} id={"3"} text={board[3]} />
        <Cell handleCellClick={handleCellClick} id={"4"} text={board[4]} />
        <Cell handleCellClick={handleCellClick} id={"5"} text={board[5]} />

        <Cell handleCellClick={handleCellClick} id={"6"} text={board[6]} />
        <Cell handleCellClick={handleCellClick} id={"7"} text={board[7]} />
        <Cell handleCellClick={handleCellClick} id={"8"} text={board[8]} />
      </div>
      <div className={victoryText !== "" ? "victory-screen" : null} >
        <text className="victory-text">{ victoryText} </text>
        <button hidden={victoryText === ""}onClick={handleRestart }>Restart</button> 
      </div>
    </game>
    
  );
};

export default Game;