import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';

const PORT = 3003;
const games = {};

/** État initial d'une partie avec terrain adapté au mode */
function createInitialGameState(maxPlayers) {
  // Mode 2 joueurs : terrain rectangulaire comme avant (800x400)
  // Mode 4 joueurs : terrain carré (600x600)
  const canvasWidth = maxPlayers === 4 ? 600 : 800;
  const canvasHeight = maxPlayers === 4 ? 600 : 400;
  
  return {
    ballX: canvasWidth / 2, 
    ballY: canvasHeight / 2, 
    ballSize: 10,
    ballSpeedX: 5, 
    ballSpeedY: 3,
    paddles: { 
      player1: canvasHeight / 2, 
      player2: canvasHeight / 2, 
      player3: canvasWidth / 2, 
      player4: canvasWidth / 2 
    },
    score: { player1: 0, player2: 0, player3: 0, player4: 0 },
    gameMode: maxPlayers,
    host: 'player1',
    gameStarted: false,
    lastPaddleHit: null
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

/** Broadcast à tous sauf l'émetteur */
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

/** Gestion de la déconnexion d'un joueur */
function handlePlayerDisconnection(gameId, playerId) {
  const room = games[gameId];
  if (!room) return;
  
  console.log(`[Server] Joueur ${playerId} déconnecté de ${gameId}`);
  
  // Si le jeu a commencé, renvoyer tout le monde au menu
  if (room.gameState.gameStarted) {
    console.log(`[Server] Partie en cours, renvoi de tous les joueurs au menu`);
    broadcastToGame(gameId, {
      type: 'player-disconnected',
      payload: { disconnectedPlayer: playerId }
    });
    
    // Supprimer la partie après un délai pour laisser le temps aux clients de traiter
    setTimeout(() => {
      if (games[gameId]) {
        console.log(`[Server] Suppression de la partie ${gameId} après déconnexion`);
        delete games[gameId];
      }
    }, 5000);
    
    return;
  }
  
  // Si le jeu n'a pas commencé, juste retirer le joueur
  room.players = room.players.filter(p => p.id !== playerId);
  room.readyPlayers = room.readyPlayers.filter(r => r !== playerId);
  delete room.playerNames[playerId];
  
  // Si plus de joueurs, supprimer la partie
  if (room.players.length === 0) {
    console.log(`[Server] Suppression de la partie vide ${gameId}`);
    delete games[gameId];
    return;
  }
  
  // Réassigner l'host si nécessaire
  if (room.gameState.host === playerId && room.players.length > 0) {
    room.gameState.host = room.players[0].id;
    console.log(`[Server] Nouveau host: ${room.gameState.host}`);
  }
  
  // Notifier les autres joueurs de la mise à jour
  broadcastToGame(gameId, {
    type: 'player-joined',
    payload: {
      players: room.players.map(p => p.id),
      playersCount: room.players.length,
      maxPlayers: room.maxPlayers,
      gameState: room.gameState,
      playerNames: { ...room.playerNames },
      readyPlayers: room.readyPlayers || []
    }
  });
}

const wss = new WebSocketServer({ port: PORT, host: '0.0.0.0' });

wss.on('connection', ws => {
  ws.gameId = null;
  ws.playerId = null;
  ws.username = null;

  ws.on('message', raw => {
    let data;
    try { data = JSON.parse(raw); } catch { return; }
    const { type, payload } = data;

    switch (type) {
      case 'create-game': {
        const maxPlayers = Number(payload.maxPlayers);
        const gameId = randomUUID();
        const initialState = createInitialGameState(maxPlayers);
        const creatorName = payload.username || 'Joueur 1';

        games[gameId] = {
          players: [{ id: 'player1', ws, username: creatorName }],
          maxPlayers,
          gameState: initialState,
          readyPlayers: [],
          playerNames: { player1: creatorName }
        };
        ws.playerId = 'player1';
        ws.gameId = gameId;
        ws.username = creatorName;

        console.log(`[Server] Partie créée: ${gameId} par player1 (${creatorName}) - ${maxPlayers} joueurs max`);
        console.log(`[Server] Noms initiaux:`, games[gameId].playerNames);

        // Ack création
        ws.send(JSON.stringify({
          type: 'game-created',
          payload: { gameId, assignedPlayerId: 'player1' }
        }));
        break;
      }

      case 'join-game': {
        const { gameId: joinId, username } = payload;
        const room = games[joinId];
        if (!room) {
          ws.send(JSON.stringify({ type: 'game-not-found' }));
          return;
        }
        if (room.players.length >= room.maxPlayers) {
          ws.send(JSON.stringify({ type: 'game-full' }));
          return;
        }
        
        // Si le jeu a déjà commencé, refuser la connexion
        if (room.gameState.gameStarted) {
          ws.send(JSON.stringify({ type: 'game-in-progress' }));
          return;
        }
        
        // Assigne next free player
        const taken = room.players.map(p => p.id);
        let assigned;
        for (let i = 1; i <= room.maxPlayers; i++) {
          const pid = `player${i}`;
          if (!taken.includes(pid)) { assigned = pid; break; }
        }
        
        const joinerName = username || `Joueur ${assigned.slice(-1)}`;
        
        // CRITIQUE: Vérifier que le nom n'écrase pas un nom existant
        if (room.playerNames[assigned]) {
          console.log(`[Server] ATTENTION: ${assigned} avait déjà le nom ${room.playerNames[assigned]}, conservation`);
        } else {
          room.playerNames[assigned] = joinerName;
          console.log(`[Server] ${assigned} reçoit le nom: ${joinerName}`);
        }
        
        room.players.push({ id: assigned, ws, username: joinerName });
        
        ws.playerId = assigned;
        ws.gameId = joinId;
        ws.username = joinerName;

        console.log(`[Server] ${assigned} (${joinerName}) rejoint la partie ${joinId}`);
        console.log(`[Server] Noms après join:`, room.playerNames);

        // Ack join - Envoyer une COPIE des noms pour éviter la référence
        ws.send(JSON.stringify({
          type: 'join-success',
          payload: {
            assignedPlayerId: assigned,
            players: room.players.map(p => p.id),
            playersCount: room.players.length,
            maxPlayers: room.maxPlayers,
            gameState: room.gameState,
            playerNames: { ...room.playerNames },
            readyPlayers: room.readyPlayers || []
          }
        }));
        
        // Broadcast mise à jour - Envoyer une COPIE des noms
        broadcastToGame(joinId, {
          type: 'player-joined',
          payload: {
            players: room.players.map(p => p.id),
            playersCount: room.players.length,
            maxPlayers: room.maxPlayers,
            gameState: room.gameState,
            playerNames: { ...room.playerNames },
            readyPlayers: room.readyPlayers || []
          }
        });
        break;
      }

      case 'get-players': {
        const { gameId: gpId } = payload;
        const room = games[gpId];
        if (!room) return;
        
        console.log(`[Server] get-players pour ${gpId}`);
        console.log(`[Server] Noms à envoyer:`, room.playerNames);
        console.log(`[Server] Joueurs prêts:`, room.readyPlayers);
        
        ws.send(JSON.stringify({
          type: 'player-joined',
          payload: {
            players: room.players.map(p => p.id),
            playersCount: room.players.length,
            maxPlayers: room.maxPlayers,
            gameState: room.gameState,
            playerNames: { ...room.playerNames },
            readyPlayers: room.readyPlayers || []
          }
        }));
        break;
      }

      case 'player-ready': {
        const { gameId: prId, playerId: pid } = payload;
        const room = games[prId];
        if (!room) return;
        
        console.log(`[Server] ${pid} (${room.playerNames[pid]}) se déclare prêt`);
        
        // SIMPLE AJOUT (pas de toggle) - si pas déjà prêt, l'ajouter
        if (!room.readyPlayers.includes(pid)) {
          room.readyPlayers.push(pid);
          console.log(`[Server] ${pid} est maintenant prêt`);
        } else {
          console.log(`[Server] ${pid} était déjà prêt`);
        }
        
        console.log(`[Server] Joueurs prêts: ${room.readyPlayers.length}/${room.players.length}`);
        console.log(`[Server] MaxPlayers requis: ${room.maxPlayers}`);
        console.log(`[Server] Liste des prêts:`, room.readyPlayers);
        
        // AJOUT: Broadcast l'état des joueurs prêts
        broadcastToGame(prId, {
          type: 'player-ready-updated',
          payload: { 
            readyPlayers: room.readyPlayers 
          }
        });
        
        // ⚠️ CORRECTION CRITIQUE: Attendre le nombre MAXIMUM de joueurs ⚠️
        const allPlayersConnected = room.players.length >= room.maxPlayers;
        const allPlayersReady = room.readyPlayers.length === room.players.length;
        const minPlayersForStart = room.readyPlayers.length >= 2; // Au moins 2 pour démarrer
        
        console.log(`[Server] CONDITIONS DE DÉMARRAGE:`);
        console.log(`[Server] - Joueurs connectés: ${room.players.length}/${room.maxPlayers} → ${allPlayersConnected ? '✅' : '❌'}`);
        console.log(`[Server] - Tous prêts: ${room.readyPlayers.length}/${room.players.length} → ${allPlayersReady ? '✅' : '❌'}`);
        console.log(`[Server] - Au moins 2 prêts: ${room.readyPlayers.length} ≥ 2 → ${minPlayersForStart ? '✅' : '❌'}`);
        
        // 🎯 LOGIQUE CORRIGÉE:
        // Pour partie à 2: démarre quand 2 connectés ET tous prêts
        // Pour partie à 4: démarre quand 4 connectés ET tous prêts
        if (allPlayersConnected && allPlayersReady && minPlayersForStart) {
          console.log(`[Server] 🚀 DÉMARRAGE - Tous les ${room.players.length} joueurs sont connectés et prêts !`);
          console.log(`[Server] Noms finaux:`, room.playerNames);
          
          room.gameState.gameStarted = true;
          
          // Adapté selon le mode de jeu
          const canvasWidth = room.maxPlayers === 4 ? 600 : 800;
          const canvasHeight = room.maxPlayers === 4 ? 600 : 400;
          
          room.gameState.ballX = canvasWidth / 2;
          room.gameState.ballY = canvasHeight / 2;
          room.gameState.ballSpeedX = Math.random() > 0.5 ? 5 : -5;
          room.gameState.ballSpeedY = Math.random() > 0.5 ? 3 : -3;
          
          broadcastToGame(prId, {
            type: 'all-ready',
            payload: { 
              gameState: room.gameState,
              playerNames: { ...room.playerNames }
            }
          });
        } else {
          // Message d'attente spécifique
          if (!allPlayersConnected) {
            console.log(`[Server] ⏳ En attente de ${room.maxPlayers - room.players.length} joueur(s) supplémentaire(s)`);
          } else if (!allPlayersReady) {
            console.log(`[Server] ⏳ En attente que ${room.players.length - room.readyPlayers.length} joueur(s) se déclare(nt) prêt(s)`);
          }
        }
        break;
      }

      case 'player-move': {
        const { gameId: pmId, playerId: pid, moveData } = payload;
        const room = games[pmId];
        if (!room || !room.gameState.gameStarted) return;
        
        room.gameState.paddles[pid] = moveData.paddlePosition;
        broadcastToOthers(pmId, ws, {
          type: 'opponent-move',
          payload: { playerId: pid, moveData }
        });
        break;
      }

      case 'game-update': {
        const { gameId: guId, gameState: updateState } = payload;
        const room = games[guId];
        if (!room || !room.gameState.gameStarted) return;
        
        if (updateState.ballX !== undefined) room.gameState.ballX = updateState.ballX;
        if (updateState.ballY !== undefined) room.gameState.ballY = updateState.ballY;
        if (updateState.ballSpeedX !== undefined) room.gameState.ballSpeedX = updateState.ballSpeedX;
        if (updateState.ballSpeedY !== undefined) room.gameState.ballSpeedY = updateState.ballSpeedY;
        if (updateState.score) Object.assign(room.gameState.score, updateState.score);
        if (updateState.lastPaddleHit !== undefined) room.gameState.lastPaddleHit = updateState.lastPaddleHit;
        
		if (updateState.gameOver !== undefined) {
          room.gameState.gameOver = updateState.gameOver;
         }

        broadcastToOthers(guId, ws, {
          type: 'game-update',
          payload: { gameState: updateState }
        });
        break;
      }

      case 'reset-game': {
        const { gameId: rgId } = payload;
        const room = games[rgId];
        if (!room) return;
        
        room.gameState.score = { player1: 0, player2: 0, player3: 0, player4: 0 };
        room.gameState.lastPaddleHit = null;
        
        broadcastToGame(rgId, {
          type: 'game-reset',
          payload: { gameState: room.gameState }
        });
        break;
      }

      case 'player-leave': {
        const { gameId: leaveId, playerId: leavePid } = payload;
        console.log(`[Server] ${leavePid} quitte volontairement la partie ${leaveId}`);
        
        // Utiliser la même logique que pour une déconnexion
        handlePlayerDisconnection(leaveId, leavePid);
        break;
      }

      default:
        console.log(`[Server] Type de message non géré: ${type}`);
        break;
    }
  });

  ws.on('close', () => {
    const { gameId, playerId } = ws;
    if (!gameId || !playerId) return;
    
    handlePlayerDisconnection(gameId, playerId);
  });

  ws.on('error', (error) => {
    console.log(`[Server] Erreur WebSocket: ${error.message}`);
    const { gameId, playerId } = ws;
    if (gameId && playerId) {
      handlePlayerDisconnection(gameId, playerId);
    }
  });
});

console.log(`[Server] WebSocket server démarré sur le port ${PORT}`);