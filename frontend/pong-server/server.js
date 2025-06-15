// server.js
import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';

const PORT = 3002;

// In-memory store of all games
const games = {};

// Utility: initial state for a new game
function createInitialGameState(maxPlayers) {
  return {
    ballX: 400,
    ballY: 250,
    ballSize: 10,
    ballSpeedX: 5,
    ballSpeedY: 3,
    paddles: {
      player1: 200,
      player2: 200,
      player3: 200,
      player4: 200
    },
    score: {
      player1: 0,
      player2: 0,
      player3: 0,
      player4: 0
    },
    gameMode: maxPlayers,
    host: 'player1',
    gameStarted: false
  };
}

// Send a JSON message to all sockets in a game
function broadcastToGame(gameId, messageObj) {
  const room = games[gameId];
  if (!room) return;
  const msg = JSON.stringify(messageObj);
  room.players.forEach(({ ws }) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(msg);
    }
  });
}

// Send to everyone except the sender
function broadcastToOthers(gameId, senderWs, messageObj) {
  const room = games[gameId];
  if (!room) return;
  const msg = JSON.stringify(messageObj);
  room.players.forEach(({ ws }) => {
    if (ws.readyState === ws.OPEN && ws !== senderWs) {
      ws.send(msg);
    }
  });
}

// Start WebSocket server
const wss = new WebSocketServer({
  port: PORT,
  host: '0.0.0.0'
});

wss.on('connection', (ws) => {
  ws.gameId = null;
  ws.playerId = null;

  ws.on('message', (raw) => {
    let data;
    try {
      data = JSON.parse(raw.toString());
    } catch {
      return;
    }
    const { type, payload } = data;

    switch (type) {
      case 'create-game': {
        const maxPlayers = Number(payload.maxPlayers);
        const gameId = randomUUID();
        const initialState = createInitialGameState(maxPlayers);

        // Create room
        games[gameId] = {
          players: [{ id: 'player1', ws }],
          maxPlayers,
          gameState: initialState,
          readyPlayers: []         // starts empty
        };

        ws.playerId = 'player1';
        ws.gameId   = gameId;

        // Reply with game ID
        ws.send(JSON.stringify({
          type: 'game-created',
          payload: { gameId, assignedPlayerId: 'player1' }
        }));

        // Notify any watchers (though only one player so far)
        broadcastToGame(gameId, {
          type: 'player-joined',
          payload: {
            players: games[gameId].players.map(p => p.id),
            playersCount: 1,
            maxPlayers,
            gameState: initialState
          }
        });
        break;
      }

      case 'join-game': {
        const { gameId: joinId } = payload;
        const room = games[joinId];
        if (!room) {
          ws.send(JSON.stringify({ type: 'game-not-found' }));
          return;
        }
        if (room.readyPlayers.length === Number(room.maxPlayers)) {
          ws.send(JSON.stringify({ type: 'game-full' }));
          return;
        }

        // Assign next available player ID
        const taken = room.players.map(p => p.id);
        let assigned = null;
        for (let i = 1; i <= room.maxPlayers; i++) {
          const pid = `player${i}`;
          if (!taken.includes(pid)) {
            assigned = pid;
            break;
          }
        }
        if (!assigned) {
          ws.send(JSON.stringify({ type: 'error', payload: { message: "Impossible d’assigner un ID" } }));
          return;
        }

        room.players.push({ id: assigned, ws });
        ws.playerId = assigned;
        ws.gameId   = joinId;

        // Confirm join
        ws.send(JSON.stringify({
          type: 'join-success',
          payload: {
            assignedPlayerId: assigned,
            players: room.players.map(p => p.id),
            playersCount: room.players.length,
            maxPlayers: room.maxPlayers,
            gameState: room.gameState
          }
        }));

        // Notify everyone
        broadcastToGame(joinId, {
          type: 'player-joined',
          payload: {
            players: room.players.map(p => p.id),
            playersCount: room.players.length,
            maxPlayers: room.maxPlayers,
            gameState: room.gameState
          }
        });
        break;
      }

      case 'get-players': {
        const { gameId: gpId } = payload;
        const room = games[gpId];
        if (!room) return;
        ws.send(JSON.stringify({
          type: 'player-joined',
          payload: {
            players: room.players.map(p => p.id),
            playersCount: room.players.length,
            maxPlayers: room.maxPlayers,
            gameState: room.gameState
          }
        }));
        break;
      }

      case 'player-ready': {
        const { gameId: prId, playerId: pid } = payload;
        const room = games[prId];
        if (!room) return;

        // Mark this player as ready
        if (!room.readyPlayers.includes(pid)) {
          room.readyPlayers.push(pid);
        }

        console.log(`Room ${prId} readyPlayers:`, room.readyPlayers);

        // 1) Broadcast the updated list of ready players
        broadcastToGame(prId, {
          type: 'players-ready',
          payload: { readyPlayers: room.readyPlayers }
        });

        // 2) If everyone is ready, start the game
        if (room.readyPlayers.length === room.maxPlayers) {
          room.gameState.gameStarted = true;
          broadcastToGame(prId, {
            type: 'all-ready',
            payload: { gameState: room.gameState }
          });
        }
        break;
      }

      case 'player-move': {
        const { gameId: gmId, playerId: movePid, moveData } = payload;
        const room = games[gmId];
        if (!room || !room.gameState.gameStarted) return;

        // Update server state
        room.gameState.paddles[movePid] = moveData.paddlePosition;

        // Inform the other players
        broadcastToOthers(gmId, ws, {
          type: 'opponent-move',
          payload: { playerId: movePid, moveData }
        });
        break;
      }

      case 'game-update': {
        const { gameId: upId, gameState: newState } = payload;
        const room = games[upId];
        if (!room) return;

        // Merge states so we don't overwrite other paddles
        room.gameState = {
          ...room.gameState,
          ...newState,
          paddles: {
            ...room.gameState.paddles,
            ...(newState.paddles || {})
          }
        };

        broadcastToOthers(upId, ws, {
          type: 'game-update',
          payload: { gameState: room.gameState }
        });
        break;
      }

      default:
        console.warn('Unhandled type:', type);
    }
  });

  ws.on('close', () => {
    const gId = ws.gameId, pId = ws.playerId;
    if (!gId || !games[gId]) return;
    const room = games[gId];
    room.players = room.players.filter(p => p.id !== pId);
    room.readyPlayers = room.readyPlayers.filter(r => r !== pId);

    if (room.players.length === 0) {
      delete games[gId];
    } else {
      broadcastToGame(gId, {
        type: 'player-joined',
        payload: {
          players: room.players.map(p => p.id),
          playersCount: room.players.length,
          maxPlayers: room.maxPlayers,
          gameState: room.gameState
        }
      });
    }
  });
});
