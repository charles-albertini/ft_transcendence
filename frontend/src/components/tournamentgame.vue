<template>
  <div class="game-container">
    <header class="game-header">
      <div class="header-container">
        <div class="header-brand">
          <div class="billiard-ball ball-8-small"></div>
          <span class="brand-text">Tournoi Pong - Match en cours</span>
        </div>
        <div class="header-controls">
          <div class="score-display">
            <span class="score-label">Score:</span>
            <span class="score-value">{{ player1Score }} - {{ player2Score }}</span>
          </div>
          <button @click="resetGame" class="btn btn-primary">
            <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
            </svg>
            Nouvelle Partie
          </button>
          <button @click="togglePause" class="btn btn-secondary">
            <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
              <path v-if="!isPaused" fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
            </svg>
            {{ isPaused ? 'Reprendre' : 'Pause' }}
          </button>
          <button @click="returnToTournament" class="btn btn-outline">
            🏆 Retour Tournoi
          </button>
        </div>
      </div>
    </header>

    <main class="game-main">
      <div class="game-area" ref="gameContainer">
        <!-- Game table -->
        <div class="pong-table-container">
          <div class="pong-table">
            <canvas 
              ref="gameCanvas" 
              width="800" 
              height="400" 
              class="game-canvas"
            ></canvas>
          </div>
        </div>

        <!-- Start game overlay -->
        <div v-if="!gameStarted" class="game-overlay">
          <h2 class="overlay-title">🏓 Match de Tournoi</h2>
          <p class="overlay-subtitle">
            {{ player1Name }} vs {{ player2Name }}
          </p>
          <p class="start-instruction">
            Appuyez sur <strong>ESPACE</strong> pour commencer le match
          </p>
          <div class="controls-preview">
            <div class="control-item">
              <strong>{{ player1Name }}:</strong> W/S
            </div>
            <div class="control-item">
              <strong>{{ player2Name }}:</strong> Flèches ↑/↓
            </div>
          </div>
        </div>

        <!-- Pause overlay -->
        <div v-if="isPaused && gameStarted" class="game-overlay">
          <h2 class="overlay-title">Jeu en Pause</h2>
          <button @click="togglePause" class="btn btn-primary btn-large">
            <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
            </svg>
            Reprendre
          </button>
        </div>

        <!-- Game over overlay -->
        <div v-if="gameOver" class="game-overlay">
          <h2 class="overlay-title">🏆 Match Terminé</h2>
          <p class="overlay-subtitle">
            {{ getWinnerText() }}
          </p>
          <div class="final-score">
            {{ player1Score }} - {{ player2Score }}
          </div>
          <div class="winner-celebration">
            <div class="trophy-icon">🏆</div>
            <div class="winner-name">{{ getWinnerName() }}</div>
            <div class="winner-subtitle">remporte ce match !</div>
          </div>
          <div class="game-over-actions">
            <button @click="resetGame" class="btn btn-secondary">
              🔄 Rejouer
            </button>
            <button @click="confirmWinner" class="btn btn-primary btn-large">
            </button>
          </div>
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
          <div class="player-controls">
            <strong>{{ player1Name }} (Gauche):</strong> Touches W/S
          </div>
          <div class="player-controls">
            <strong>{{ player2Name }} (Droite):</strong> Flèches ↑/↓
          </div>
        </div>
        <div class="game-info">
          <span>Premier à {{ winningScore }} points gagne</span>
          <span>•</span>
          <span>Appuyez sur P pour pause</span>
          <span>•</span>
          <span>Appuyez sur R pour recommencer</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Props depuis la route
const route = useRoute()
const router = useRouter()

// Noms des joueurs depuis les paramètres de la route
const player1Name = ref(route.query.player1 as string || 'Joueur 1')
const player2Name = ref(route.query.player2 as string || 'Joueur 2')

// Debug logging

// Game state
const gameCanvas = ref<HTMLCanvasElement | null>(null)
const gameContainer = ref<HTMLElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const isPaused = ref(false)
const gameOver = ref(false)
const gameStarted = ref(false)
const player1Score = ref(0)
const player2Score = ref(0)
const winningScore = 5

// Keyboard state for smooth movement
const keys = ref({
  // Joueur 1 (gauche) - W/S
  KeyW: false,
  KeyS: false,
  // Joueur 2 (droite) - Flèches haut/bas
  ArrowUp: false,
  ArrowDown: false
})

