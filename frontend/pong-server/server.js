// server.js
import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';

const PORT = 3002;

// Structure mémoire des parties
const games = {};

// Fonction utilitaire pour initialiser gameState
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

// Envoie un objet JSON à tous les WebSocket connectés dans la partie
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

// Envoie un message à tous SAUF à l'expéditeur
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

const wss = new WebSocketServer({
   port: 3002,
   host: '0.0.0.0'        // bind sur toutes les interfaces
 });

wss.on('connection', (ws) => {
  ws.gameId = null;
  ws.playerId = null;

  ws.on('message', (raw) => {
    let data;
    try {
      data = JSON.parse(raw.toString());
    } catch (err) {
      console.error('Invalid JSON reçu :', raw.toString());
      return;
    }

    const { type, payload } = data;
    console.log('Server received:', type, payload);

    switch (type) {
      case 'create-game': {
        const { maxPlayers } = payload;
        const gameId = randomUUID();
        const initialState = createInitialGameState(maxPlayers);

        games[gameId] = {
          players: [{ id: 'player1', ws }],
          maxPlayers,
          gameState: initialState,
          readyPlayers: []
        };

        ws.playerId = 'player1';
        ws.gameId = gameId;

        ws.send(
          JSON.stringify({
            type: 'game-created',
            payload: {
              gameId,
              assignedPlayerId: 'player1'
            }
          })
        );

        broadcastToGame(gameId, {
          type: 'player-joined',
          payload: {
            players: games[gameId].players.map((p) => p.id),
            playersCount: games[gameId].players.length,
            maxPlayers: games[gameId].maxPlayers,
            gameState: games[gameId].gameState
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

        const taken = room.players.map((p) => p.id);
        let assigned = null;
        for (let i = 1; i <= room.maxPlayers; i++) {
          const testId = `player${i}`;
          if (!taken.includes(testId)) {
            assigned = testId;
            break;
          }
        }
        if (!assigned) {
          ws.send(JSON.stringify({ type: 'error', payload: { message: "Impossible d'assigner un ID" } }));
          return;
        }

        room.players.push({ id: assigned, ws });
        ws.playerId = assigned;
        ws.gameId = joinId;

        ws.send(
          JSON.stringify({
            type: 'join-success',
            payload: {
              assignedPlayerId: assigned,
              players: room.players.map((p) => p.id),
              playersCount: room.players.length,
              maxPlayers: room.maxPlayers,
              gameState: room.gameState
            }
          })
        );

        broadcastToGame(joinId, {
          type: 'player-joined',
          payload: {
            players: room.players.map((p) => p.id),
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
        ws.send(
          JSON.stringify({
            type: 'player-joined',
            payload: {
              players: room.players.map((p) => p.id),
              playersCount: room.players.length,
              maxPlayers: room.maxPlayers,
              gameState: room.gameState
            }
          })
        );
        break;
      }

      case 'player-ready': {
        const { gameId: prId, playerId: pid } = payload;
        const room = games[prId];
        if (!room) return;

        if (!room.readyPlayers.includes(pid)) {
          room.readyPlayers.push(pid);
        }

        console.log(`Room ${prId} → joueurs prêts : `, room.readyPlayers);

        if (room.readyPlayers.length === room.maxPlayers) {
          room.gameState.gameStarted = true;
          broadcastToGame(prId, {
            type: 'all-ready',
            payload: {
              gameState: room.gameState
            }
          });
        }
        break;
      }

      case 'player-move': {
        const { gameId: gmId, playerId: movePid, moveData } = payload;
        const room = games[gmId];
        if (!room || !room.gameState.gameStarted) return;

        // IMPORTANT: Mettre à jour l'état du serveur
        room.gameState.paddles[movePid] = moveData.paddlePosition;

        // Envoyer SEULEMENT aux autres joueurs (pas à celui qui a envoyé le mouvement)
        broadcastToOthers(gmId, ws, {
          type: 'opponent-move',
          payload: {
            playerId: movePid,
            moveData
          }
        });
        break;
      }

      case 'game-update': {
        const { gameId: upId, gameState: newState } = payload;
        const room = games[upId];
        if (!room) return;

        // Fusionner les états plutôt que de remplacer complètement
        // Cela évite d'écraser les positions des paddles mises à jour par player-move
        room.gameState = {
          ...room.gameState,
          ...newState,
          // Garder les positions des paddles si elles ne sont pas dans la mise à jour
          paddles: {
            ...room.gameState.paddles,
            ...(newState.paddles || {})
          }
        };

        // Envoyer SEULEMENT aux autres joueurs (pas à l'host qui a envoyé la mise à jour)
        broadcastToOthers(upId, ws, {
          type: 'game-update',
          payload: {
            gameState: room.gameState
          }
        });
        break;
      }

      default:
        console.warn('Type non géré par serveur :', type);
        break;
    }
  });

  ws.on('close', () => {
    const gId = ws.gameId;
    const pId = ws.playerId;
    if (!gId || !games[gId]) return;

    const room = games[gId];
    room.players = room.players.filter((p) => p.id !== pId);
    room.readyPlayers = room.readyPlayers.filter((r) => r !== pId);

    if (room.players.length === 0) {
      delete games[gId];
      return;
    }

    broadcastToGame(gId, {
      type: 'player-joined',
      payload: {
        players: room.players.map((p) => p.id),
        playersCount: room.players.length,
        maxPlayers: room.maxPlayers,
        gameState: room.gameState
      }
    });
  });
});