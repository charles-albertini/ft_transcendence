import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';

const PORT = 3002;
const games = {};

/** État initial d’une partie */
function createInitialGameState(maxPlayers) {
  return {
    ballX: 400, ballY: 250, ballSize: 10,
    ballSpeedX: 5, ballSpeedY: 3,
    paddles: { player1:200, player2:200, player3:200, player4:200 },
    score:   { player1:0, player2:0, player3:0, player4:0 },
    gameMode: maxPlayers,
    host: 'player1',
    gameStarted: false
  };
}

/** Broadcast à tous dans la partie */
function broadcastToGame(gameId, msgObj) {
  const room = games[gameId];
  if (!room) return;
  const msg = JSON.stringify(msgObj);
  room.players.forEach(p => {
    if (p.ws.readyState === p.ws.OPEN) p.ws.send(msg);
  });
}

/** Broadcast à tous sauf l’émetteur */
function broadcastToOthers(gameId, senderWs, msgObj) {
  const room = games[gameId];
  if (!room) return;
  const msg = JSON.stringify(msgObj);
  room.players.forEach(p => {
    if (p.ws !== senderWs && p.ws.readyState === p.ws.OPEN) {
      p.ws.send(msg);
    }
  });
}

const wss = new WebSocketServer({ port: PORT, host: '0.0.0.0' });

wss.on('connection', ws => {
  ws.gameId = null;
  ws.playerId = null;

  ws.on('message', raw => {
    let data;
    try { data = JSON.parse(raw); } catch { return; }
    const { type, payload } = data;

    switch (type) {
      case 'create-game': {
        const maxPlayers = Number(payload.maxPlayers);
        const gameId = randomUUID();
        const initialState = createInitialGameState(maxPlayers);

        games[gameId] = {
          players: [{ id: 'player1', ws }],
          maxPlayers,
          gameState: initialState,
          readyPlayers: []
        };
        ws.playerId = 'player1';
        ws.gameId   = gameId;

        // Ack création
        ws.send(JSON.stringify({
          type: 'game-created',
          payload: { gameId, assignedPlayerId: 'player1' }
        }));
        // Premier broadcast de la liste
        broadcastToGame(gameId, {
          type: 'player-joined',
          payload: {
            players:      ['player1'],
            playersCount: 1,
            maxPlayers,
            gameState:    initialState
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
        if (room.players.length >= room.maxPlayers) {
          ws.send(JSON.stringify({ type: 'game-full' }));
          return;
        }
        // Assigne next free player
        const taken = room.players.map(p=>p.id);
        let assigned;
        for (let i=1; i<=room.maxPlayers; i++) {
          const pid = `player${i}`;
          if (!taken.includes(pid)) { assigned = pid; break; }
        }
        room.players.push({ id: assigned, ws });
        ws.playerId = assigned;
        ws.gameId   = joinId;

        // Ack join
        ws.send(JSON.stringify({
          type: 'join-success',
          payload: {
            assignedPlayerId: assigned,
            players:          room.players.map(p=>p.id),
            playersCount:     room.players.length,
            maxPlayers:       room.maxPlayers,
            gameState:        room.gameState
          }
        }));
        // Broadcast mise à jour de la liste
        broadcastToGame(joinId, {
          type: 'player-joined',
          payload: {
            players:      room.players.map(p=>p.id),
            playersCount: room.players.length,
            maxPlayers:   room.maxPlayers,
            gameState:    room.gameState
          }
        });
        break;
      }

      case 'get-players': {
        const { gameId: gpId } = payload;
        const room = games[gpId];
        if (!room) return;
        // Late-joiners récupèrent la liste + état
        ws.send(JSON.stringify({
          type: 'player-joined',
          payload: {
            players:      room.players.map(p=>p.id),
            playersCount: room.players.length,
            maxPlayers:   room.maxPlayers,
            gameState:    room.gameState
          }
        }));
        break;
      }

      case 'player-ready': {
        const { gameId: prId, playerId: pid } = payload;
        const room = games[prId];
        if (!room) return;
        if (!room.readyPlayers.includes(pid)) {
          room.readyPlayers.push(pid);
        }
        // Broadcast ✓
        broadcastToGame(prId, {
          type: 'players-ready',
          payload: { readyPlayers: room.readyPlayers }
        });
        // Si tous prêts → démarrage
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
        const { gameId: pmId, playerId: pid, moveData } = payload;
        const room = games[pmId];
        if (!room || !room.gameState.gameStarted) return;
        // Met à jour la position du paddle sur le serveur (optionnel)
        room.gameState.paddles[pid] = moveData.paddlePosition;
        // Informe l’autre joueur
        broadcastToOthers(pmId, ws, {
          type: 'opponent-move',
          payload: { playerId: pid, moveData }
        });
        break;
      }

      // … vous pouvez ajouter ici 'game-update' si besoin (sync serveur) …

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
          players:      room.players.map(p=>p.id),
          playersCount: room.players.length,
          maxPlayers:   room.maxPlayers,
          gameState:    room.gameState
        }
      });
    }
  });
});
