<template>
  <div class="tournament-container">
    <!-- Header -->
    <div class="tournament-header">
      <button @click="goHome" class="back-home-button">
        <svg class="back-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
        </svg>
        Retour à l'accueil
      </button>
      <div class="header-content">
        <h1 class="tournament-title">TOURNOI PONG</h1>
        <p class="tournament-subtitle">Configuration des Joueurs - Bracket 8 Joueurs</p>
      </div>
    </div>

    <!-- Main Content Layout -->
    <div class="main-content">
      <!-- Setup Section (Left) -->
      <div class="setup-section">
        <h2 class="setup-title">Configuration des Joueurs</h2>
        <div class="players-grid">
          <div v-for="(_, index) in playerNames" :key="index" class="player-input-group">
            <label :for="'player' + index">Joueur {{ index + 1 }}:</label>
            <input 
              :id="'player' + index"
              v-model="playerNames[index]"
              type="text" 
              class="player-input" 
              :placeholder="'Nom du joueur ' + (index + 1)"
              @keyup.enter="startTournament"
            >
          </div>
        </div>
        
        <div class="button-group">
          <button 
            @click="fillDefaultNames" 
            class="default-names-btn"
          >
            🎲 Noms par défaut
          </button>
          <button 
            @click="clearNames" 
            class="clear-names-btn"
          >
            🗑️ Effacer tout
          </button>
          <button 
            @click="startTournament" 
            :disabled="!canStartTournament" 
            class="start-tournament-btn"
          >
            🏆 Commencer le Tournoi
          </button>
        </div>
      </div>

      <!-- Right Side Panel -->
      <div class="right-panel">
        <!-- Instructions -->
        <div class="instructions">
          <p>🎮 <strong>Instructions :</strong> Entrez les noms des 8 joueurs pour commencer le tournoi</p>
          <p>⚡ <strong>Astuce :</strong> Appuyez sur Entrée dans un champ pour valider rapidement</p>
        </div>

        <!-- Validation Status -->
        <div class="validation-status">
          <div class="validation-item" :class="{ 'valid': filledNamesCount === 8 }">
            <span>Noms remplis : {{ filledNamesCount }}/8</span>
          </div>
          <div class="validation-item" :class="{ 'valid': hasUniqueNames }">
            <span>Noms uniques : {{ hasUniqueNames ? 'Oui' : 'Non' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composable/useAuths'

const router = useRouter()
const { isAuthenticated } = useAuth()

// État de configuration
const playerNames = ref<string[]>(Array(8).fill(''))

// Noms par défaut pour tester rapidement
const defaultNames = [
  'Alice', 'Bob', 'Charlie', 'Diana', 
  'Eve', 'Frank', 'Grace', 'Henry'
]

// Computed pour la validation
const filledNamesCount = computed(() => {
  return playerNames.value.filter(name => name.trim() !== '').length
})

const hasUniqueNames = computed(() => {
  const filledNames = playerNames.value.filter(name => name.trim() !== '')
  const uniqueNames = new Set(filledNames.map(name => name.trim().toLowerCase()))
  return filledNames.length === uniqueNames.size
})

const canStartTournament = computed(() => {
  return filledNamesCount.value === 8 && hasUniqueNames.value
})

// Méthodes
const fillDefaultNames = () => {
  playerNames.value = [...defaultNames]
}

const clearNames = () => {
  playerNames.value = Array(8).fill('')
}

const goHome = () => {
  if (isAuthenticated.value) {
    router.push('/home2')
  } else {
    router.push('/')
  }
}

const startTournament = () => {
  if (!canStartTournament.value) {
    if (filledNamesCount.value !== 8) {
      alert('Veuillez entrer les 8 noms de joueurs')
    } else if (!hasUniqueNames.value) {
      alert('Tous les noms doivent être uniques')
    }
    return
  }
  
  // Nettoyer l'état précédent du localStorage
  localStorage.removeItem('tournament_state')
  localStorage.removeItem('tournamentMatchResult')
  
  // Naviguer vers la page bracket avec les noms des joueurs
  const cleanNames = playerNames.value.map(name => name.trim())
  
  // Utiliser replace et forcer le rechargement du composant
  router.replace({
    path: '/tournamentbracket',
    query: {
      players: cleanNames.join(','),
      timestamp: Date.now().toString() // Force refresh
    }
  })
}
</script>

<style scoped>
.tournament-container {
  height: 100vh;
  background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%);
  padding: 1rem;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tournament-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 2rem;
  border: 3px solid #d4af37;
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  position: relative;
}

.back-home-button {
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
  text-decoration: none;
  position: absolute;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
}

.back-home-button:hover {
  background: rgba(212, 175, 55, 0.2);
  transform: translateY(-50%) translateY(-2px);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.back-icon {
  width: 20px;
  height: 20px;
}

.header-content {
  text-align: center;
  flex: 1;
}

.main-content {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex: 1;
  overflow: hidden;
}

.tournament-title {
  font-size: 3rem;
  font-weight: bold;
  color: #d4af37;
  margin: 0 0 0.5rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
}

.tournament-subtitle {
  font-size: 1.2rem;
  color: #bbf7d0;
  margin: 0;
}

.setup-section {
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid #d4af37;
  border-radius: 1rem;
  padding: 2rem;
  backdrop-filter: blur(10px);
  max-width: 800px;
  flex: 0 0 700px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.right-panel {
  flex: 0 0 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
}

.setup-title {
  color: #d4af37;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  flex-shrink: 0;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  flex: 1;
}

.player-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.player-input-group label {
  color: #bbf7d0;
  font-weight: 600;
}

.player-input {
  padding: 0.75rem;
  border: 2px solid #d4af37;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  color: #1a472a;
  font-weight: 600;
  transition: all 0.3s ease;
}

.player-input:focus {
  outline: none;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
  transform: scale(1.02);
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.default-names-btn, .clear-names-btn {
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.default-names-btn:hover {
  background: #4b5563;
  transform: translateY(-2px);
}

.clear-names-btn:hover {
  background: #ef4444;
  transform: translateY(-2px);
}

.start-tournament-btn {
  background: #d4af37;
  color: #1a472a;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-tournament-btn:hover:not(:disabled) {
  background: #b8941f;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
}

.start-tournament-btn:disabled {
  background: #666;
  cursor: not-allowed;
  transform: none;
}

.validation-status {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}

.validation-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #ef4444;
  transition: color 0.3s ease;
}

.validation-item.valid {
  color: #22c55e;
}

.validation-item:last-child {
  margin-bottom: 0;
}

.validation-icon {
  font-size: 1.2rem;
}

.instructions {
  text-align: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 1rem;
  border: 1px solid rgba(212, 175, 55, 0.3);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}

.instructions p {
  color: #bbf7d0;
  margin: 0.5rem 0;
  font-size: 1.1rem;
}
</style>