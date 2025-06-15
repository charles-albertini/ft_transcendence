import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';

const PORT = 3002;
const games = {};

function createInitialGameState(maxPlayers) {
  return {
    ballX: 400,
    ballY: 250,
    ballSize: 10,
    ballSpeedX: 5,
    ballSpeedY: 3,
    paddles: { player1:200, player2:200, player3:200, player4:200 },
    score:   { player1:0, player2:0, player3:0, player4:0 },
    gameMode: maxPlayers,
    host: 'player1',
    gameStarted: false
  };
}

function broadcastToGame(gameId, msgObj) {
  const room = games[gameId];
  if (!room) return;
  const msg = JSON.stringify(msgObj);
  room.players.forEach(p => {
    if (p.ws.readyState === p.ws.OPEN) p.ws.send(msg);
  });
}

const wss = new WebSocketServer({ port: PORT, host: '0.0.0.0' });

wss.on('connection', ws => {
  ws.gameId   = null;
  ws.playerId = null;

  ws.on('message', raw => {
    let data;
    try { data = JSON.parse(raw); } catch { return; }
    const { type, payload } = data;

    switch (type) {

      case 'create-game': {
        // On cast maxPlayers en nombre pour éviter l'inégalité string vs number
        const maxPlayers = Number(payload.maxPlayers);
        const gameId = randomUUID();
        const initialState = createInitialGameState(maxPlayers);

        games[gameId] = {
          players: [{ id:'player1', ws }],
          maxPlayers,
          gameState: initialState,
          readyPlayers: []
        };
        ws.playerId = 'player1';
        ws.gameId   = gameId;

        ws.send(JSON.stringify({
          type: 'game-created',
          payload: { gameId, assignedPlayerId:'player1' }
        }));
        broadcastToGame(gameId, {
          type: 'player-joined',
          payload: {
            players: games[gameId].players.map(p=>p.id),
            playersCount:1,
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
          ws.send(JSON.stringify({ type:'game-not-found' }));
          return;
        }
        if (room.players.length >= room.maxPlayers) {
          ws.send(JSON.stringify({ type:'game-full' }));
          return;
        }
        const taken = room.players.map(p=>p.id);
        let assigned;
        for (let i=1; i<=room.maxPlayers; i++) {
          const pid = `player${i}`;
          if (!taken.includes(pid)) { assigned = pid; break; }
        }
        room.players.push({ id:assigned, ws });
        ws.playerId = assigned;
        ws.gameId   = joinId;

        ws.send(JSON.stringify({
          type: 'join-success',
          payload: {
            assignedPlayerId: assigned,
            players: room.players.map(p=>p.id),
            playersCount: room.players.length,
            maxPlayers: room.maxPlayers,
            gameState: room.gameState
          }
        }));
        broadcastToGame(joinId, {
          type: 'player-joined',
          payload: {
            players: room.players.map(p=>p.id),
            playersCount: room.players.length,
            maxPlayers: room.maxPlayers,
            gameState: room.gameState
          }
        });
        break;
      }

      case 'player-ready': {
        const { gameId: prId, playerId: pid } = payload;
        const room = games[prId];
        if (!room) return;
        if (!room.readyPlayers.includes(pid)) {
          room.readyPlayers.push(pid);
        }
        broadcastToGame(prId, {
          type: 'players-ready',
          payload: { readyPlayers: room.readyPlayers }
        });
        // On compare bien number === number
        if (room.readyPlayers.length === room.maxPlayers) {
          room.gameState.gameStarted = true;
          broadcastToGame(prId, {
            type: 'all-ready',
            payload: { gameState: room.gameState }
          });
        }
        break;
      }

      // ... autres cas inchangés ...

    }
  });

  ws.on('close', () => {
    const { gameId, playerId } = ws;
    const room = games[gameId];
    if (!room) return;
    room.players = room.players.filter(p=>p.id!==playerId);
    room.readyPlayers = room.readyPlayers.filter(r=>r!==playerId);
    if (room.players.length === 0) {
      delete games[gameId];
    } else {
      broadcastToGame(gameId, {
        type: 'player-joined',
        payload: {
          players: room.players.map(p=>p.id),
          playersCount: room.players.length,
          maxPlayers: room.maxPlayers,
          gameState: room.gameState
        }
      });
    }
  });
});
