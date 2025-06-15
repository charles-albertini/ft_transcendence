<template>
  <div class="online-game-container">
    <!-- En‐tête (score, titre, bouton Retour) -->
    <header class="game-header">
      <div class="header-left">
        <span class="title">{{ $t('pongOnlineTitle') /* "Pong Multijoueur" */ }}</span>
      </div>
      <div class="header-center">
        <!-- Score : joueur1 – joueur2 (– joueurs 3/4 si mode 4) -->
        <template v-if="gameState">
          <span class="score">{{ gameState.score.player1 }}</span>
          <span class="dash">–</span>
          <span class="score">{{ gameState.score.player2 }}</span>
          <span v-if="gameState.gameMode === 4" class="dash">–</span>
          <span v-if="gameState.gameMode === 4" class="score">{{ gameState.score.player3 }}</span>
          <span v-if="gameState.gameMode === 4" class="dash">–</span>
          <span v-if="gameState.gameMode === 4" class="score">{{ gameState.score.player4 }}</span>
        </template>
      </div>
      <div class="header-right">
        <button @click="goHome" class="btn btn-back">{{ $t('backToHome') /* "Retour Accueil" */ }}</button>
      </div>
    </header>

    <!-- Canvas Pong -->
    <div class="pong-table-container">
      <canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { connectSocket, sendMessage, setOnMessage } from '../services/websocket';

const route  = useRoute();
const router = useRouter();
const gameId  = (route.query.id   as string) || '';
const playerId = (route.query.playerId as string) || '';
if (!gameId || !playerId) {
  router.replace({ name: 'Home' });
}

const canvasRef   = ref<HTMLCanvasElement|null>(null);
const canvasWidth = 800;
const canvasHeight= 500;

interface GameState {
  ballX: number;
  ballY: number;
  ballSize: number;
  ballSpeedX: number;
  ballSpeedY: number;
  paddles: Record<string, number>;
  score: { player1:number; player2:number; player3:number; player4:number; };
  gameMode: number;
  host: string;
  gameStarted: boolean;
}

const gameState = reactive<GameState>({
  ballX: canvasWidth/2,
  ballY: canvasHeight/2,
  ballSize: 10,
  ballSpeedX: 0,
  ballSpeedY: 0,
  paddles: {
    player1: (canvasHeight-100)/2,
    player2: (canvasHeight-100)/2,
    player3: (canvasWidth -100)/2,
    player4: (canvasWidth -100)/2
  },
  score:   { player1:0, player2:0, player3:0, player4:0 },
  gameMode: 2,
  host:     'player1',
  gameStarted: false
});

// Clavier pour tous les joueurs
const keys = reactive({
  ArrowUp: false, ArrowDown: false,
  z: false, s: false,
  q: false, d: false,
  ArrowLeft: false, ArrowRight: false
});

let isHost     = false;
let animationId= 0;

// Gestion des touches
function onKeyDown(e: KeyboardEvent) {
  if (e.key in keys) {
    keys[e.key as keyof typeof keys] = true;
    e.preventDefault();
  }
}
function onKeyUp(e: KeyboardEvent) {
  if (e.key in keys) {
    keys[e.key as keyof typeof keys] = false;
    e.preventDefault();
  }
}

