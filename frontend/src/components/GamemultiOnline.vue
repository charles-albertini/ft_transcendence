<template>
  <div class="game-container">
    <header class="game-header">
      <div class="header-container">
        <div class="header-brand">
          <div class="billiard-ball ball-8-small"></div>
          <span class="brand-text">{{ $t('pongOnlineTitle') }}</span>
        </div>
        <div class="header-controls">
          <div class="score-display" v-if="gameState">
            <span class="score-label">Score:</span>
            <span class="score-value">{{ gameState.score.player1 }} - {{ gameState.score.player2 }}</span>
            <template v-if="gameState.gameMode === 4">
              <span class="score-value"> - {{ gameState.score.player3 }} - {{ gameState.score.player4 }}</span>
            </template>
          </div>
          <button @click="resetGame" class="btn btn-primary" v-if="isHost && gameState.gameStarted">
            <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
            </svg>
            Nouvelle Partie
          </button>
          <button @click="togglePause" class="btn btn-secondary" v-if="isHost && gameState.gameStarted">
            <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
              <path v-if="!isPaused" fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
            </svg>
            {{ isPaused ? 'Reprendre' : 'Pause' }}
          </button>
          <button @click="goHome" class="btn btn-back">
            {{ $t('backToHome') }}
          </button>
        </div>
      </div>
    </header>

    <main class="game-main">
      <div class="game-area" ref="gameContainer">
        <!-- Game table with home page styling -->
        <div class="pong-table-container">
          <div class="pong-table">
            <canvas 
              ref="canvasRef" 
              :width="canvasWidth" 
              :height="canvasHeight"
              class="game-canvas"
            ></canvas>
          </div>
        </div>

        <!-- Waiting overlay -->
        <div v-if="!gameState.gameStarted" class="game-overlay">
          <h2 class="overlay-title">En attente du démarrage...</h2>
          <p class="overlay-subtitle">Joueur: {{ playerId }}</p>
          <p class="overlay-subtitle">Host: {{ isHost ? 'Oui' : 'Non' }}</p>
        </div>

        <!-- Pause overlay -->
        <div v-if="isPaused && gameState.gameStarted" class="game-overlay">
          <h2 class="overlay-title">Jeu en Pause</h2>
          <button @click="togglePause" class="btn btn-primary btn-large" v-if="isHost">
            <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
            </svg>
            Reprendre
          </button>
        </div>

        <!-- Game over overlay -->
        <div v-if="gameOver" class="game-overlay">
          <h2 class="overlay-title">Partie Terminée</h2>
          <p class="overlay-subtitle">
            {{ getWinnerText() }}
          </p>
          <div class="final-score">
            {{ gameState.score.player1 }} - {{ gameState.score.player2 }}
            <template v-if="gameState.gameMode === 4">
              - {{ gameState.score.player3 }} - {{ gameState.score.player4 }}
            </template>
          </div>
          <button @click="resetGame" class="btn btn-primary btn-large" v-if="isHost">
            <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
            </svg>
            Nouvelle Partie
          </button>
        </div>
      </div>

      <!-- Décoration avec boules de billard -->
      <div class="billiard-decoration">
        <div class="billiard-ball ball-1 floating" style="top: 10%; left: 5%;"></div>
        <div class="billiard-ball ball-2 floating" style="top: 20%; right: 8%;"></div>
        <div class="billiard-ball ball-3 floating" style="top: 60%; left: 3%;"></div>
        <div class="billiard-ball ball-4 floating" style="top: 70%; right: 5%;"></div>
        <div class="billiard-ball ball-5 floating" style="top: 40%; left: 2%;"></div>
      </div>
    </main>

    <footer class="game-footer">
      <div class="footer-container">
        <div class="controls-info">
          <div class="player-controls" v-if="playerId === 'player1'">
            <strong>Joueur 1 (Gauche):</strong> Flèches ↑/↓
          </div>
          <div class="player-controls" v-if="playerId === 'player2'">
            <strong>Joueur 2 (Droite):</strong> Flèches ↑/↓
          </div>
          <div class="player-controls" v-if="playerId === 'player3' && gameState.gameMode === 4">
            <strong>Joueur 3 (Haut):</strong> Flèches ←/→
          </div>
          <div class="player-controls" v-if="playerId === 'player4' && gameState.gameMode === 4">
            <strong>Joueur 4 (Bas):</strong> Flèches ←/→
          </div>
        </div>
        <p class="copyright">Amusez-vous bien !</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { connectSocket, sendMessage, setOnMessage } from '../services/websocket';

