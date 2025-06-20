<!-- src/components/JoinGame.vue -->
<template>
  <div class="join-game-container">
    <h1>{{ $t('joinGameTitle') /* "Rejoindre une partie" */ }}</h1>

    <div class="user-info" v-if="username">
      <p>Connecté en tant que: <strong>{{ username }}</strong></p>
    </div>

    <input
      v-model="gameIdValue"
      placeholder="ID de la partie"
      @keyup.enter="tryJoin"
      class="input-game-id"
    />

    <button
      @click="tryJoin"
      :disabled="!gameIdValue.trim() || isJoining"
      class="btn btn-join"
    >
      {{ isJoining ? $t('joining') /* "En cours…" */ : $t('joinGameBtn') /* "Rejoindre" */ }}
    </button>

    <button @click="goBack" class="btn btn-back">
      {{ $t('backBtn') /* "Retour" */ }}
    </button>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  connectSocket,
  sendMessage,
  setOnMessage
} from '../services/websocket';
//import { useI18n } from 'vue-i18n';

const router = useRouter();
//const { t } = useI18n();

const gameIdValue = ref<string>("");
const isJoining = ref<boolean>(false);
const errorMessage = ref<string|null>(null);
let assignedPlayerId: string|null = null;

// Récupération du nom d'utilisateur
const username = ref('');
const parsedUser = JSON.parse(localStorage.getItem('user_data') || '{}');
username.value = parsedUser.username || 'Invité';

// 1) À la montée, on connecte la WS
onMounted(() => {
  console.log('[JoinGame] onMounted : connexion WS…');
  console.log('[JoinGame] Nom d\'utilisateur:', username.value);
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const host     = window.location.host;        // localhost:5000
  connectSocket(`${protocol}://${host}/ws/`);

  setOnMessage((data: any) => {
    console.log('[JoinGame] WS onMessage →', data);
    switch (data.type) {
      case 'join-success': {
        // data.payload = { assignedPlayerId, players, playersCount, maxPlayers, gameState }
        const { assignedPlayerId: pid } = data.payload;
        console.log('[JoinGame] join-success reçu, assignedPlayerId =', pid);
        assignedPlayerId = pid;
        // Redirection dans la waiting room (host=player2 ou player1 déjà en place)
        router.replace({
          name: 'WaitingRoom',
          query: {
            id: gameIdValue.value.trim(),
            playerId: assignedPlayerId
          }
        });
        break;
      }
      case 'game-not-found': {
        console.warn('[JoinGame] game-not-found');
        errorMessage.value = 'Partie introuvable.';
        isJoining.value = false;
        break;
      }
      case 'game-full': {
        console.warn('[JoinGame] game-full');
        errorMessage.value = 'La partie est déjà pleine.';
        isJoining.value = false;
        break;
      }
      default:
        console.warn('[JoinGame] message WS non géré :', data.type);
        break;
    }
  });
});

// 2) Quand le composant est détruit, on ferme la connexion (facultatif)
onUnmounted(() => {
  console.log('[JoinGame] onUnmounted : fermeture WS (pas implémentée)');
  // Si vous voulez vraiment fermer la socket à la sortie, il faut exposer
  // une fonction closeSocket() dans websocket.ts. Ici on ne fait rien.
});

function tryJoin() {
  console.log('[JoinGame] tryJoin() appelé, gameIdValue =', gameIdValue.value);
  console.log('[JoinGame] Nom d\'utilisateur =', username.value);
  if (!gameIdValue.value.trim()) return;

  errorMessage.value = null;
  isJoining.value = true;

  // MODIFICATION: Envoi du nom d'utilisateur avec la requête de join
  sendMessage('join-game', {
    gameId: gameIdValue.value.trim(),
    username: username.value
  });
}

function goBack() {
  router.back();
}
</script>

<style scoped>
.join-game-container {
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
  margin-bottom: 1rem;
}

.user-info {
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
}

.user-info p {
  margin: 0;
  color: #d4af37;
  font-size: 0.9rem;
}

.input-game-id {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  width: 260px;
  border-radius: 0.5rem;
  border: 2px solid #d4af37;
  background-color: rgba(255, 255, 255, 0.9);
  color: #1a1a1a;
}

.input-game-id:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.3);
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  color: white;
  transition: background-color 0.2s ease-in-out;
  min-width: 140px;
}

.btn-join {
  background-color: #4caf50;
}

.btn-join:hover:not(:disabled) {
  background-color: #388e3c;
}

.btn-join:disabled {
  background-color: #666;
  cursor: not-allowed;
}

.btn-back {
  background-color: #f44336;
}

.btn-back:hover {
  background-color: #da190b;
}

.error-message {
  color: #ff5252;
  margin-top: 0.5rem;
  font-size: 0.95rem;
}
</style>