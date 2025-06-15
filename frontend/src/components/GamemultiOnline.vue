<template>
  <div class="online-game-container">
    <header class="game-header">
      <div class="header-left">
        <span class="title">{{ $t('pongOnlineTitle') /* "Pong Multijoueur" */ }}</span>
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
          {{ $t('backToHome') /* "Retour Accueil" */ }}
        </button>
      </div>
    </header>

    <div class="pong-table-container">
      <canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { connectSocket, sendMessage, setOnMessage } from '../services/websocket';
// import { useI18n } from 'vue-i18n';
// const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const gameId   = (route.query.id   as string) || '';
const playerId= (route.query.playerId as string) || '';
if (!gameId || !playerId) router.replace({ name: 'Home' });

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
  score:      { player1:0, player2:0, player3:0, player4:0 },
  gameMode:   2,
  host:       'player1',
  gameStarted:false
});

let isHost      = false;
let animationId = 0;

// Clavier
const keys = reactive<Record<string, boolean>>({
  ArrowUp: false, ArrowDown: false,
  z: false,     s: false,
  q: false,     d: false,
  ArrowLeft: false, ArrowRight: false
});
// Et on ajuste un peu le handler pour éviter de réinterroger keys[e.key] plusieurs fois
function onKeyDown(e: KeyboardEvent) {
  const k = e.key;
  if (keys[k] !== undefined) {
    keys[k] = true;
    e.preventDefault();
  }
}
function onKeyUp(e: KeyboardEvent) {
  const k = e.key;
  if (keys[k] !== undefined) {
    keys[k] = false;
    e.preventDefault();
  }
}

// Déplacement local + envoi WS
function updatePaddles() {
  const speed = 7;
  // Player1 vertical gauche
  if (playerId === 'player1') {
    let y = gameState.paddles.player1;
    if (keys.ArrowUp   && y > 10)                   y -= speed;
    if (keys.ArrowDown && y + 100 < canvasHeight-10) y += speed;
    if (y !== gameState.paddles.player1) {
      gameState.paddles.player1 = y;
      sendMessage('player-move', { gameId, playerId, moveData:{ paddlePosition:y } });
    }
  }
  // Player2 vertical droite
  if (playerId === 'player2') {
    let y = gameState.paddles.player2;
    if (keys.ArrowUp   && y > 10)                   y -= speed;
    if (keys.ArrowDown && y + 100 < canvasHeight-10) y += speed;
    if (y !== gameState.paddles.player2) {
      gameState.paddles.player2 = y;
      sendMessage('player-move', { gameId, playerId, moveData:{ paddlePosition:y } });
    }
  }
  // (mode 4 inchangé)
}

// Physique + scoring
function updateBall() {
  // rebonds murs
  if (gameState.ballY - gameState.ballSize <= 10)
    gameState.ballSpeedY =  Math.abs(gameState.ballSpeedY);
  if (gameState.ballY + gameState.ballSize >= canvasHeight - 10)
    gameState.ballSpeedY = -Math.abs(gameState.ballSpeedY);

  // collision raquette gauche
  if (
    gameState.ballX - gameState.ballSize <= 30 &&
    gameState.ballY >= gameState.paddles.player1 &&
    gameState.ballY <= gameState.paddles.player1 + 100
  ) {
    gameState.ballSpeedX = Math.abs(gameState.ballSpeedX);
  }

  // collision raquette droite
  if (
    gameState.ballX + gameState.ballSize >= canvasWidth - 30 &&
    gameState.ballY >= gameState.paddles.player2 &&
    gameState.ballY <= gameState.paddles.player2 + 100
  ) {
    gameState.ballSpeedX = -Math.abs(gameState.ballSpeedX);
  }

  // maj position
  gameState.ballX += gameState.ballSpeedX;
  gameState.ballY += gameState.ballSpeedY;

  // score gauche/droite
  if (gameState.ballX - gameState.ballSize < 0) {
    gameState.score.player2++;
    resetBall();
  }
  else if (gameState.ballX + gameState.ballSize > canvasWidth) {
    gameState.score.player1++;
    resetBall();
  }
}

// Replace la balle et init vitesses
function resetBall() {
  gameState.ballX =  canvasWidth / 2;
  gameState.ballY =  canvasHeight / 2;
  gameState.ballSpeedX = Math.random()>0.5 ? 5 : -5;
  gameState.ballSpeedY = Math.random()>0.5 ? 3 : -3;
}

// Dessin complet
function draw() {
  const cvs = canvasRef.value!;
  const ctx = cvs.getContext('2d')!;

  // fond vert
  ctx.fillStyle = '#1a472a';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // bordure épaisse
  ctx.strokeStyle = '#5d4037';
  ctx.lineWidth = 20;
  ctx.strokeRect(10, 10, canvasWidth - 20, canvasHeight - 20);

  // ligne centrale
  ctx.strokeStyle = '#d4af37';
  ctx.setLineDash([10, 10]);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(canvasWidth / 2, 10);
  ctx.lineTo(canvasWidth / 2, canvasHeight - 10);
  ctx.stroke();
  ctx.setLineDash([]);

  // balle
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(gameState.ballX, gameState.ballY, gameState.ballSize, 0, Math.PI * 2);
  ctx.fill();

  // raquettes
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(20, gameState.paddles.player1, 10, 100);
  ctx.fillRect(canvasWidth - 30, gameState.paddles.player2, 10, 100);

  // score
  ctx.fillStyle = '#d4af37';
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`${gameState.score.player1}`, canvasWidth * 0.25, 40);
  ctx.fillText(`${gameState.score.player2}`, canvasWidth * 0.75, 40);
}

// Boucle de jeu
function gameLoop() {
  if (gameState.gameStarted && isHost) {
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
  updatePaddles();
  draw();
  animationId = requestAnimationFrame(gameLoop);
}

function goHome() {
  router.replace({ name:'Home' });
}

onMounted(() => {
  // WS
  const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
  connectSocket(`${proto}://${window.location.host}/ws/`);

  setOnMessage((data: any) => {
    switch (data.type) {
      case 'all-ready':
        // on reçoit gameState initial (sans vitesses), on le remplace
        if (data.payload.gameState) {
          Object.assign(gameState, data.payload.gameState);
        }
        // on initialise la balle et on démarre
        resetBall();
        gameState.gameStarted = true;
        isHost = (playerId === gameState.host);
        break;

      case 'opponent-move':
        if (data.payload.playerId !== playerId) {
          gameState.paddles[data.payload.playerId] = data.payload.moveData.paddlePosition;
        }
        break;

      case 'game-update':
        const s = data.payload.gameState;
        if (s.ballX !== undefined) gameState.ballX = s.ballX;
        if (s.ballY !== undefined) gameState.ballY = s.ballY;
        if (s.ballSpeedX !== undefined) gameState.ballSpeedX = s.ballSpeedX;
        if (s.ballSpeedY !== undefined) gameState.ballSpeedY = s.ballSpeedY;
        Object.assign(gameState.score, s.score);
        break;
    }
  });

  sendMessage('get-players', { gameId });
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup',   onKeyUp);

  gameLoop();
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
  document.removeEventListener('keydown', onKeyDown);
  document.removeEventListener('keyup',   onKeyUp);
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
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.6);
}

.header-left .title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #d4af37;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.25rem;
}

.header-center .score {
  color: #d4af37;
  font-weight: bold;
}

.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.btn-back {
  background: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-back:hover {
  background: #da190b;
}

.pong-table-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

canvas {
  border: 4px solid #d4af37;
  background: #1a472a;
}
</style>