const route = useRoute();
const router = useRouter();
const gameId = (route.query.id as string) || '';
const playerId = (route.query.playerId as string) || '';
if (!gameId || !playerId) router.replace({ name: 'Home' });

const canvasRef = ref<HTMLCanvasElement | null>(null);
const gameContainer = ref<HTMLElement | null>(null);
const canvasWidth = 800;
const canvasHeight = 400;
const winningScore = 5;

// Game state
const isPaused = ref(false);
const gameOver = ref(false);

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
  ballX: canvasWidth / 2,
  ballY: canvasHeight / 2,
  ballSize: 12,
  ballSpeedX: 0,
  ballSpeedY: 0,
  paddles: {
    player1: canvasHeight / 2,
    player2: canvasHeight / 2,
    player3: canvasWidth / 2,
    player4: canvasWidth / 2
  },
  score: { player1: 0, player2: 0, player3: 0, player4: 0 },
  gameMode: 2,
  host: 'player1',
  gameStarted: false
});

const keys = reactive<Record<string, boolean>>({
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
});

let isHost = false;
let animationId = 0;
let lastPaddlePositions: Record<string, number> = {};

// Watch for game over condition
watch([() => gameState.score.player1, () => gameState.score.player2, () => gameState.score.player3, () => gameState.score.player4], 
  ([newPlayer1Score, newPlayer2Score, newPlayer3Score, newPlayer4Score]) => {
    if (newPlayer1Score >= winningScore || newPlayer2Score >= winningScore || 
        newPlayer3Score >= winningScore || newPlayer4Score >= winningScore) {
      gameOver.value = true;
      isPaused.value = true;
    }
  }
);

function onKeyDown(e: KeyboardEvent) {
  if (keys[e.key] !== undefined) {
    keys[e.key] = true;
    e.preventDefault();
  }
  
  if (e.key === 'p' || e.key === 'Escape') {
    if (isHost) togglePause();
  } else if (e.key === 'r' || e.key === 'R') {
    if (gameOver.value && isHost) {
      resetGame();
    }
  }
}

function onKeyUp(e: KeyboardEvent) {
  if (keys[e.key] !== undefined) {
    keys[e.key] = false;
    e.preventDefault();
  }
}

