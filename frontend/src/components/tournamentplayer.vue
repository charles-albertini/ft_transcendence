<template>
  <div class="tournament-container">
    <!-- Header -->
    <div class="tournament-header">
      <h1 class="tournament-title">TOURNOI PONG</h1>
      <p class="tournament-subtitle">Configuration des Joueurs - Bracket 8 Joueurs</p>
    </div>

    <!-- Setup Section -->
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

    <!-- Instructions -->
    <div class="instructions">
      <p>🎮 <strong>Instructions :</strong> Entrez les noms des 8 joueurs pour commencer le tournoi</p>
      <p>✅ <strong>Validation :</strong> Tous les noms doivent être uniques et non vides</p>
      <p>⚡ <strong>Astuce :</strong> Appuyez sur Entrée dans un champ pour valider rapidement</p>
    </div>

    <!-- Validation Status -->
    <div class="validation-status">
      <div class="validation-item" :class="{ 'valid': filledNamesCount === 8 }">
        <span class="validation-icon">{{ filledNamesCount === 8 ? '✅' : '❌' }}</span>
        <span>Noms remplis : {{ filledNamesCount }}/8</span>
      </div>
      <div class="validation-item" :class="{ 'valid': hasUniqueNames }">
        <span class="validation-icon">{{ hasUniqueNames ? '✅' : '❌' }}</span>
        <span>Noms uniques : {{ hasUniqueNames ? 'Oui' : 'Non' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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

const startTournament = () => {
  if (!canStartTournament.value) {
    if (filledNamesCount.value !== 8) {
      alert('Veuillez entrer les 8 noms de joueurs')
    } else if (!hasUniqueNames.value) {
      alert('Tous les noms doivent être uniques')
    }
    return
  }
  
  // Naviguer vers la page bracket avec les noms des joueurs
  const cleanNames = playerNames.value.map(name => name.trim())
  router.push({
    name: 'tournamentbracket',
    query: {
      players: cleanNames.join(',')
    }
  })
}
</script>

<style scoped>
.tournament-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%);
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.tournament-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  border: 3px solid #d4af37;
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
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
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  max-width: 800px;
  margin: 0 auto 2rem auto;
}

.setup-title {
  color: #d4af37;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
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
  margin: 2rem auto;
  max-width: 400px;
  backdrop-filter: blur(10px);
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
  margin: 2rem auto;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 1rem;
  border: 1px solid rgba(212, 175, 55, 0.3);
  backdrop-filter: blur(10px);
  max-width: 600px;
}

.instructions p {
  color: #bbf7d0;
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .tournament-container {
    padding: 1rem;
  }
  
  .tournament-title {
    font-size: 2rem;
  }
  
  .players-grid {
    grid-template-columns: 1fr;
  }
  
  .button-group {
    flex-direction: column;
    align-items: center;
  }
  
  .default-names-btn, .clear-names-btn, .start-tournament-btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>