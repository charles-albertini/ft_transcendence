<template>
  <div class="waiting-container">
    <h1>{{ $t('waitingRoomTitle') /* “Salle d’attente” */ }}</h1>
    <ul class="players-list">
      <li v-for="p in players" :key="p" class="player-item">
        {{ p }}
        <span v-if="readyPlayers.includes(p)" class="ready-check">✓</span>
      </li>
    </ul>
    <button
      @click="markReady"
      :disabled="alreadyReady"
      class="btn-ready"
    >
      {{ alreadyReady
         ? $t('readyAwaiting')  /* “En attente…” */ 
         : $t('readyBtn')        /* “Je suis prêt” */ }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { connectSocket, sendMessage, setOnMessage } from '../services/websocket';

const route      = useRoute();
const router     = useRouter();
const gameId     = route.query.id as string;
const playerId   = route.query.playerId as string;

const players      = ref<string[]>([]);
const readyPlayers = ref<string[]>([]);
const alreadyReady = ref(false);
const allReady     = ref(false);

function getWsUrl(): string {
  const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${proto}://${window.location.host}/ws/`;
}

onMounted(() => {
  const socket = connectSocket(getWsUrl());

  // 1) Demande initiale de la liste de joueurs
  if (socket.readyState === WebSocket.OPEN) {
    sendMessage('get-players', { gameId });
  } else {
    socket.addEventListener('open', () => {
      sendMessage('get-players', { gameId });
    }, { once: true });
  }

  // 2) Écoute des événements serveur
  setOnMessage((data: any) => {
    switch (data.type) {
      case 'player-joined':
        players.value = data.payload.players;
        break;
      case 'players-ready':
        readyPlayers.value = data.payload.readyPlayers;
        break;
      case 'all-ready':
        // ne redirige pas ici, active juste le flag
        allReady.value = true;
        break;
    }
  });
});

// 3) Quand allReady devient true, on navigue vers le jeu
watch(allReady, ready => {
  if (ready) {
    router.push({
      name: 'GamemultiOnline',
      query: { id: gameId, playerId }
    });
  }
});

function markReady() {
  if (alreadyReady.value) return;
  sendMessage('player-ready', { gameId, playerId });
  alreadyReady.value = true;
}
</script>

<style scoped>
.waiting-container {
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
.players-list {
  list-style: none;
  padding: 0;
}
.player-item {
  font-size: 1.25rem;
  margin: 0.5rem 0;
}
.ready-check {
  color: #4caf50;
  margin-left: 0.5rem;
  font-weight: bold;
}
.btn-ready {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-ready:disabled {
  background-color: #757575;
  cursor: not-allowed;
}
</style>
