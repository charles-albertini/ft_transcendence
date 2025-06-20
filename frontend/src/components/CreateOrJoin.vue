<!-- src/components/CreateOrJoin.vue -->
<template>
  <div class="create-or-join">
    <!-- Header avec logo -->
    <header class="header">
      <div class="logo-section">
        <div class="billiard-ball ball-8-small"></div>
        <h1 class="logo-text">Pong Billard</h1>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="main-content">
      <div class="content-container">
        <div class="page-header">
          <h1 class="main-title">Parties en ligne</h1>
          <p class="subtitle">Créez une nouvelle partie ou rejoignez une partie existante</p>
          <div v-if="username" class="user-info">
            <span class="user-label">Connecté en tant que :</span>
            <span class="username">{{ username }}</span>
          </div>
        </div>

        <!-- Mode sélection -->
        <div class="mode-selection">
          <div class="mode-tabs">
            <button 
              @click="currentMode = 'create'" 
              class="mode-tab"
              :class="{ active: currentMode === 'create' }"
            >
              <svg class="tab-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
              </svg>
              Créer une partie
            </button>
            <button 
              @click="currentMode = 'join'" 
              class="mode-tab"
              :class="{ active: currentMode === 'join' }"
            >
              <svg class="tab-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              Rejoindre une partie
            </button>
          </div>

          <!-- Section Créer une partie -->
          <div v-if="currentMode === 'create'" class="create-section">
            <div class="game-card">
              <div class="card-header">
                <div class="card-icon">🎮</div>
                <h2>Créer une nouvelle partie</h2>
              </div>
              
              <div v-if="!gameId" class="create-form">
                <div class="form-group">
                  <label for="playersCount">Nombre de joueurs</label>
                  <select 
                    id="playersCount" 
                    v-model.number="playersCount" 
                    class="select-input"
                  >
                    <option :value="2">2 joueurs</option>
                    <option :value="4">4 joueurs</option>
                  </select>
                </div>
                
                <button @click="createGame" class="btn btn-create" :disabled="isCreating">
                  <svg v-if="!isCreating" class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
                  </svg>
                  <div v-else class="loading-spinner"></div>
                  {{ isCreating ? 'Création...' : 'Créer la partie' }}
                </button>
                
                <p v-if="createError" class="error-message">{{ createError }}</p>
              </div>

              <div v-else class="game-created">
                <div class="success-icon">✅</div>
                <h3>Partie créée avec succès !</h3>
                <div class="game-id-display">
                  <span class="label">ID de la partie :</span>
                  <div class="game-id-container">
                    <span class="game-id-value">{{ gameId }}</span>
                    <button @click="copyGameId" class="copy-button" :class="{ 'copied': gameIdCopied }">
                      <svg v-if="!gameIdCopied" class="copy-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                      </svg>
                      <span v-else>✓</span>
                    </button>
                  </div>
                </div>
                <button @click="goToWaitingRoom" class="btn btn-waiting">
                  <svg class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                  </svg>
                  Aller en salle d'attente
                </button>
              </div>
            </div>
          </div>

          <!-- Section Rejoindre une partie -->
          <div v-if="currentMode === 'join'" class="join-section">
            <div class="game-card">
              <div class="card-header">
                <div class="card-icon">🔗</div>
                <h2>Rejoindre une partie existante</h2>
              </div>
              
              <div class="join-form">
                <div class="form-group">
                  <label for="gameIdInput">ID de la partie</label>
                  <input
                    id="gameIdInput"
                    v-model="gameIdValue"
                    type="text"
                    placeholder="Entrez l'ID de la partie"
                    @keyup.enter="joinGame"
                    class="text-input"
                    :disabled="isJoining"
                  />
                </div>
                
                <button 
                  @click="joinGame" 
                  class="btn btn-join" 
                  :disabled="!gameIdValue.trim() || isJoining"
                >
                  <svg v-if="!isJoining" class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <div v-else class="loading-spinner"></div>
                  {{ isJoining ? 'Connexion...' : 'Rejoindre la partie' }}
                </button>
                
                <p v-if="joinError" class="error-message">{{ joinError }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Bouton retour en bas de page -->
    <footer class="footer">
      <button @click="goBack" class="back-button">
        <svg class="back-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
        </svg>
        Retour
      </button>
    </footer>

    <!-- Décoration avec boules de billard -->
    <div class="billiard-decoration">
      <div class="billiard-ball ball-1 floating" style="top: 15%; left: 8%;"></div>
      <div class="billiard-ball ball-2 floating" style="top: 25%; right: 12%;"></div>
      <div class="billiard-ball ball-3 floating" style="top: 60%; left: 5%;"></div>
      <div class="billiard-ball ball-4 floating" style="top: 70%; right: 8%;"></div>
      <div class="billiard-ball ball-5 floating" style="top: 40%; left: 3%;"></div>
      <div class="billiard-ball ball-1 floating" style="top: 80%; right: 15%;"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { connectSocket, sendMessage, setOnMessage } from '../services/websocket';

const router = useRouter();

// État général
const currentMode = ref<'create' | 'join'>('create');
const username = ref('');

// État pour la création
const playersCount = ref<number>(2);
const gameId = ref<string | null>(null);
const isCreating = ref(false);
const createError = ref<string | null>(null);
const gameIdCopied = ref(false);

// État pour rejoindre
const gameIdValue = ref<string>('');
const isJoining = ref<boolean>(false);
const joinError = ref<string | null>(null);
let assignedPlayerId: string | null = null;

// Récupération du nom d'utilisateur
onMounted(() => {
  const parsedUser = JSON.parse(localStorage.getItem('user_data') || '{}');
  username.value = parsedUser.username || 'Invité';
  
  // Connexion WebSocket
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const host = window.location.host;
  connectSocket(`${protocol}://${host}/ws/`);

  setOnMessage((data: any) => {
    console.log('[CreateOrJoin] Message reçu:', data);
    
    switch (data.type) {
      case 'game-created':
        gameId.value = data.payload.gameId;
        isCreating.value = false;
        createError.value = null;
        console.log('[CreateOrJoin] Partie créée avec ID:', gameId.value);
        break;
        
      case 'join-success':
        const { assignedPlayerId: pid } = data.payload;
        assignedPlayerId = pid;
        isJoining.value = false;
        joinError.value = null;
        router.push({
          name: 'WaitingRoom',
          query: {
            id: gameIdValue.value.trim(),
            playerId: assignedPlayerId
          }
        });
        break;
        
      case 'game-not-found':
        joinError.value = 'Partie introuvable. Vérifiez l\'ID.';
        isJoining.value = false;
        break;
        
      case 'game-full':
        joinError.value = 'La partie est déjà pleine.';
        isJoining.value = false;
        break;
        
      case 'error':
        if (currentMode.value === 'create') {
          createError.value = data.payload.message || 'Erreur lors de la création';
          isCreating.value = false;
        } else {
          joinError.value = data.payload.message || 'Erreur lors de la connexion';
          isJoining.value = false;
        }
        break;
    }
  });
});

function createGame() {
  console.log('[CreateOrJoin] Création de partie avec', playersCount.value, 'joueurs pour', username.value);
  createError.value = null;
  isCreating.value = true;
  
  sendMessage('create-game', { 
    maxPlayers: playersCount.value,
    username: username.value
  });
}

function joinGame() {
  console.log('[CreateOrJoin] Tentative de rejoindre la partie:', gameIdValue.value);
  if (!gameIdValue.value.trim()) return;

  joinError.value = null;
  isJoining.value = true;

  sendMessage('join-game', {
    gameId: gameIdValue.value.trim(),
    username: username.value
  });
}

function goToWaitingRoom() {
  if (!gameId.value) return;
  router.push({
    name: 'WaitingRoom',
    query: {
      id: gameId.value,
      playerId: 'player1'
    }
  });
}

function goBack() {
  router.push({ name: 'MultiplayerHub' });
}

async function copyGameId() {
  if (!gameId.value) return;
  try {
    await navigator.clipboard.writeText(gameId.value);
    gameIdCopied.value = true;
    setTimeout(() => {
      gameIdCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Erreur lors de la copie:', err);
  }
}
</script>

<style scoped>
.create-or-join {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%);
  color: #f8f9fa;
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
  position: relative;
  z-index: 10;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-text {
  font-size: 1.8rem;
  font-weight: bold;
  color: #d4af37;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(212, 175, 55, 0.1);
  border: 2px solid #d4af37;
  border-radius: 0.5rem;
  color: #d4af37;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.9rem;
}

.header-back-btn:hover {
  background: rgba(212, 175, 55, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.back-icon {
  width: 18px;
  height: 18px;
}

/* Footer */
.footer {
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 10;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(212, 175, 55, 0.1);
  border: 2px solid #d4af37;
  border-radius: 0.5rem;
  color: #d4af37;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 1rem;
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(212, 175, 55, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.back-icon {
  width: 20px;
  height: 20px;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 2;
}

.content-container {
  max-width: 600px;
  width: 100%;
}

/* Page Header */
.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.main-title {
  font-size: 3rem;
  font-weight: bold;
  color: #d4af37;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.subtitle {
  font-size: 1.2rem;
  color: #e0e0e0;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.user-info {
  background: rgba(212, 175, 55, 0.1);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.user-label {
  color: #bbf7d0;
  font-size: 0.9rem;
}

.username {
  color: #d4af37;
  font-weight: bold;
}

/* Mode Selection */
.mode-selection {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 1.5rem;
  overflow: hidden;
}

.mode-tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.3);
}

.mode-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: none;
  background: transparent;
  color: #bbf7d0;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  border-bottom: 3px solid transparent;
}

.mode-tab:hover {
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
}

.mode-tab.active {
  background: rgba(212, 175, 55, 0.2);
  color: #d4af37;
  border-bottom-color: #d4af37;
}

.tab-icon {
  width: 20px;
  height: 20px;
}

/* Game Card */
.game-card {
  padding: 2rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.card-icon {
  font-size: 2.5rem;
}

.card-header h2 {
  color: #d4af37;
  margin: 0;
  font-size: 1.5rem;
}

/* Form Elements */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: #bbf7d0;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.select-input, .text-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: #f8f9fa;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.select-input:focus, .text-input:focus {
  outline: none;
  border-color: #d4af37;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.3);
}

.text-input::placeholder {
  color: rgba(248, 249, 250, 0.6);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: 100%;
}

.btn-create {
  background: linear-gradient(135deg, #ff9800, #f57c00);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
}

.btn-create:hover:not(:disabled) {
  background: linear-gradient(135deg, #f57c00, #ef6c00);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 152, 0, 0.4);
}

.btn-join {
  background: linear-gradient(135deg, #4caf50, #388e3c);
  color: white;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.btn-join:hover:not(:disabled) {
  background: linear-gradient(135deg, #388e3c, #2e7d32);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.btn-waiting {
  background: linear-gradient(135deg, #2196f3, #1976d2);
  color: white;
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
}

.btn-waiting:hover {
  background: linear-gradient(135deg, #1976d2, #1565c0);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
}

.btn:disabled {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

/* Loading Spinner */
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Game Created Section */
.game-created {
  text-align: center;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: bounce 0.6s ease-in-out;
}

.game-created h3 {
  color: #10b981;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.game-id-display {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.game-id-display .label {
  display: block;
  color: #bbf7d0;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.game-id-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.game-id-value {
  font-family: monospace;
  font-size: 1.2rem;
  font-weight: bold;
  color: #d4af37;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}

.copy-button {
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid #d4af37;
  border-radius: 0.375rem;
  color: #d4af37;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.copy-button:hover {
  background: rgba(212, 175, 55, 0.2);
}

.copy-button.copied {
  background: rgba(16, 185, 129, 0.2);
  border-color: #10b981;
  color: #10b981;
}

.copy-icon {
  width: 16px;
  height: 16px;
}

/* Error Messages */
.error-message {
  color: #ef4444;
  text-align: center;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.5rem;
  font-size: 0.9rem;
}

/* Billiard Decoration */
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

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
  40%, 43% { transform: translateY(-10px); }
  70% { transform: translateY(-5px); }
  90% { transform: translateY(-2px); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
  
  .header-actions {
    gap: 0.5rem;
  }
  
  .logo-text {
    font-size: 1.5rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .footer {
    padding: 1.5rem;
  }
  
  .main-title {
    font-size: 2.5rem;
  }
  
  .game-card {
    padding: 1.5rem;
  }
  
  .mode-tabs {
    flex-direction: column;
  }
  
  .game-id-container {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 2rem;
  }
  
  .game-card {
    padding: 1rem;
  }
  
  .btn {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
  
  .logo-text {
    font-size: 1.2rem;
  }
  
  .header-back-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
  
  .back-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
