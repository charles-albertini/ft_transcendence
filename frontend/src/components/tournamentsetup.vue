<template>
  <div class="setup-container">
    <div class="setup-header">
      <h1 class="setup-title">CONFIGURATION DU TOURNOI</h1>
      <p class="setup-subtitle">Configurez votre tournoi à élimination directe</p>
    </div>

    <div class="setup-content">
      <div class="players-section">
        <h2>Joueurs du Tournoi (8 requis)</h2>
        <div class="players-grid">
          <div v-for="(_, index) in players" :key="index" class="player-input-group">
            <label :for="`player-${index}`">Joueur {{ index + 1 }}</label>
            <input
              :id="`player-${index}`"
              v-model="players[index]"
              type="text"
              :placeholder="`Nom du joueur ${index + 1}`"
              class="player-input"
              maxlength="20"
            />
          </div>
        </div>
      </div>

      <div class="actions-section">
        <button @click="randomizePlayers" class="action-button secondary">
          🎲 Noms Aléatoires
        </button>
        <button @click="resetPlayers" class="action-button secondary">
          🔄 Réinitialiser
        </button>
        <button @click="startTournament" class="action-button primary" :disabled="!canStart">
          🏆 Démarrer le Tournoi
        </button>
      </div>

      <div class="info-section">
        <h3>ℹ️ Informations</h3>
        <ul>
          <li>Le tournoi nécessite exactement 8 joueurs</li>
          <li>Format : Élimination directe (Quarts → Demi-finales → Finale)</li>
          <li>Vous pouvez jouer au Pong ou sélectionner directement les gagnants</li>
          <li>L'état du tournoi est sauvegardé automatiquement</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// État des joueurs
const players = ref<string[]>([
  'Alice', 'Bob', 'Charlie', 'Diana', 
  'Eve', 'Frank', 'Grace', 'Henry'
])

// Noms aléatoires pour la randomisation
const randomNames = [
  'Alex', 'Blake', 'Casey', 'Drew', 'Emery', 'Finley', 'Gray', 'Harper',
  'Indigo', 'Jordan', 'Kai', 'Logan', 'Morgan', 'Nova', 'Oakley', 'Parker',
  'Quinn', 'River', 'Sage', 'Taylor', 'Uma', 'Vale', 'Wren', 'Xander',
  'Yuki', 'Zara', 'Ari', 'Beau', 'Cleo', 'Dex', 'Echo', 'Fox'
]

// Vérifier si on peut démarrer
const canStart = computed(() => {
  return players.value.every(player => player.trim().length > 0) &&
         new Set(players.value.map(p => p.trim().toLowerCase())).size === 8
})

// Randomiser les noms des joueurs
const randomizePlayers = () => {
  const shuffled = [...randomNames].sort(() => Math.random() - 0.5)
  players.value = shuffled.slice(0, 8)
}

// Réinitialiser les joueurs
const resetPlayers = () => {
  players.value = [
    'Alice', 'Bob', 'Charlie', 'Diana', 
    'Eve', 'Frank', 'Grace', 'Henry'
  ]
}

// Démarrer le tournoi
const startTournament = () => {
  if (!canStart.value) return
  
  // Nettoyer l'état précédent
  localStorage.removeItem('tournament_state')
  
  // Naviguer vers le bracket avec les joueurs
  router.push({
    name: 'tournament-bracket',
    query: {
      players: players.value.join(',')
    }
  })
}
</script>

<style scoped>
.setup-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%);
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.setup-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  border: 3px solid #d4af37;
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.setup-title {
  font-size: 3rem;
  font-weight: bold;
  color: #d4af37;
  margin: 0 0 0.5rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
}

.setup-subtitle {
  font-size: 1.2rem;
  color: #bbf7d0;
  margin: 0;
}

.setup-content {
  max-width: 800px;
  margin: 0 auto;
}

.players-section {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.players-section h2 {
  color: #d4af37;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.player-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.player-input-group label {
  color: #bbf7d0;
  font-weight: 600;
  font-size: 0.9rem;
}

.player-input {
  padding: 0.75rem;
  border: 2px solid #d4af37;
  border-radius: 0.5rem;
  background: white;
  color: #1a472a;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.player-input:focus {
  outline: none;
  border-color: #f4d03f;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
}

.player-input:invalid {
  border-color: #ef4444;
}

.actions-section {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.action-button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
}

.action-button.primary {
  background: linear-gradient(45deg, #d4af37, #f4d03f);
  color: #1a472a;
}

.action-button.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
}

.action-button.primary:disabled {
  background: #6b7280;
  color: #9ca3af;
  cursor: not-allowed;
}

.action-button.secondary {
  background: #6b7280;
  color: white;
}

.action-button.secondary:hover {
  background: #4b5563;
  transform: translateY(-2px);
}

.info-section {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
}

.info-section h3 {
  color: #d4af37;
  margin: 0 0 1rem 0;
}

.info-section ul {
  color: #bbf7d0;
  margin: 0;
  padding-left: 1.5rem;
}

.info-section li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
  .setup-container {
    padding: 1rem;
  }
  
  .setup-title {
    font-size: 2rem;
  }
  
  .players-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-section {
    flex-direction: column;
    align-items: center;
  }
  
  .action-button {
    width: 100%;
    max-width: 300px;
  }
}
</style>
