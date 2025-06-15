<template>
  <div class="game-container">
    <header class="game-header">
      <div class="header-container">
        <div class="header-brand">
          <div class="billiard-ball ball-8-small"></div>
          <span class="brand-text">Pong Billard</span>
        </div>
        <div class="header-controls">
          <div class="score-display">
            <span class="score-label">Score :</span>
            <span class="score-value">{{ player1Score }} - {{ player2Score }}</span>
          </div>
          <button @click="resetGame" class="btn btn-primary">
            Nouvelle Partie
          </button>
          <button @click="togglePause" class="btn btn-secondary">
            {{ isPaused ? 'Reprendre' : 'Pause' }}
          </button>
        </div>
      </div>
    </header>

    <main class="game-main">
      <div class="game-area" ref="gameContainer">
        <div class="pong-table-container">
          <div class="pong-table">
            <canvas
              ref="gameCanvas"
              width="800"
              height="400"
              class="game-canvas"
              @touchmove.prevent="handleTouchMove"
            ></canvas>
          </div>
        </div>

        <div v-if="isPaused" class="game-overlay">
          <h2 class="overlay-title">Jeu en Pause</h2>
          <button @click="togglePause" class="btn btn-primary btn-large">
            Reprendre
          </button>
        </div>

        <div v-if="gameOver" class="game-overlay">
          <h2 class="overlay-title">Partie Terminée</h2>
          <p class="overlay-subtitle">
            {{ player1Score > player2Score ? 'Joueur 1 a gagné !' : 'Joueur 2 a gagné !' }}
          </p>
          <div class="final-score">
            {{ player1Score }} - {{ player2Score }}
          </div>
          <button @click="resetGame" class="btn btn-primary btn-large">
            Nouvelle Partie
          </button>
        </div>
      </div>

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
        <p>Utilisez Z/S pour le joueur 1, ↑/↓ pour le joueur 2</p>
        <p class="copyright">Amusez-vous bien !</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const gameCanvas = ref<HTMLCanvasElement | null>(null);
const gameContainer = ref<HTMLElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;

const isPaused = ref(false);
const gameOver = ref(false);
const player1Score = ref(0);
const player2Score = ref(0);
const winningScore = 5;

const keys = ref({
  ArrowUp: false,
  ArrowDown: false,
  KeyW: false,
  KeyS: false
});

const ball = ref({
  x: 400,
  y: 200,
  radius: 12,
  speedX: 5,
  speedY: 3
});

const player1 = ref({ x: 30, y: 200, width: 8, height: 60, speed: 8 });
const player2 = ref({ x: 762, y: 200, width: 8, height: 60, speed: 8 });

let animationFrameId: number | null = null;

onMounted(() => {
  const canvasEl = gameCanvas.value;
  if (canvasEl) {
    ctx = canvasEl.getContext('2d');
  }
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  window.addEventListener('resize', handleResize);
  handleResize();
  startGameLoop();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  window.removeEventListener('resize', handleResize);
  if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
});

watch([player1Score, player2Score], ([s1, s2]) => {
  if (s1 >= winningScore || s2 >= winningScore) {
    gameOver.value = true;
    isPaused.value = true;
  }
});

function startGameLoop() {
  if (!isPaused.value && !gameOver.value) {
    updateGame();
    drawGame();
  }
  animationFrameId = requestAnimationFrame(startGameLoop);
}

function updateGame() {
  const canvasEl = gameCanvas.value!;
  // Joueur 1 (Z/S)
  if (keys.value.KeyW && player1.value.y - player1.value.height/2 > 0) {
    player1.value.y -= player1.value.speed;
  }
  if (keys.value.KeyS && player1.value.y + player1.value.height/2 < canvasEl.height) {
    player1.value.y += player1.value.speed;
  }
  // Joueur 2 (↑/↓)
  if (keys.value.ArrowUp && player2.value.y - player2.value.height/2 > 0) {
    player2.value.y -= player2.value.speed;
  }
  if (keys.value.ArrowDown && player2.value.y + player2.value.height/2 < canvasEl.height) {
    player2.value.y += player2.value.speed;
  }

  // Déplacement de la balle
  ball.value.x += ball.value.speedX;
  ball.value.y += ball.value.speedY;

  // Rebond haut/bas
  if (ball.value.y - ball.value.radius <= 0 || ball.value.y + ball.value.radius >= canvasEl.height) {
    ball.value.speedY *= -1;
  }

  // Collision avec paddles
  [player1.value, player2.value].forEach(paddle => {
    const left   = paddle.x - (paddle === player1.value ? 0 : ball.value.radius);
    const right  = paddle.x + (paddle === player2.value ? 0 : paddle.width + ball.value.radius);
    const top    = paddle.y - paddle.height/2;
    const bottom = paddle.y + paddle.height/2;
    if (
      ball.value.x + ball.value.radius > left &&
      ball.value.x - ball.value.radius < right &&
      ball.value.y > top &&
      ball.value.y < bottom
    ) {
      ball.value.speedX *= -1;
    }
  });

  // Score
  if (ball.value.x - ball.value.radius < 0) {
    player2Score.value++;
    resetBall();
  } else if (ball.value.x + ball.value.radius > gameCanvas.value!.width) {
    player1Score.value++;
    resetBall();
  }
}

