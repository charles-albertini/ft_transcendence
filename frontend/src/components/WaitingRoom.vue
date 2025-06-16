<!-- src/components/WaitingRoom.vue -->
<template>
  <div class="waiting-room">
    <h1>{{ $t('waitingTitle') /* “Salon d’attente” */ }}</h1>
    <p>{{ $t('waitingId') /* “ID de la partie :” */ }} <strong>{{ gameId }}</strong></p>

    <ul class="players-list">
      <li v-for="p in players" :key="p" class="player-item">
        {{ p }} 
        <span v-if="readyPlayers.includes(p)" class="ready-check">✓</span>
      </li>
    </ul>

    <button 
      @click="onReady" 
      :disabled="isReady" 
      class="btn btn-ready">
      {{ isReady ? $t('readyDone') /* “En attente…” */ : $t('readyBtn') /* “Prêt” */ }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { connectSocket, sendMessage, setOnMessage } from '../services/websocket';
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()

const route = useRoute();
const router = useRouter();
const gameId = (route.query.id as string) || '';
const playerId = (route.query.playerId as string) || '';
if (!gameId || !playerId) {
  router.replace({ name: 'Home' });
}

const players = ref<string[]>([]);
const readyPlayers = ref<string[]>([]);
const isReady = ref(false);

onMounted(() => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const host = window.location.host;
  connectSocket(`${protocol}://${host}/ws/`);  // ouverture WS :contentReference[oaicite:0]{index=0}

  setOnMessage((data: any) => {
    switch (data.type) {
      case 'player-joined':
        // Mise à jour de la liste des joueurs
        players.value = data.payload.players;
        break;
      case 'all-ready':
        // Tous les joueurs sont prêts → on démarre la partie
        router.push({
          name: 'GamemultiOnline',
          query: { id: gameId, playerId }
        });
        break;
      // autres cas éventuels…
    }
  });
});

onUnmounted(() => {
  // (pas d'écouteurs supplémentaires à nettoyer ici)
});

function onReady() {
  if (isReady.value) return;
  sendMessage('player-ready', { gameId, playerId });  // demande “ready” au serveur :contentReference[oaicite:1]{index=1}
  isReady.value = true;
  readyPlayers.value.push(playerId);
}
</script>

<style scoped>
.waiting-room {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.players-list {
  list-style: none;
  padding: 0;
}
.player-item {
  font-size: 1.2rem;
}
.ready-check {
  color: #4caf50;
  margin-left: 0.5rem;
}
.btn-ready {
  padding: 0.75rem 1.5rem;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}
.btn-ready[disabled] {
  background-color: #90caf9;
  cursor: default;
}
</style>
