<template>
  <div class="online-game-container">
    <header class="game-header">
      <div class="header-left">
        <span class="title">{{ $t('pongOnlineTitle') }}</span>
      </div>
      <div class="header-center" v-if="gameState">
        <span class="score">{{ gameState.score.player1 }}</span>
        <span class="dash">–</span>
        <span class="score">{{ gameState.score.player2 }}</span>
        <template v-if="gameState.gameMode === 4">
          <span class="dash">–</span>
          <span class="score">{{ gameState.score.player3 }}</span>
          <span class="dash">–</span>
          <span class="score">{{ gameState.score.player4 }}</span>
        </template>
      </div>
      <div class="header-right">
        <button @click="goHome" class="btn btn-back">
          {{ $t('backToHome') }}
        </button>
      </div>
    </header>

    <div class="pong-table-container">
      <canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight"></canvas>
      <div v-if="!gameState.gameStarted" class="waiting-overlay">
        <p>En attente du démarrage de la partie...</p>
        <p>Joueur: {{ playerId }}</p>
        <p>Host: {{ isHost ? 'Oui' : 'Non' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter }            from 'vue-router';
import { connectSocket, sendMessage, setOnMessage } from '../services/websocket';

const route     = useRoute();
const router    = useRouter();
const gameId    = (route.query.id       as string) || '';
const playerId  = (route.query.playerId as string) || '';
if (!gameId || !playerId) router.replace({ name: 'Home' });

const canvasRef    = ref<HTMLCanvasElement | null>(null);
const canvasWidth  = 800;
const canvasHeight = 500;

interface GameState {
  ballX: number;
  ballY: number;
  ballSize: number;
  ballSpeedX: number;
  ballSpeedY: number;
  paddles: Record<string, number>;
  score: {
    player1: number;
    player2: number;
    player3: number;
    player4: number;
  };
  gameMode: number;
  host: string;
  gameStarted: boolean;
}

const gameState = reactive<GameState>({
  ballX:      canvasWidth / 2,
  ballY:      canvasHeight / 2,
  ballSize:   10,
  ballSpeedX: 0,
  ballSpeedY: 0,
  paddles: {
    player1: (canvasHeight - 100) / 2,
    player2: (canvasHeight - 100) / 2,
    player3: (canvasWidth  - 100) / 2,
    player4: (canvasWidth  - 100) / 2
  },
  score:      { player1: 0, player2: 0, player3: 0, player4: 0 },
  gameMode:   2,
  host:       'player1',
  gameStarted:false
});

const keys = reactive<Record<string,boolean>>({
  ArrowUp:    false,
  ArrowDown:  false,
  z:          false,
  s:          false,
  q:          false,
  d:          false,
  ArrowLeft:  false,
  ArrowRight: false
});

let isHost      = false;
let animationId = 0;
let lastPaddlePositions: Record<string, number> = {};

function onKeyDown(e: KeyboardEvent) {
  if (keys[e.key] !== undefined) {
    keys[e.key] = true;
    e.preventDefault();
  }
}
function onKeyUp(e: KeyboardEvent) {
  if (keys[e.key] !== undefined) {
    keys[e.key] = false;
    e.preventDefault();
  }
}

function updatePaddles() {
  if (!gameState.gameStarted) return;
  
  const speed = 7;
  
  // Gestion des paddles verticaux (player1 et player2)
  ['player1','player2'].forEach(pid => {
    if (playerId === pid) {
      let y = gameState.paddles[pid];
      if (keys.ArrowUp && y > 10) y -= speed;
      if (keys.ArrowDown && y + 100 < canvasHeight - 10) y += speed;
      
      if (y !== gameState.paddles[pid] && y !== lastPaddlePositions[pid]) {
        gameState.paddles[pid] = y;
        lastPaddlePositions[pid] = y;
        sendMessage('player-move', { 
          gameId, 
          playerId: pid, 
          moveData: { paddlePosition: y }
        });
      }
    }
  });
  
  // Gestion des paddles horizontaux (player3 et player4) pour le mode 4 joueurs
  if (gameState.gameMode === 4) {
    ['player3','player4'].forEach(pid => {
      if (playerId === pid) {
        let x = gameState.paddles[pid];
        if (keys.ArrowLeft && x > 10) x -= speed;
        if (keys.ArrowRight && x + 100 < canvasWidth - 10) x += speed;
        
        if (x !== gameState.paddles[pid] && x !== lastPaddlePositions[pid]) {
          gameState.paddles[pid] = x;
          lastPaddlePositions[pid] = x;
          sendMessage('player-move', { 
            gameId, 
            playerId: pid, 
            moveData: { paddlePosition: x }
          });
        }
      }
    });
  }
}

function updateBall() {
  if (!isHost || !gameState.gameStarted) return;
  
  // Rebonds sur les murs haut/bas
  if (gameState.ballY - gameState.ballSize <= 10) {
    gameState.ballSpeedY = Math.abs(gameState.ballSpeedY);
  }
  if (gameState.ballY + gameState.ballSize >= canvasHeight - 10) {
    gameState.ballSpeedY = -Math.abs(gameState.ballSpeedY);
  }

  // Collision avec paddle player1 (gauche)
  if (
    gameState.ballX - gameState.ballSize <= 30 &&
    gameState.ballY >= gameState.paddles.player1 &&
    gameState.ballY <= gameState.paddles.player1 + 100
  ) {
    gameState.ballSpeedX = Math.abs(gameState.ballSpeedX);
  }

  // Collision avec paddle player2 (droite)
  if (
    gameState.ballX + gameState.ballSize >= canvasWidth - 30 &&
    gameState.ballY >= gameState.paddles.player2 &&
    gameState.ballY <= gameState.paddles.player2 + 100
  ) {
    gameState.ballSpeedX = -Math.abs(gameState.ballSpeedX);
  }

  // Collisions pour le mode 4 joueurs
  if (gameState.gameMode === 4) {
    // Paddle player3 (haut)
    if (
      gameState.ballY - gameState.ballSize <= 20 &&
      gameState.ballX >= gameState.paddles.player3 &&
      gameState.ballX <= gameState.paddles.player3 + 100
    ) {
      gameState.ballSpeedY = Math.abs(gameState.ballSpeedY);
    }
    // Paddle player4 (bas)
    if (
      gameState.ballY + gameState.ballSize >= canvasHeight - 20 &&
      gameState.ballX >= gameState.paddles.player4 &&
      gameState.ballX <= gameState.paddles.player4 + 100
    ) {
      gameState.ballSpeedY = -Math.abs(gameState.ballSpeedY);
    }
  }

  // Mise à jour position
  gameState.ballX += gameState.ballSpeedX;
  gameState.ballY += gameState.ballSpeedY;

  // Vérification des buts
  if (gameState.ballX - gameState.ballSize <= 10) {
    gameState.score.player2++;
    resetBall();
  }
  if (gameState.ballX + gameState.ballSize >= canvasWidth - 10) {
    gameState.score.player1++;
    resetBall();
  }
  if (gameState.gameMode === 4) {
    if (gameState.ballY - gameState.ballSize <= 10) {
      gameState.score.player4++;
      resetBall();
    }
    if (gameState.ballY + gameState.ballSize >= canvasHeight - 10) {
      gameState.score.player3++;
      resetBall();
    }
  }
}

function resetBall() {
  gameState.ballX = canvasWidth / 2;
  gameState.ballY = canvasHeight / 2;
  gameState.ballSpeedX = Math.random() > 0.5 ? 5 : -5;
  gameState.ballSpeedY = Math.random() > 0.5 ? 3 : -3;
}

function draw() {
  const cvs = canvasRef.value;
  if (!cvs) return;
  
  const ctx = cvs.getContext('2d')!;

  // Fond
  ctx.fillStyle = '#1a472a';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Bordures
  ctx.strokeStyle = '#5d4037';
  ctx.lineWidth = 20;
  ctx.strokeRect(10, 10, canvasWidth - 20, canvasHeight - 20);

  // Ligne centrale
  ctx.setLineDash([10,10]);
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(canvasWidth / 2, 10);
  ctx.lineTo(canvasWidth / 2, canvasHeight - 10);
  ctx.stroke();
  ctx.setLineDash([]);

  // Balle
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(gameState.ballX, gameState.ballY, gameState.ballSize, 0, Math.PI*2);
  ctx.fill();

  // Paddles
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(20, gameState.paddles.player1, 10, 100);
  ctx.fillRect(canvasWidth - 30, gameState.paddles.player2, 10, 100);

  if (gameState.gameMode === 4) {
    ctx.fillRect(gameState.paddles.player3, 10, 100, 10);
    ctx.fillRect(gameState.paddles.player4, canvasHeight - 20, 100, 10);
  }

  // Scores
  ctx.font = '24px Arial';
  ctx.fillStyle = '#d4af37';
  ctx.textAlign = 'center';
  ctx.fillText(`${gameState.score.player1}`, canvasWidth / 4, 40);
  ctx.fillText(`${gameState.score.player2}`, (canvasWidth * 3) / 4, 40);

  if (gameState.gameMode === 4) {
    ctx.fillText(`${gameState.score.player3}`, canvasWidth / 4, 70);
    ctx.fillText(`${gameState.score.player4}`, (canvasWidth * 3) / 4, 70);
  }
}

function gameLoop() {
  updatePaddles();
  if (isHost) {
    updateBall();
    // Envoie les mises à jour toutes les 3 frames pour éviter trop de messages
    if (animationId % 3 === 0) {
      sendMessage('game-update', {
        gameId,
        gameState: {
          ballX: gameState.ballX,
          ballY: gameState.ballY,
          ballSpeedX: gameState.ballSpeedX,
          ballSpeedY: gameState.ballSpeedY,
          score: gameState.score
        }
      });
    }
  }
  draw();
  animationId = requestAnimationFrame(gameLoop);
}

function goHome() {
  router.replace({ name: 'Home' });
}

onMounted(() => {
  console.log(`[GameMultiOnline] Démarrage pour ${playerId} dans ${gameId}`);
  
  const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
  connectSocket(`${proto}://${window.location.host}/ws/`);

  setOnMessage((data: any) => {
    console.log(`[GameMultiOnline] Message WS reçu:`, data.type, data.payload);
    
    switch (data.type) {
      case 'player-joined': {
        const { maxPlayers, gameState: srv } = data.payload;
        console.log(`[GameMultiOnline] État du jeu reçu:`, srv);
        Object.assign(gameState, srv);
        
        if (maxPlayers === 4) {
          gameState.gameMode = 4;
        }
        
        isHost = (playerId === gameState.host);
        console.log(`[GameMultiOnline] isHost: ${isHost}, gameStarted: ${gameState.gameStarted}`);
        break;
      }
      
      case 'all-ready': {
        console.log(`[GameMultiOnline] Tous les joueurs sont prêts !`);
        if (data.payload.gameState) {
          Object.assign(gameState, data.payload.gameState);
        }
        gameState.gameStarted = true;
        isHost = (playerId === gameState.host);
        console.log(`[GameMultiOnline] Jeu démarré - isHost: ${isHost}`);
        break;
      }
      
      case 'opponent-move': {
        const { playerId: pid, moveData } = data.payload;
        if (pid !== playerId) {
          gameState.paddles[pid] = moveData.paddlePosition;
        }
        break;
      }
      
      case 'game-update': {
        if (!isHost) { // Seuls les non-hosts reçoivent les mises à jour
          const updated = data.payload.gameState;
          if (updated.ballX !== undefined) gameState.ballX = updated.ballX;
          if (updated.ballY !== undefined) gameState.ballY = updated.ballY;
          if (updated.ballSpeedX !== undefined) gameState.ballSpeedX = updated.ballSpeedX;
          if (updated.ballSpeedY !== undefined) gameState.ballSpeedY = updated.ballSpeedY;
          if (updated.score) Object.assign(gameState.score, updated.score);
        }
        break;
      }
    }
  });

  // Demande l'état actuel de la partie
  sendMessage('get-players', { gameId });
  
  // Se déclare prêt automatiquement
  setTimeout(() => {
    console.log(`[GameMultiOnline] ${playerId} se déclare prêt`);
    sendMessage('player-ready', { gameId, playerId });
  }, 100);

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  gameLoop();
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
  document.removeEventListener('keydown', onKeyDown);
  document.removeEventListener('keyup', onKeyUp);
});
</script>

<style scoped>
.online-game-container {
  min-height: 100vh;
  background: #1a472a;
  color: #f8f9fa;
  display: flex;
  flex-direction: column;
}
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.7);
}
.header-left .title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #d4af37;
}
.header-center {
  font-size: 1.25rem;
  color: #d4af37;
}
.header-right .btn-back {
  padding: 0.5rem 1rem;
  background: #f44336;
  border: none;
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  font-weight: bold;
}
.header-right .btn-back:hover {
  background: #da190b;
}
.pong-table-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
canvas {
  border: 4px solid #d4af37;
  background: #1a472a;
}
.waiting-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
}
</style>