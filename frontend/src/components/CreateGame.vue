<template>
  <div class="create-container">
    <h1>{{ $t('createGameTitle') }}</h1>

    <div v-if="!gameId">
      <label for="playersCount">{{ $t('choosePlayersCount') }}</label>
      <!-- v-model.number force playersCount à rester un Number -->
      <select
        id="playersCount"
        v-model.number="playersCount"
        class="select-count"
      >
        <option :value="2">2 {{ $t('players') }}</option>
        <option :value="4">4 {{ $t('players') }}</option>
      </select>
      <button @click="create" class="btn btn-create">
        {{ $t('createBtn') }}
      </button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>

    <div v-else class="created-info">
      <p>
        {{ $t('gameCreatedId') }} <strong>{{ gameId }}</strong>
      </p>
      <button @click="goWaiting" class="btn btn-waiting">
        {{ $t('goToWaiting') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { connectSocket, sendMessage, setOnMessage } from '../services/websocket';

const router       = useRouter();
const playersCount = ref<number>(2);
const gameId       = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

function getWsUrl() {
  const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${proto}://${window.location.host}/ws/`;
}

onMounted(() => {
  const socket = connectSocket(getWsUrl());

  socket.addEventListener('open', () => {
    // on peut créer la partie dès que le socket est prêt
  });

  setOnMessage(data => {
    if (data.type === 'game-created') {
      gameId.value = data.payload.gameId;
    }
    if (data.type === 'error') {
      errorMessage.value = data.payload.message || 'Erreur inconnue';
    }
  });
});

function create() {
  errorMessage.value = null;
  sendMessage('create-game', { maxPlayers: playersCount.value });
}

function goWaiting() {
  if (!gameId.value) return;
  router.push({
    name: 'WaitingRoom',
    query: {
      id:       gameId.value,
      playerId: 'player1'
    }
  });
}
</script>

<style scoped>
/* vos styles existants… */
</style>