// Met à jour la position du paddle local et envoie au serveur
function updatePaddles() {
  const speed = 7;

  // Player1 gauche vertical
  if (playerId === 'player1') {
    const oldY = gameState.paddles.player1;
    let newY = oldY;
    if (keys.ArrowUp   && oldY > 10)                    newY = oldY - speed;
    if (keys.ArrowDown && oldY + 100 < canvasHeight -10) newY = oldY + speed;
    gameState.paddles.player1 = newY;
    sendMessage('player-move', {
      gameId, playerId: 'player1',
      moveData: { paddlePosition: newY }
    });
  }

  // Player2 droite vertical
  if (playerId === 'player2') {
    const oldY = gameState.paddles.player2;
    let newY = oldY;
    if (keys.ArrowUp   && oldY > 10)                    newY = oldY - speed;
    if (keys.ArrowDown && oldY + 100 < canvasHeight -10) newY = oldY + speed;
    gameState.paddles.player2 = newY;
    sendMessage('player-move', {
      gameId, playerId: 'player2',
      moveData: { paddlePosition: newY }
    });
  }

  // En mode 4, player3/4 horizontaux
  if (gameState.gameMode === 4) {
    // Player3 haut
    if (playerId === 'player3') {
      const oldX = gameState.paddles.player3;
      let newX = oldX;
      if (keys.ArrowLeft  && oldX > 10)                    newX = oldX - speed;
      if (keys.ArrowRight && oldX +100 < canvasWidth -10)  newX = oldX + speed;
      gameState.paddles.player3 = newX;
      sendMessage('player-move', {
        gameId, playerId: 'player3',
        moveData: { paddlePosition: newX }
      });
    }
    // Player4 bas
    if (playerId === 'player4') {
      const oldX = gameState.paddles.player4;
      let newX = oldX;
      if (keys.q && oldX > 10)                     newX = oldX - speed;
      if (keys.d && oldX +100 < canvasWidth -10)   newX = oldX + speed;
      gameState.paddles.player4 = newX;
      sendMessage('player-move', {
        gameId, playerId: 'player4',
        moveData: { paddlePosition: newX }
      });
    }
  }
}

// Met à jour la balle & scores
function updateBall() {
  // Rebond murs haut/bas
  if (gameState.ballY - gameState.ballSize <= 10) {
    gameState.ballSpeedY = Math.abs(gameState.ballSpeedY);
  }
  if (gameState.ballY + gameState.ballSize >= canvasHeight -10) {
    gameState.ballSpeedY = -Math.abs(gameState.ballSpeedY);
  }
  // Collision paddles player1
  if (
    gameState.ballX - gameState.ballSize <= 20 + 10 &&
    gameState.ballY >= gameState.paddles.player1 &&
    gameState.ballY <= gameState.paddles.player1 + 100
  ) {
    gameState.ballSpeedX = Math.abs(gameState.ballSpeedX);
  }
  // player2
  if (
    gameState.ballX + gameState.ballSize >= canvasWidth -30 &&
    gameState.ballY >= gameState.paddles.player2 &&
    gameState.ballY <= gameState.paddles.player2 + 100
  ) {
    gameState.ballSpeedX = -Math.abs(gameState.ballSpeedX);
  }
  // mode4 : haut/bas
  if (gameState.gameMode === 4) {
    if (
      gameState.ballY - gameState.ballSize <= 20 &&
      gameState.ballX >= gameState.paddles.player3 &&
      gameState.ballX <= gameState.paddles.player3 + 100
    ) {
      gameState.ballSpeedY = Math.abs(gameState.ballSpeedY);
    }
    if (
      gameState.ballY + gameState.ballSize >= canvasHeight -20 &&
      gameState.ballX >= gameState.paddles.player4 &&
      gameState.ballX <= gameState.paddles.player4 + 100
    ) {
      gameState.ballSpeedY = -Math.abs(gameState.ballSpeedY);
    }
  }

  // Déplacement
  gameState.ballX += gameState.ballSpeedX;
  gameState.ballY += gameState.ballSpeedY;

  // Score gauche/droite
  if (gameState.ballX - gameState.ballSize <= 10) {
    gameState.score.player2++;
    resetBall();
  }
  if (gameState.ballX + gameState.ballSize >= canvasWidth -10) {
    gameState.score.player1++;
    resetBall();
  }
  // Score top/bottom en 4 joueurs
  if (gameState.gameMode === 4 && gameState.ballY - gameState.ballSize <= 10) {
    gameState.score.player4++;
    resetBall();
  }
  if (gameState.gameMode === 4 && gameState.ballY + gameState.ballSize >= canvasHeight -10) {
    gameState.score.player3++;
    resetBall();
  }
}

// Replace la balle au centre
function resetBall() {
  gameState.ballX = canvasWidth / 2;
  gameState.ballY = canvasHeight / 2;
  gameState.ballSpeedX = Math.random() > 0.5 ? 5 : -5;
  gameState.ballSpeedY = Math.random() > 0.5 ? 3 : -3;
}

