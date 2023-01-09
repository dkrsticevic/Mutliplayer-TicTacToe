# Tic Tac Toe Mutliplayer

The following program is a functional multiplayer Tic Tac Toe game made in react. 
To join lobby you simply type the lobby code and wait for your opponent to join the same room as you. From here the game can be started from either player by clicking on the board (whoever plays first move plays as X's). After a round the game can be restarted and played between the same players again.

### Gameplay
![gameplay1](https://user-images.githubusercontent.com/115701131/210200380-983b69e5-1290-4fbe-bd02-171d784a9056.PNG)

### Victory Screen
![victory screen](https://user-images.githubusercontent.com/115701131/210200386-37a8dd39-3d45-4644-9644-fa835fdb115e.PNG)




# Client 
The client side made in React hosts all the logic for the game and will talk to a node js server to transmit the moves played through a socket io connection. It will also receive moves from this connection so the user can see and react to the opponents plays. 

# Server 
The node js server utilises socket io to perform basic calls to enable the front ends multiplayer functionality to work properly. 