function drawGame() {
  if (!ctx || !gameCanvas.value) return;
  const c = ctx;
  const w = gameCanvas.value.width, h = gameCanvas.value.height;

  // Fond et bordure
  const grad = c.createLinearGradient(0,0,w,h);
  grad.addColorStop(0,'#1a472a');
  grad.addColorStop(0.5,'#2d5a3d');
  grad.addColorStop(1,'#1a472a');
  c.fillStyle = grad;
  c.fillRect(0,0,w,h);

  c.strokeStyle = '#d4af37';
  c.lineWidth = 4;
  c.strokeRect(2,2,w-4,h-4);

  // Ligne centrale
  c.beginPath();
  c.setLineDash([]);
  c.moveTo(w/2,0);
  c.lineTo(w/2,h);
  c.stroke();

  // Balle
  c.beginPath();
  c.arc(ball.value.x, ball.value.y, ball.value.radius+2, 0, Math.PI*2);
  c.fillStyle = 'rgba(255,255,255,0.3)';
  c.fill();
  c.beginPath();
  c.arc(ball.value.x, ball.value.y, ball.value.radius, 0, Math.PI*2);
  c.fillStyle = '#ffffff';
  c.fill();
  c.shadowColor = 'rgba(255,255,255,0.5)';
  c.shadowBlur = 10;
  c.fill();
  c.shadowBlur = 0;

  // Paddles
  c.fillStyle = '#d4af37';
  c.fillRect(
    player1.value.x,
    player1.value.y - player1.value.height/2,
    player1.value.width,
    player1.value.height
  );
  c.fillRect(
    player2.value.x,
    player2.value.y - player2.value.height/2,
    player2.value.width,
    player2.value.height
  );

  // Score
  c.font = 'bold 24px Arial';
  c.fillStyle = '#d4af37';
  c.textAlign = 'center';
  c.fillText(player1Score.value.toString(), w * 0.25, 30);
  c.fillText(player2Score.value.toString(), w * 0.75, 30);
}

function resetBall() {
  const canvasEl = gameCanvas.value!;
  ball.value.x = canvasEl.width / 2;
  ball.value.y = canvasEl.height / 2;
  ball.value.speedX = 5 * (Math.random()>0.5 ? 1 : -1);
  ball.value.speedY = 3 * (Math.random()>0.5 ? 1 : -1);
}

function resetGame() {
  player1Score.value = 0;
  player2Score.value = 0;
  gameOver.value = false;
  isPaused.value = false;
  resetBall();
}

function togglePause() {
  isPaused.value = !isPaused.value;
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.code in keys.value) {
    keys.value[e.code as keyof typeof keys.value] = true;
    e.preventDefault();
  }
}

function handleKeyUp(e: KeyboardEvent) {
  if (e.code in keys.value) {
    keys.value[e.code as keyof typeof keys.value] = false;
    e.preventDefault();
  }
}

function handleTouchMove(e: TouchEvent) {
  if (isPaused.value || gameOver.value) return;
  const rect = gameCanvas.value!.getBoundingClientRect();
  player1.value.y = e.touches[0].clientY - rect.top;
}

function handleResize() {
  if (gameContainer.value && gameCanvas.value) {
    const scale = Math.min(1, gameContainer.value.clientWidth / 800);
    gameCanvas.value.style.transform = `scale(${scale})`;
    gameCanvas.value.style.transformOrigin = 'top left';
  }
}
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