// Game elements
const ball = ref({
  x: 400,
  y: 200,
  radius: 12,
  speedX: 5,
  speedY: 3,
  color: '#ffffff'
})

const player1 = ref({
  x: 30,
  y: 200,
  width: 8,
  height: 60,
  color: '#d4af37',
  speed: 8
})

const player2 = ref({
  x: 762,
  y: 200,
  width: 8,
  height: 60,
  color: '#d4af37',
  speed: 8
})

// Animation frame ID for cleanup
let animationFrameId: number | null = null

// Initialize game
onMounted(() => {
  // Attendre que le DOM soit complètement rendu avec un délai supplémentaire
  nextTick(() => {
    setTimeout(() => {
      initializeCanvas()
    }, 150) // Délai de 150ms pour s'assurer que le DOM est prêt
  })
})

function initializeCanvas() {
  
  if (gameCanvas.value) {
    
    ctx.value = gameCanvas.value.getContext('2d')
    if (ctx.value) {
      resetBall()
      
      // Forcer un premier rendu pour s'assurer que quelque chose s'affiche
      setTimeout(() => {
        drawGame()
      }, 50)
      
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('keyup', handleKeyUp)
      window.addEventListener('resize', handleResize)
      handleResize()
      startGameLoop()
    } else {
      // Retry après un délai si l'initialisation échoue
      setTimeout(initializeCanvas, 300)
    }
  } else {
    // Retry après un délai si l'élément n'est pas trouvé
    setTimeout(initializeCanvas, 300)
  }
}

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  window.removeEventListener('resize', handleResize)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})

watch([player1Score, player2Score], ([newPlayer1Score, newPlayer2Score]) => {
  if (newPlayer1Score >= winningScore || newPlayer2Score >= winningScore) {
    gameOver.value = true
    isPaused.value = true
  }
})

function startGameLoop() {
  if (!isPaused.value && !gameOver.value && gameStarted.value) {
    updateGame()
    drawGame()
  } else if (!gameStarted.value) {
    drawGame()
  }
  animationFrameId = requestAnimationFrame(startGameLoop)
}

function updateGame() {
  handleKeyboardMovement()
  
  ball.value.x += ball.value.speedX
  ball.value.y += ball.value.speedY

  // Ball collision with top and bottom walls
  if (ball.value.y - ball.value.radius <= 0 || ball.value.y + ball.value.radius >= gameCanvas.value!.height) {
    ball.value.speedY = -ball.value.speedY
    if (ball.value.y - ball.value.radius <= 0) {
      ball.value.y = ball.value.radius
    } else {
      ball.value.y = gameCanvas.value!.height - ball.value.radius
    }
  }

  // Paddle collision detection
  const player1Collision = checkImprovedPaddleCollision(player1.value)
  const player2Collision = checkImprovedPaddleCollision(player2.value)

  if (player1Collision || player2Collision) {
    const paddle = player1Collision ? player1.value : player2.value
    const hitPos = (ball.value.y - paddle.y) / (paddle.height / 2)
    
    ball.value.speedX = -ball.value.speedX
    ball.value.speedY = hitPos * 4
    
    const minSpeed = 4
    if (Math.abs(ball.value.speedX) < minSpeed) {
      ball.value.speedX = ball.value.speedX > 0 ? minSpeed : -minSpeed
    }
    
    const maxSpeed = 10
    if (Math.abs(ball.value.speedX) < maxSpeed) {
      ball.value.speedX *= 1.05
    }
    
    if (player1Collision) {
      ball.value.x = paddle.x + paddle.width + ball.value.radius + 1
    } else {
      ball.value.x = paddle.x - ball.value.radius - 1
    }
    
  }

  // Ball out of bounds (scoring)
  if (ball.value.x - ball.value.radius < 0) {
    player2Score.value++
    resetBall()
  } else if (ball.value.x + ball.value.radius > gameCanvas.value!.width) {
    player1Score.value++
    resetBall()
  }
}

function checkImprovedPaddleCollision(paddle: typeof player1.value) {
  const ballLeft = ball.value.x - ball.value.radius
  const ballRight = ball.value.x + ball.value.radius
  const ballTop = ball.value.y - ball.value.radius
  const ballBottom = ball.value.y + ball.value.radius
  
  const paddleLeft = paddle.x
  const paddleRight = paddle.x + paddle.width
  const paddleTop = paddle.y - paddle.height / 2
  const paddleBottom = paddle.y + paddle.height / 2
  
  const overlapping = ballRight > paddleLeft && 
                     ballLeft < paddleRight && 
                     ballBottom > paddleTop && 
                     ballTop < paddleBottom
  
  if (!overlapping) return false
  
  if (paddle === player1.value && ball.value.speedX > 0) return false
  if (paddle === player2.value && ball.value.speedX < 0) return false
  
  return true
}