function updatePaddles() {
  if (!gameState.gameStarted || isPaused.value) return;
  
  const speed = 8;
  const paddleHeight = 60;
  const paddleWidth = 100; // Pour les paddles horizontaux
  
  // Gestion des paddles verticaux (player1 et player2)
  ['player1', 'player2'].forEach(pid => {
    if (playerId === pid) {
      let y = gameState.paddles[pid];
      if (keys.ArrowUp && y - paddleHeight/2 > 0) y -= speed;
      if (keys.ArrowDown && y + paddleHeight/2 < canvasHeight) y += speed;
      
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
    ['player3', 'player4'].forEach(pid => {
      if (playerId === pid) {
        let x = gameState.paddles[pid];
        if (keys.ArrowLeft && x - paddleWidth/2 > 0) x -= speed;
        if (keys.ArrowRight && x + paddleWidth/2 < canvasWidth) x += speed;
        
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
  if (!isHost || !gameState.gameStarted || isPaused.value) return;
  
  const paddleHeight = 60;
  const paddleWidth = 8;
  const paddleWidthHorizontal = 100;
  const paddleHeightHorizontal = 8;
  
  // Mise à jour position
  gameState.ballX += gameState.ballSpeedX;
  gameState.ballY += gameState.ballSpeedY;

  // Rebonds sur les murs haut/bas (seulement en mode 2 joueurs)
  if (gameState.gameMode === 2) {
    if (gameState.ballY - gameState.ballSize <= 2) {
      gameState.ballSpeedY = Math.abs(gameState.ballSpeedY);
      gameState.ballY = gameState.ballSize + 2;
    }
    if (gameState.ballY + gameState.ballSize >= canvasHeight - 2) {
      gameState.ballSpeedY = -Math.abs(gameState.ballSpeedY);
      gameState.ballY = canvasHeight - gameState.ballSize - 2;
    }
  }

  // Collision avec paddle player1 (gauche)
  if (
    gameState.ballX - gameState.ballSize <= 30 + paddleWidth &&
    gameState.ballY >= gameState.paddles.player1 - paddleHeight/2 &&
    gameState.ballY <= gameState.paddles.player1 + paddleHeight/2 &&
    gameState.ballSpeedX < 0
  ) {
    const hitPos = (gameState.ballY - gameState.paddles.player1) / (paddleHeight / 2);
    gameState.ballSpeedX = Math.abs(gameState.ballSpeedX);
    gameState.ballSpeedY = hitPos * 4;
    
    // Acceleration
    const minSpeed = 4;
    if (Math.abs(gameState.ballSpeedX) < minSpeed) {
      gameState.ballSpeedX = minSpeed;
    }
    const maxSpeed = 10;
    if (Math.abs(gameState.ballSpeedX) < maxSpeed) {
      gameState.ballSpeedX *= 1.05;
    }
    
    gameState.ballX = 30 + paddleWidth + gameState.ballSize + 1;
  }

  // Collision avec paddle player2 (droite)
  if (
    gameState.ballX + gameState.ballSize >= canvasWidth - 30 - paddleWidth &&
    gameState.ballY >= gameState.paddles.player2 - paddleHeight/2 &&
    gameState.ballY <= gameState.paddles.player2 + paddleHeight/2 &&
    gameState.ballSpeedX > 0
  ) {
    const hitPos = (gameState.ballY - gameState.paddles.player2) / (paddleHeight / 2);
    gameState.ballSpeedX = -Math.abs(gameState.ballSpeedX);
    gameState.ballSpeedY = hitPos * 4;
    
    // Acceleration
    const minSpeed = 4;
    if (Math.abs(gameState.ballSpeedX) < minSpeed) {
      gameState.ballSpeedX = -minSpeed;
    }
    const maxSpeed = 10;
    if (Math.abs(gameState.ballSpeedX) < maxSpeed) {
      gameState.ballSpeedX *= 1.05;
    }
    
    gameState.ballX = canvasWidth - 30 - paddleWidth - gameState.ballSize - 1;
  }

  // Collisions pour le mode 4 joueurs
  if (gameState.gameMode === 4) {
    // Paddle player3 (haut)
    if (
      gameState.ballY - gameState.ballSize <= paddleHeightHorizontal &&
      gameState.ballX >= gameState.paddles.player3 - paddleWidthHorizontal/2 &&
      gameState.ballX <= gameState.paddles.player3 + paddleWidthHorizontal/2 &&
      gameState.ballSpeedY < 0
    ) {
      gameState.ballSpeedY = Math.abs(gameState.ballSpeedY);
      gameState.ballY = paddleHeightHorizontal + gameState.ballSize + 1;
    }
    
    // Paddle player4 (bas)
    if (
      gameState.ballY + gameState.ballSize >= canvasHeight - paddleHeightHorizontal &&
      gameState.ballX >= gameState.paddles.player4 - paddleWidthHorizontal/2 &&
      gameState.ballX <= gameState.paddles.player4 + paddleWidthHorizontal/2 &&
      gameState.ballSpeedY > 0
    ) {
      gameState.ballSpeedY = -Math.abs(gameState.ballSpeedY);
      gameState.ballY = canvasHeight - paddleHeightHorizontal - gameState.ballSize - 1;
    }
    
    // Rebonds sur les murs haut/bas si pas de collision avec paddles
    if (gameState.ballY - gameState.ballSize <= 2) {
      gameState.ballSpeedY = Math.abs(gameState.ballSpeedY);
      gameState.ballY = gameState.ballSize + 2;
    }
    if (gameState.ballY + gameState.ballSize >= canvasHeight - 2) {
      gameState.ballSpeedY = -Math.abs(gameState.ballSpeedY);
      gameState.ballY = canvasHeight - gameState.ballSize - 2;
    }
  }

  // Vérification des buts
  if (gameState.ballX - gameState.ballSize <= 2) {
    gameState.score.player2++;
    resetBall();
  }
  if (gameState.ballX + gameState.ballSize >= canvasWidth - 2) {
    gameState.score.player1++;
    resetBall();
  }
  if (gameState.gameMode === 4) {
    if (gameState.ballY - gameState.ballSize <= 2) {
      gameState.score.player4++;
      resetBall();
    }
    if (gameState.ballY + gameState.ballSize >= canvasHeight - 2) {
      gameState.score.player3++;
      resetBall();
    }
  }
}

function resetBall() {
  gameState.ballX = canvasWidth / 2;
  gameState.ballY = canvasHeight / 2;
  gameState.ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
  gameState.ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
  const cvs = canvasRef.value;
  if (!cvs) return;
  
  const ctx = cvs.getContext('2d')!;

  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw table background (same as local)
  const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
  gradient.addColorStop(0, '#1a472a');
  gradient.addColorStop(0.5, '#2d5a3d');
  gradient.addColorStop(1, '#1a472a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, canvasWidth - 4, canvasHeight - 4);
  
  // Draw center line
  ctx.beginPath();
  ctx.setLineDash([]);
  ctx.moveTo(canvasWidth / 2, 0);
  ctx.lineTo(canvasWidth / 2, canvasHeight);
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw ball with glow effect
  ctx.beginPath();
  ctx.arc(gameState.ballX, gameState.ballY, gameState.ballSize + 2, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(gameState.ballX, gameState.ballY, gameState.ballSize, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Draw paddles with golden color
  const paddleHeight = 60;
  const paddleWidth = 8;
  
  // Player 1 (left)
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(
    30, 
    gameState.paddles.player1 - paddleHeight / 2, 
    paddleWidth, 
    paddleHeight
  );
  
  // Player 2 (right)
  ctx.fillRect(
    canvasWidth - 30 - paddleWidth, 
    gameState.paddles.player2 - paddleHeight / 2, 
    paddleWidth, 
    paddleHeight
  );

  // Mode 4 joueurs - paddles horizontaux
  if (gameState.gameMode === 4) {
    const paddleWidthHorizontal = 100;
    const paddleHeightHorizontal = 8;
    
    // Player 3 (top)
    ctx.fillRect(
      gameState.paddles.player3 - paddleWidthHorizontal / 2, 
      2, 
      paddleWidthHorizontal, 
      paddleHeightHorizontal
    );
    
    // Player 4 (bottom)
    ctx.fillRect(
      gameState.paddles.player4 - paddleWidthHorizontal / 2, 
      canvasHeight - 2 - paddleHeightHorizontal, 
      paddleWidthHorizontal, 
      paddleHeightHorizontal
    );
  }

  // Draw score with player labels
  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = '#d4af37';
  ctx.textAlign = 'center';
  ctx.fillText(gameState.score.player1.toString(), canvasWidth * 0.25, 30);
  ctx.fillText(gameState.score.player2.toString(), canvasWidth * 0.75, 30);
  
  if (gameState.gameMode === 4) {
    ctx.fillText(gameState.score.player3.toString(), canvasWidth * 0.25, 55);
    ctx.fillText(gameState.score.player4.toString(), canvasWidth * 0.75, 55);
  }
  
  // Draw player labels
  ctx.font = 'bold 16px Arial';
  ctx.fillStyle = '#e0e0e0';
  ctx.fillText('Joueur 1', canvasWidth * 0.25, gameState.gameMode === 4 ? 75 : 55);
  ctx.fillText('Joueur 2', canvasWidth * 0.75, gameState.gameMode === 4 ? 75 : 55);
  
  if (gameState.gameMode === 4) {
    ctx.fillText('Joueur 3', canvasWidth * 0.25, 95);
    ctx.fillText('Joueur 4', canvasWidth * 0.75, 95);
  }
}

function gameLoop() {
  updatePaddles();
  if (isHost) {
    updateBall();
    if (animationId % 1 === 0) {
      sendMessage('game-update', {
        gameId,
        gameState: {
          ballX: gameState.ballX,
          ballY: gameState.ballY,
          ballSpeedX: gameState.ballSpeedX,
          ballSpeedY: gameState.ballSpeedY,
          score: gameState.score,
          isPaused: isPaused.value,
          gameOver: gameOver.value
        }
      });
    }
  }
  draw();
  animationId = requestAnimationFrame(gameLoop);
}

function resetGame() {
  if (!isHost) return;
  
  gameState.score.player1 = 0;
  gameState.score.player2 = 0;
  gameState.score.player3 = 0;
  gameState.score.player4 = 0;
  gameOver.value = false;
  isPaused.value = false;
  resetBall();
  
  sendMessage('reset-game', { gameId });
}

function togglePause() {
  if (!isHost) return;
  
  isPaused.value = !isPaused.value;
  sendMessage('toggle-pause', { gameId, isPaused: isPaused.value });
}

function getWinnerText() {
  const scores = [
    { player: 'Joueur 1', score: gameState.score.player1 },
    { player: 'Joueur 2', score: gameState.score.player2 },
    { player: 'Joueur 3', score: gameState.score.player3 },
    { player: 'Joueur 4', score: gameState.score.player4 }
  ];
  
  const winner = scores.reduce((max, current) => 
    current.score > max.score ? current : max
  );
  
  return `${winner.player} a gagné !`;
}

function goHome() {
  router.replace({ name: 'Home' });
}

function handleResize() {
  if (gameContainer.value && canvasRef.value) {
    const containerWidth = gameContainer.value.clientWidth;
    const scale = Math.min(1, containerWidth / 800);
    
    canvasRef.value.style.transform = `scale(${scale})`;
    canvasRef.value.style.transformOrigin = 'top left';
  }
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
          if (updated.isPaused !== undefined) isPaused.value = updated.isPaused;
          if (updated.gameOver !== undefined) gameOver.value = updated.gameOver;
        }
        break;
      }
      
      case 'game-reset': {
        gameState.score.player1 = 0;
        gameState.score.player2 = 0;
        gameState.score.player3 = 0;
        gameState.score.player4 = 0;
        gameOver.value = false;
        isPaused.value = false;
        resetBall();
        break;
      }
      
      case 'game-paused': {
        isPaused.value = data.payload.isPaused;
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
  window.addEventListener('resize', handleResize);
  handleResize();

  gameLoop();
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
  document.removeEventListener('keydown', onKeyDown);
  document.removeEventListener('keyup', onKeyUp);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.game-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%);
  color: #f8f9fa;
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
}

.header-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #d4af37;
  margin: 0;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.score-display {
  padding: 0.5rem 1rem;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 0.5rem;
  color: #d4af37;
  font-weight: 600;
}

.score-label {
  color: #e0e0e0;
  margin-right: 0.5rem;
}

.score-value {
  color: #d4af37;
  font-size: 1.1rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.btn-primary {
  background: linear-gradient(135deg, #d4af37, #c19b2e);
  color: #1a1a1a;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
}

.btn-secondary {
  background: transparent;
  color: #d4af37;
  border: 2px solid #d4af37;
}

.btn-secondary:hover {
  background: #d4af37;
  color: #1a1a1a;
  transform: translateY(-2px);
}

.btn-back {
  background: #f44336;
  color: white;
}

.btn-back:hover {
  background: #da190b;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

.game-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
}

.game-area {
  position: relative;
  z-index: 2;
}

.pong-table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 2rem 0;
}

.pong-table {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: #5d4037;
  border-radius: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  width: fit-content;
}

.game-canvas {
  border-radius: 0.5rem;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
}

.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  z-index: 10;
}

.overlay-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #d4af37;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.overlay-subtitle {
  font-size: 1.25rem;
  color: #e0e0e0;
  margin-bottom: 1rem;
  text-align: center;
}

.final-score {
  font-size: 2rem;
  font-weight: bold;
  color: #d4af37;
  margin-bottom: 2rem;
}

.billiard-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.billiard-ball {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.ball-8-small {
  width: 40px;
  height: 40px;
  background-color: #000;
  border-radius: 50%;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.ball-8-small::after {
  content: "8";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 18px;
}

.ball-1 { background-color: #ffeb3b; }
.ball-2 { background-color: #2196f3; }
.ball-3 { background-color: #f44336; }
.ball-4 { background-color: #9c27b0; }
.ball-5 { background-color: #ff9800; }

.floating {
  animation: float 6s ease-in-out infinite;
}

.game-footer {
  text-align: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  color: #e0e0e0;
  border-top: 1px solid rgba(212, 175, 55, 0.3);
}

.footer-container {
  font-size: 0.9rem;
}

.controls-info {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.player-controls {
  padding: 0.5rem 1rem;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 0.5rem;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.copyright {
  margin-top: 0.5rem;
  font-size: 0.8rem;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .game-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .header-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-controls {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .controls-info {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .pong-table {
    transform: scale(0.8);
  }
  
  .overlay-title {
    font-size: 2rem;
  }
  
  .btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .game-main {
    padding: 1rem;
  }
  
  .pong-table {
    transform: scale(0.7);
  }
  
  .overlay-title {
    font-size: 1.5rem;
  }
  
  .final-score {
    font-size: 1.5rem;
  }
}
</style>