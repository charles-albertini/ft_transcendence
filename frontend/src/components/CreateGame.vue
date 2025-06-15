<!-- src/components/CreateGame.vue -->
<template>
  <div class="create-container">
    <h1>{{ $t('createGameTitle') /* “Créer une partie en ligne” */ }}</h1>

    <div v-if="!gameId">
      <label for="playersCount">{{ $t('choosePlayersCount') /* “Nombre de joueurs” */ }}</label>
      <select v-model="playersCount" id="playersCount" class="select-count">
        <option :value="2">2 {{ $t('players') }}</option>
        <option :value="4">4 {{ $t('players') }}</option>
      </select>
      <button @click="create" class="btn btn-create">
        {{ $t('createBtn') /* “Créer” */ }}
      </button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>

    <div v-else class="created-info">
      <p>{{ $t('gameCreatedId') /* “Partie créée ! ID :” */ }} <strong>{{ gameId }}</strong></p>
      <button @click="goWaiting" class="btn btn-waiting">
        {{ $t('goToWaiting') /* “Aller au salon” */ }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { connectSocket, sendMessage, setOnMessage } from '../services/websocket';
//import { useI18n } from 'vue-i18n';

const router = useRouter();
//const { t } = useI18n();

const playersCount = ref<number>(2);
const gameId = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

// 1) À la montée, on ouvre la WS (si pas déjà ouverte)
onMounted(() => {
  console.log('[CreateGame] onMounted : connexion WS…');
  connectSocket('ws://localhost:3002');

  setOnMessage((data: any) => {
    console.log('[CreateGame] WS onMessage →', data);
    switch (data.type) {
      case 'game-created': {
        // { payload: { gameId, assignedPlayerId: 'player1' } }
        const { gameId: newId } = data.payload;
        gameId.value = newId;
        break;
      }
      case 'error': {
        errorMessage.value = data.payload.message || 'Erreur inconnue.';
        break;
      }
      default:
        break;
    }
  });
});

// 2) Fonction de création : envoie { type: 'create-game', payload: { maxPlayers: playersCount } }
function create() {
  console.log('[CreateGame] create() → playersCount =', playersCount.value);
  errorMessage.value = null;
  sendMessage('create-game', { maxPlayers: playersCount.value });
}

// 3) Une fois la partie créée (gameId non-null), on peut aller dans la waiting-room
function goWaiting() {
  if (!gameId.value) return;
  router.push({
    name: 'WaitingRoom',
    query: {
      id: gameId.value,
      playerId: 'player1' // l’hôte est toujours player1
    }
  });
}
</script>

<style scoped>
.create-container {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  color: #f8f9fa;
}
h1 {
  font-size: 2rem;
  color: #d4af37;
}
.select-count {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 0.5rem;
}
.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  color: white;
  transition: background-color 0.2s;
}
.btn-create {
  background-color: #4caf50;
}
.btn-create:hover {
  background-color: #388e3c;
}
.btn-waiting {
  background-color: #2196f3;
}
.btn-waiting:hover {
  background-color: #1976d2;
}
.error {
  color: #ff5252;
}
.created-info {
  text-align: center;
}
</style>