// Dessine fond, bordure, ligne, balle, paddles, score
function draw() {
  const cvs = canvasRef.value!;
  const ctx = cvs.getContext('2d')!;
  // fond vert
  ctx.fillStyle = '#1a472a';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  // bordure épaisse
  ctx.strokeStyle = '#5d4037';
  ctx.lineWidth = 20;
  ctx.strokeRect(10, 10, canvasWidth -20, canvasHeight -20);
  // ligne centrale dorée
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 4;
  ctx.setLineDash([10,10]);
  ctx.beginPath();
  ctx.moveTo(canvasWidth/2, 10);
  ctx.lineTo(canvasWidth/2, canvasHeight -10);
  ctx.stroke();
  ctx.setLineDash([]);
  // balle
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(gameState.ballX, gameState.ballY, gameState.ballSize, 0, Math.PI*2);
  ctx.fill();
  // paddles
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(20, gameState.paddles.player1, 10, 100);
  ctx.fillRect(canvasWidth -30, gameState.paddles.player2, 10, 100);
  if (gameState.gameMode === 4) {
    ctx.fillRect(gameState.paddles.player3, 10, 100, 10);
    ctx.fillRect(gameState.paddles.player4, canvasHeight -20, 100, 10);
  }
  // score
  ctx.fillStyle = '#d4af37';
  ctx.font = '24px Arial';
  ctx.fillText(`${gameState.score.player1}`, canvasWidth/4, 40);
  ctx.fillText(`${gameState.score.player2}`, (canvasWidth*3)/4, 40);
  if (gameState.gameMode === 4) {
    ctx.fillText(`${gameState.score.player3}`, canvasWidth/4, 70);
    ctx.fillText(`${gameState.score.player4}`, (canvasWidth*3)/4, 70);
  }
}

// Boucle principale synchronisée host/client
function gameLoop() {
  if (gameState.gameStarted) {
    updatePaddles();
    if (isHost) {
      updateBall();
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
function startGameLoop() {
  animationId = requestAnimationFrame(gameLoop);
}
function goHome() {
  router.replace({ name: 'Home' });
}

onMounted(() => {
  connectSocket(
    `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws/`
  );

  setOnMessage((data: any) => {
    switch (data.type) {
      case 'player-joined': {
        const { maxPlayers: mp, gameState: srv } = data.payload;
        Object.assign(gameState, srv);
        if (srv.gameStarted) {
          gameState.gameStarted = true;
          if (playerId === srv.host) isHost = true;
        }
        if (mp === 4) gameState.gameMode = 4;
        break;
      }
      case 'all-ready': {
        Object.assign(gameState, data.payload.gameState);
        gameState.gameStarted = true;
        if (playerId === gameState.host) isHost = true;
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
        const s = data.payload.gameState;
        if (s.ballX != null) gameState.ballX = s.ballX;
        if (s.ballY != null) gameState.ballY = s.ballY;
        if (s.ballSpeedX != null) gameState.ballSpeedX = s.ballSpeedX;
        if (s.ballSpeedY != null) gameState.ballSpeedY = s.ballSpeedY;
        if (s.score) Object.assign(gameState.score, s.score);
        break;
      }
    }
  });

  sendMessage('get-players', { gameId });
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  startGameLoop();
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
  document.removeEventListener('keydown', onKeyDown);
  document.removeEventListener('keyup', onKeyUp);
});
</script>

<style scoped>
.online-game-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #1a472a;
  color: #f8f9fa;
}

.game-header {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.6);
}
.header-left { flex: 1; }
.header-center {
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
}
.header-center .score {
  color: #d4af37;
  font-weight: bold;
}
.header-center .dash {
  color: #f8f9fa;
}
.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}
.header-right .btn-back {
  background: #f44336;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: white;
  font-weight: bold;
  cursor: pointer;
}
.header-right .btn-back:hover {
  background: #da190b;
}

.pong-table-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
canvas {
  border: 4px solid #d4af37;
  background: #1a472a;
}

@media (max-width: 600px) {
  .header-center { font-size: 1rem; gap: 0.25rem; }
}
</style>
