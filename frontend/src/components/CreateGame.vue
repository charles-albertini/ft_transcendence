<!-- src/components/CreateGame.vue -->
<template>
  <div class="create-container">
    <h1>{{ $t('createGameTitle') /* “Créer une partie en ligne” */ }}</h1>

    <!-- Tant que la partie n'est pas créée, on affiche le formulaire -->
    <div v-if="!gameId">
      <label for="playersCount">
        {{ $t('choosePlayersCount') /* “Nombre de joueurs” */ }}
      </label>
      <select
        id="playersCount"
        v-model="playersCount"
        class="select-count"
      >
        <option :value="2">2 {{ $t('players') }}</option>
        <option :value="4">4 {{ $t('players') }}</option>
      </select>
      <button @click="create" class="btn btn-create">
        {{ $t('createBtn') /* “Créer” */ }}
      </button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>

    <!-- Une fois la partie créée, on propose d'entrer dans le salon -->
    <div v-else class="created-info">
      <p>
        {{ $t('gameCreatedId') /* “Partie créée ! ID :” */ }}
        <strong>{{ gameId }}</strong>
      </p>
      <button @click="goWaiting" class="btn btn-waiting">
        {{ $t('goToWaiting') /* “Aller au salon” */ }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const playersCount = ref<number>(2)
const gameId       = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

// Référence au WebSocket en cours
let socket: WebSocket | null = null

/**
 * Construit l’URL WS/WSS en fonction du protocole et du port actuel
 * (ex. wss://localhost:8443/ws/ ou ws://localhost:8080/ws/)
 */
function getWsUrl(): string {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  const host     = window.location.host      // "localhost:8443" ou "192.168.1.6:8443"
  return `${protocol}://${host}/ws/`
}

/**
 * Gère les messages entrants pour récupérer l'ID de partie ou l'erreur
 */
function handleMessage(evt: MessageEvent) {
  const msg = JSON.parse(evt.data)
  if (msg.type === 'game-created') {
    gameId.value = msg.payload.gameId
  }
  else if (msg.type === 'error') {
    errorMessage.value = msg.payload.message || t('unknownError')
  }
}

/**
 * Au clic sur “Créer”, on ouvre le WS si besoin et on envoie create-game
 */
function create() {
  errorMessage.value = null

  // Si pas encore de socket, ou fermée, on en crée une nouvelle
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(getWsUrl())

    // Dès que la connexion est établie, on envoie notre demande
    socket.addEventListener('open', () => {
      console.log('[CreateGame] WS ouvert, envoi create-game')
      const payload = {
        type: 'create-game',
        payload: { maxPlayers: playersCount.value }
      }
      socket!.send(JSON.stringify(payload))
    })

    socket.addEventListener('message', handleMessage)
    socket.addEventListener('error', (err) => {
      console.error('[CreateGame] Erreur WS', err)
      errorMessage.value = t('wsConnectionError')
    })
  }
  // Si déjà ouvert, on peut renvoyer immédiatement
  else if (socket.readyState === WebSocket.OPEN) {
    console.log('[CreateGame] WS déjà ouvert, envoi create-game direct')
    const payload = {
      type: 'create-game',
      payload: { maxPlayers: playersCount.value }
    }
    socket.send(JSON.stringify(payload))
  }
  // Si en cours de connexion, on réessaye à l'ouverture
  else {
    socket.addEventListener('open', () => {
      const payload = {
        type: 'create-game',
        payload: { maxPlayers: playersCount.value }
      }
      socket!.send(JSON.stringify(payload))
    }, { once: true })
  }
}

/**
 * Une fois gameId connu, on redirige vers la salle d'attente
 */
function goWaiting() {
  if (!gameId.value) return
  router.push({
    name: 'WaitingRoom',
    query: {
      id:       gameId.value,
      playerId: 'player1'  // l’hôte
    }
  })
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
  transition: background-color 0.2s;
  color: white;
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