function drawGame() {
  if (!ctx.value || !gameCanvas.value) {
    return
  }

  try {
    // Clear canvas
    ctx.value.clearRect(0, 0, gameCanvas.value.width, gameCanvas.value.height)
    
    // Draw table background
    const gradient = ctx.value.createLinearGradient(0, 0, gameCanvas.value.width, gameCanvas.value.height)
    gradient.addColorStop(0, '#1a472a')
    gradient.addColorStop(0.5, '#2d5a3d')
    gradient.addColorStop(1, '#1a472a')
    ctx.value.fillStyle = gradient
    ctx.value.fillRect(0, 0, gameCanvas.value.width, gameCanvas.value.height)
    
    // Draw border
    ctx.value.strokeStyle = '#d4af37'
    ctx.value.lineWidth = 4
    ctx.value.strokeRect(2, 2, gameCanvas.value.width - 4, gameCanvas.value.height - 4)
    
    // Draw center line
    ctx.value.beginPath()
    ctx.value.setLineDash([])
    ctx.value.moveTo(gameCanvas.value.width / 2, 0)
    ctx.value.lineTo(gameCanvas.value.width / 2, gameCanvas.value.height)
    ctx.value.strokeStyle = '#d4af37'
    ctx.value.lineWidth = 2
    ctx.value.stroke()

    // Draw ball with glow effect
    ctx.value.beginPath()
    ctx.value.arc(ball.value.x, ball.value.y, ball.value.radius + 2, 0, Math.PI * 2)
    ctx.value.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.value.fill()
    
    ctx.value.beginPath()
    ctx.value.arc(ball.value.x, ball.value.y, ball.value.radius, 0, Math.PI * 2)
    ctx.value.fillStyle = ball.value.color
    ctx.value.fill()
    ctx.value.shadowColor = 'rgba(255, 255, 255, 0.5)'
    ctx.value.shadowBlur = 10
    ctx.value.fill()
    ctx.value.shadowBlur = 0

    // Draw paddles with golden color
    ctx.value.fillStyle = player1.value.color
    ctx.value.fillRect(
      player1.value.x, 
      player1.value.y - player1.value.height / 2, 
      player1.value.width, 
      player1.value.height
    )
    
    ctx.value.fillStyle = player2.value.color
    ctx.value.fillRect(
      player2.value.x, 
      player2.value.y - player2.value.height / 2, 
      player2.value.width, 
      player2.value.height
    )

    // Draw score with player labels
    ctx.value.font = 'bold 24px Arial'
    ctx.value.fillStyle = '#d4af37'
    ctx.value.textAlign = 'center'
    ctx.value.fillText(player1Score.value.toString(), gameCanvas.value.width * 0.25, 30)
    ctx.value.fillText(player2Score.value.toString(), gameCanvas.value.width * 0.75, 30)
    
    // Draw player labels
    ctx.value.font = 'bold 16px Arial'
    ctx.value.fillStyle = '#e0e0e0'
    ctx.value.fillText(player1Name.value, gameCanvas.value.width * 0.25, 55)
    ctx.value.fillText(player2Name.value, gameCanvas.value.width * 0.75, 55)
  } catch (error) {
    // Error in drawGame
  }
}

function resetBall() {
  if (!gameCanvas.value) return
  ball.value.x = gameCanvas.value.width / 2
  ball.value.y = gameCanvas.value.height / 2
  ball.value.speedX = 5 * (Math.random() > 0.5 ? 1 : -1)
  ball.value.speedY = 3 * (Math.random() > 0.5 ? 1 : -1)
}

function resetGame() {
  player1Score.value = 0
  player2Score.value = 0
  gameOver.value = false
  isPaused.value = false
  gameStarted.value = false
  resetBall()
}

function togglePause() {
  if (gameStarted.value) {
    isPaused.value = !isPaused.value
  }
}

function startGame() {
  gameStarted.value = true
  isPaused.value = false
}

function getWinnerText() {
  if (player1Score.value > player2Score.value) {
    return `${player1Name.value} a gagné !`
  } else {
    return `${player2Name.value} a gagné !`
  }
}

function getWinnerName() {
  return player1Score.value > player2Score.value ? player1Name.value : player2Name.value
}

