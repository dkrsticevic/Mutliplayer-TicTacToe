import Game from "./components/Game";
import io from 'socket.io-client';
import { useState} from "react";
import { Spinner } from 'loading-animations-react';

const socket = io.connect("http://localhost:3001");

const App = () => {

  const [room, setRoom] = useState("");
  const [finalRoom, setFinalRoom] = useState("")
  const [error, setError] = useState("")
  const [gameReady, setGameReady] = useState(false);

  function joinRoom(){ 
    if (room !== "" && room !== finalRoom) { 
      if (finalRoom != ""){
        socket.emit("leave", finalRoom );
      }
      socket.emit("join_room", room); 
    }    
  };

  socket.on("full", () => { 
    console.log("testing if this is reached by mulitple clients")
    setError(`Room is full!`);
    setFinalRoom("");
    setGameReady(false);
  });

  socket.on("waiting", (wait) => { 
    console.log("is waiting thing: "+ wait)
    if (wait){
      setError('Waiting for opponent');
      setFinalRoom(room);
      setGameReady(false);
    }
    else{
      console.log("is this reached by both opp")
      setError("");
      setFinalRoom(room);
      setGameReady(true);
    }
  });


  return(
    <>
      <div className="roomName"> 
      <text>TIC TAC TOE</text>
          <div className="roomType">
          <input placeholder='room code...' onChange={(event) => { setRoom(event.target.value); setError("");}}/> 
          <button onClick={joinRoom}> join</button>
          <div className="errorHandle"> 
            <label className="message"> {error}</label>
            {error === 'Waiting for opponent' ? (
            <Spinner className="loading" text="" ></Spinner>
            ) :( <div></div>)
            }
          </div>
        </div>
      </div> 
      
      

      <Game socket={socket} roomCode={finalRoom} gameReady={gameReady} />
    </>
    )
}

export default App;
