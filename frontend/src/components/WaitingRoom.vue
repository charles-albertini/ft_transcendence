<!-- src/components/WaitingRoom.vue -->
<template>
  <div class="waiting-container">
    <h1>{{ $t('waitingTitle') /* “Salon d’attente” */ }}</h1>
    <p>
      {{ $t('waitingForPlayers') /* “En attente de joueurs…” */ }}
      ({{ playersCount }} / {{ maxPlayers }})
    </p>

    <ul class="players-list">
      <li
        v-for="pid in players"
        :key="pid"
        :class="{ 'is-me': pid === playerId }"
      >
        {{ pid }} <span v-if="pid === playerId">({{ $t('me') /* “moi” */ }})</span>
        <span v-if="readyPlayers.includes(pid)">✓ {{ $t('ready') /* “prêt” */ }}</span>
        <span v-else>⌛</span>
      </li>
    </ul>

    <!-- Bouton “Je suis prêt !” -->
    <button
      @click="sayReady"
      :disabled="alreadyReady"
      class="btn btn-ready"
    >
      {{ alreadyReady ? $t('waitingOthers') /* “En attente…” */ : $t('imReady') /* “Je suis prêt !” */ }}
    </button>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { connectSocket, sendMessage, setOnMessage } from '../services/websocket';
//import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter();
//const { t } = useI18n();

// Récupère les query params : ?id=<gameId>&playerId=<playerId>
const gameId = (route.query.id as string) || "";
const playerId = (route.query.playerId as string) || "";

// État local
const players = ref<string[]>([]);
const readyPlayers = ref<string[]>([]);
const playersCount = ref<number>(0);
const maxPlayers = ref<number>(2);
const alreadyReady = ref<boolean>(false);
const errorMessage = ref<string|null>(null);

// 1) À la montée, on ouvre la WS et on notifie le back qu’on veut
// rejoindre cette partie (pour voir la liste des joueurs déjà présents).
onMounted(() => {
  if (!gameId || !playerId) {
    errorMessage.value = "Identifiants de partie manquants.";
    return;
  }

  console.log('[WaitingRoom] onMounted : connexion WS et get-players');
  connectSocket('ws://localhost:3002');

  // On envoie un “get-players” pour récupérer la liste actuelle
  sendMessage('get-players', { gameId });

  // On définit le listener qui gère la réponse “player-joined” et “players-ready” et “all-ready”
  setOnMessage((data: any) => {
    console.log('[WaitingRoom] WS onMessage →', data);
    switch (data.type) {
      // Quand un joueur rejoint (ou qu’on a demandé get-players), on met à jour
      case 'player-joined': {
        const { players: newList, playersCount: pc, maxPlayers: mp, gameState } = data.payload;
        players.value = newList;        // ex. ['player1','player2']
        playersCount.value = pc;        // ex. 1 ou 2
        maxPlayers.value = mp;          // ex. 2 ou 4
        // Si gameState.readyPlayers existe, on l’utilise pour pre-remplir
        if (gameState && gameState.readyPlayers) {
          readyPlayers.value = [...gameState.readyPlayers];
        }
        break;
      }
      // Quand le serveur renvoie la liste des joueurs prêts
      case 'players-ready': {
        readyPlayers.value = data.payload.readyPlayers || [];
        if (readyPlayers.value.includes(playerId)) {
          alreadyReady.value = true;
        }
        break;
      }
      // Quand tous les joueurs sont prêts, le serveur envoie “all-ready”
      case 'all-ready': {
        console.log('[WaitingRoom] all-ready reçu, on redirige vers gamemulti-online');
        router.replace({
          name: 'GamemultiOnline',
          query: { id: gameId, playerId }
        });
        break;
      }
      case 'error': {
        errorMessage.value = data.payload.message || 'Erreur serveur.';
        break;
      }
      default:
        console.warn('[WaitingRoom] message WS non géré :', data.type);
        break;
    }
  });
});

// 2) Fonction “Je suis prêt !”
function sayReady() {
  if (!gameId || !playerId) return;
  console.log('[WaitingRoom] sayReady() →', playerId, 'est prêt');
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
  gap: 1rem;
  color: #f8f9fa;
}
h1 {
  font-size: 2rem;
  color: #d4af37;
}
.players-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 200px;
  text-align: left;
}
.players-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  margin-bottom: 0.25rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.25rem;
}
.players-list li.is-me {
  border: 2px solid #d4af37;
}
.btn-ready {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: bold;
}
.btn-ready:disabled {
  background-color: #666;
  cursor: not-allowed;
}
.error-message {
  color: #ff5252;
  margin-top: 0.5rem;
}
</style>