function confirmWinner() {
  // Sauvegarder le résultat dans le localStorage
  const matchResult = {
    winner: getWinnerName(),
    player1: player1Name.value,
    player2: player2Name.value,
    score1: player1Score.value,
    score2: player2Score.value,
    completed: true
  }
  
  localStorage.setItem('tournamentMatchResult', JSON.stringify(matchResult))
  
  // Redirection avec rechargement complet de la page
  window.location.href = '/tournamentbracket'
}

function returnToTournament() {
  if (confirm('Êtes-vous sûr de vouloir retourner au tournoi ? Le match en cours sera perdu.')) {
    // Nettoyer le localStorage si on abandonne le match
    localStorage.removeItem('lastMatchResult')
    
    if (router) {
      router.push('/tournamentbracket')
    } else {
      window.location.href = '/tournamentbracket'
    }
  }
}

function handleKeyboardMovement() {
  if (isPaused.value || gameOver.value || !gameStarted.value) return
  
  // Joueur 1 (gauche) - W/S ou flèches
  const player1Up = keys.value.KeyW
  const player1Down = keys.value.KeyS
  
  if (player1Up && !player1Down) {
    player1.value.y -= player1.value.speed
  } else if (player1Down && !player1Up) {
    player1.value.y += player1.value.speed
  }
  
  // Joueur 2 (droite) - Flèches haut/bas
  const player2Up = keys.value.ArrowUp
  const player2Down = keys.value.ArrowDown
  
  if (player2Up && !player2Down) {
    player2.value.y -= player2.value.speed
  } else if (player2Down && !player2Up) {
    player2.value.y += player2.value.speed
  }
  
  // Contraintes pour joueur 1
  if (player1.value.y - player1.value.height / 2 < 0) {
    player1.value.y = player1.value.height / 2
  } else if (player1.value.y + player1.value.height / 2 > gameCanvas.value!.height) {
    player1.value.y = gameCanvas.value!.height - player1.value.height / 2
  }
  
  // Contraintes pour joueur 2
  if (player2.value.y - player2.value.height / 2 < 0) {
    player2.value.y = player2.value.height / 2
  } else if (player2.value.y + player2.value.height / 2 > gameCanvas.value!.height) {
    player2.value.y = gameCanvas.value!.height - player2.value.height / 2
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.code in keys.value) {
    keys.value[e.code as keyof typeof keys.value] = true
    e.preventDefault()
  }
  
  if (e.key === ' ' && !gameStarted.value) {
    startGame()
    e.preventDefault()
  } else if (e.key === 'p' || e.key === 'Escape') {
    togglePause()
  } else if (e.key === 'r' || e.key === 'R') {
    if (gameOver.value) {
      resetGame()
    }
  }
}

function handleKeyUp(e: KeyboardEvent) {
  if (e.code in keys.value) {
    keys.value[e.code as keyof typeof keys.value] = false
    e.preventDefault()
  }
}

function handleResize() {
  if (gameContainer.value && gameCanvas.value) {
    const containerWidth = gameContainer.value.clientWidth
    const scale = Math.min(1, containerWidth / 800)
    
    gameCanvas.value.style.transform = `scale(${scale})`
    gameCanvas.value.style.transformOrigin = 'top left'
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

.btn-outline {
  background: transparent;
  color: #bbf7d0;
  border: 2px solid #bbf7d0;
}

.btn-outline:hover {
  background: #bbf7d0;
  color: #1a472a;
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
  padding: 2rem;
}

.overlay-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #d4af37;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.overlay-subtitle {
  font-size: 1.25rem;
  color: #e0e0e0;
  margin-bottom: 1rem;
  text-align: center;
}

.start-instruction {
  font-size: 1.1rem;
  color: #bbf7d0;
  margin-bottom: 2rem;
  text-align: center;
}

.controls-preview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.control-item {
  color: #e0e0e0;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  text-align: center;
}

.final-score {
  font-size: 2rem;
  font-weight: bold;
  color: #d4af37;
  margin-bottom: 2rem;
}

.winner-celebration {
  text-align: center;
  margin-bottom: 2rem;
}

.trophy-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 2s infinite;
}

.winner-name {
  font-size: 1.8rem;
  font-weight: bold;
  color: #d4af37;
  margin-bottom: 0.5rem;
}

.winner-subtitle {
  font-size: 1.2rem;
  color: #bbf7d0;
}

.game-over-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
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

.game-info {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #bbf7d0;
  flex-wrap: wrap;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}
</style>