<template>
	<div class="waiting-room">
	  <!-- Header avec logo -->
	  <header class="header">
		<div class="logo-section">
		  <div class="billiard-ball ball-8-small"></div>
		  <h1 class="logo-text">Pong Billard</h1>
		</div>
	  </header>
  
	  <!-- DEBUG PANEL -->
	  <div class="debug-panel" style="position: fixed; top: 50px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 5px; font-size: 12px; z-index: 1000;">
		<div><strong>DEBUG:</strong></div>
		<div>GameId: {{ gameId }}</div>
		<div>PlayerId: {{ playerId }}</div>
		<div>Players: {{ JSON.stringify(players) }}</div>
		<div>PlayerNames: {{ JSON.stringify(playerNames) }}</div>
		<div>ReadyPlayers: {{ JSON.stringify(readyPlayers) }}</div>
		<div>IsReady: {{ isReady }}</div>
		<div>MaxPlayers: {{ maxPlayers }}</div>
	  </div>
  
	  <!-- Contenu principal -->
	  <main class="main-content">
		<div class="content-container">
		  <!-- En-tête de la page -->
		  <div class="page-header">
			<h1 class="main-title">Salle d'attente</h1>
			<p class="subtitle">En attente de joueurs pour commencer la partie</p>
		  </div>
  
		  <!-- Carte de la partie -->
		  <div class="game-card">
			<div class="game-info">
			  <div class="game-id-section">
				<h3 class="section-title">🎮 ID de la partie</h3>
				<div class="game-id-display">
				  <span class="game-id-value">{{ gameId || 'UNKNOWN' }}</span>
				  <button @click="copyGameId" class="copy-button" :class="{ 'copied': gameIdCopied }">
					<svg v-if="!gameIdCopied" class="copy-icon" fill="currentColor" viewBox="0 0 20 20">
					  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
					  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
					</svg>
					<span v-else">✓</span>
				  </button>
				</div>
			  </div>
			</div>
  
			<!-- Section des joueurs -->
			<div class="players-section">
			  <h3 class="section-title">👥 Joueurs connectés ({{ players.length }}/{{ maxPlayers }})</h3>
			  
			  <ul class="players-list">
				<li v-for="p in players" :key="p" class="player-item">
				  {{ getPlayerDisplayName(p) }}
				  <span v-if="p === playerId" class="current-user-badge">(Vous)</span>
				  <span v-if="readyPlayers.includes(p)" class="ready-check">✓ Prêt</span>
				</li>
			  </ul>
			</div>
  
			<!-- Bouton Prêt - TOUJOURS VISIBLE POUR DEBUG -->
			<div class="ready-section">
			  <div class="debug-info" style="margin-bottom: 1rem; font-size: 0.9rem; color: #ccc;">
				Debug: players.length={{ players.length }}, condition={{ players.length >= 2 }}
			  </div>
			  <button 
				@click="onReady" 
				:disabled="isReady" 
				class="btn-ready"
				:class="{ 'ready': isReady }"
			  >
				<svg v-if="!isReady" class="btn-icon" fill="currentColor" viewBox="0 0 20 20">
				  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
				</svg>
				<div v-else class="loading-spinner"></div>
				{{ isReady ? 'En attente des autres joueurs...' : 'Je suis prêt !' }}
			  </button>
			  <p class="ready-info">{{ readyPlayers.length }}/{{ players.length }} joueurs prêts</p>
			</div>
  
			<!-- Message de statut -->
			<div class="status-message">
			  <div v-if="players.length < maxPlayers" class="waiting-message">
				<p>En attente de {{ maxPlayers - players.length }} joueur(s) supplémentaire(s)...</p>
				<p class="instruction-text">Partagez l'ID de la partie avec vos amis pour qu'ils puissent vous rejoindre</p>
			  </div>
			  <div v-else-if="players.length >= maxPlayers && readyPlayers.length < players.length" class="almost-ready-message">
				<div class="ready-icon">⏳</div>
				<p>Tous les joueurs sont connectés !</p>
				<p class="instruction-text">En attente que tous les joueurs soient prêts...</p>
			  </div>
			  <div v-else-if="readyPlayers.length === players.length && players.length >= maxPlayers" class="all-ready-message">
				<div class="ready-icon">🎉</div>
				<p>Tous les joueurs sont prêts !</p>
				<p class="instruction-text">La partie va commencer dans quelques secondes...</p>
			  </div>
			</div>
		  </div>
		</div>
	  </main>
  
	  <!-- Bouton retour en bas de page -->
	  <footer class="footer">
		<button @click="goBack" class="back-button">
		  <svg class="back-icon" fill="currentColor" viewBox="0 0 20 20">
			<path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
		  </svg>
		  Quitter la partie
		</button>
	  </footer>
  
	  <!-- Décoration avec boules de billard -->
	  <div class="billiard-decoration">
		<div class="billiard-ball ball-1 floating" style="top: 15%; left: 8%;"></div>
		<div class="billiard-ball ball-2 floating" style="top: 25%; right: 12%;"></div>
		<div class="billiard-ball ball-3 floating" style="top: 60%; left: 5%;"></div>
		<div class="billiard-ball ball-4 floating" style="top: 70%; right: 8%;"></div>
		<div class="billiard-ball ball-5 floating" style="top: 40%; left: 3%;"></div>
		<div class="billiard-ball ball-1 floating" style="top: 80%; right: 15%;"></div>
	  </div>
	</div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { connectSocket, sendMessage, setOnMessage } from '../services/websocket';
  
  const route = useRoute();
  const router = useRouter();
  const gameId = (route.query.id as string) || '';
  const playerId = (route.query.playerId as string) || '';
  
  // Si pas de paramètres, rediriger
  if (!gameId || !playerId) {
	console.error('[WaitingRoom] Paramètres manquants, redirection');
	router.replace({ name: 'Home' });
  }
  
  // État simple comme l'ancienne version
  const players = ref<string[]>([]);
  const readyPlayers = ref<string[]>([]);
  const isReady = ref(false);
  const maxPlayers = ref<number>(2);
  const gameIdCopied = ref(false);
  const playerNames = ref<Record<string, string>>({});
  
  function getPlayerDisplayName(pid: string): string {
	return playerNames.value[pid] || `Joueur ${pid.slice(-1)}`;
  }
  
  onMounted(() => {
	console.log('[WaitingRoom] ===== DÉMARRAGE =====');
	console.log('[WaitingRoom] GameId:', gameId);
	console.log('[WaitingRoom] PlayerId:', playerId);
	
	const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
	const host = window.location.host;
	connectSocket(`${protocol}://${host}/ws/`);
  
	setOnMessage((data: any) => {
	  console.log('[WaitingRoom] ===== MESSAGE REÇU =====');
	  console.log('[WaitingRoom] Type:', data.type);
	  console.log('[WaitingRoom] Payload complet:', JSON.stringify(data.payload, null, 2));
	  
	  switch (data.type) {
		case 'player-joined':
		  console.log('[WaitingRoom] TRAITEMENT PLAYER-JOINED');
		  handlePlayerUpdate(data.payload);
		  break;
		  
		case 'join-success':
		  console.log('[WaitingRoom] TRAITEMENT JOIN-SUCCESS');
		  handlePlayerUpdate(data.payload);
		  break;
		  
		case 'player-ready-updated':
		  console.log('[WaitingRoom] TRAITEMENT PLAYER-READY-UPDATED');
		  if (data.payload.readyPlayers) {
			console.log('[WaitingRoom] Nouveaux readyPlayers:', data.payload.readyPlayers);
			readyPlayers.value = [...data.payload.readyPlayers];
			isReady.value = readyPlayers.value.includes(playerId);
			console.log('[WaitingRoom] IsReady mis à jour:', isReady.value);
		  }
		  break;
		  
		case 'all-ready':
		  console.log('[WaitingRoom] ALL-READY - Démarrage de la partie');
		  router.push({
			name: 'GamemultiOnline',
			query: { id: gameId, playerId }
		  });
		  break;
		  
		case 'game-start':
		  console.log('[WaitingRoom] GAME-START - Redirection');
		  router.push({
			name: 'GamemultiOnline',
			query: { id: gameId, playerId }
		  });
		  break;
		  
		case 'error':
		  console.error('[WaitingRoom] Erreur:', data.payload.message);
		  break;
		  
		default:
		  console.log('[WaitingRoom] Type non géré:', data.type);
		  break;
	  }
	  
	  console.log('[WaitingRoom] ===== ÉTAT APRÈS TRAITEMENT =====');
	  console.log('[WaitingRoom] players:', players.value);
	  console.log('[WaitingRoom] playerNames:', playerNames.value);
	  console.log('[WaitingRoom] readyPlayers:', readyPlayers.value);
	  console.log('[WaitingRoom] isReady:', isReady.value);
	  console.log('[WaitingRoom] maxPlayers:', maxPlayers.value);
	  console.log('[WaitingRoom] ========================================');
	});
  
	// Petite pause avant de demander l'état pour s'assurer que la WS est prête
	setTimeout(() => {
	  console.log('[WaitingRoom] Demande get-players...');
	  sendMessage('get-players', { gameId });
	}, 100);
  });
  
  function handlePlayerUpdate(payload: any) {
	console.log('[WaitingRoom] handlePlayerUpdate appelé avec:', payload);
	
	// Mise à jour des joueurs
	if (payload.players && Array.isArray(payload.players)) {
	  console.log('[WaitingRoom] Mise à jour players:', payload.players);
	  players.value = [...payload.players]; // Copie pour forcer la réactivité
	}
	
	// Mise à jour des noms
	if (payload.playerNames && typeof payload.playerNames === 'object') {
	  console.log('[WaitingRoom] Mise à jour playerNames:', payload.playerNames);
	  playerNames.value = { ...payload.playerNames }; // Copie pour forcer la réactivité
	}
	
	// Mise à jour des joueurs prêts
	if (payload.readyPlayers && Array.isArray(payload.readyPlayers)) {
	  console.log('[WaitingRoom] Mise à jour readyPlayers:', payload.readyPlayers);
	  readyPlayers.value = [...payload.readyPlayers];
	  isReady.value = readyPlayers.value.includes(playerId);
	}
	
	// Mise à jour du nombre max de joueurs
	if (payload.maxPlayers) {
	  console.log('[WaitingRoom] Mise à jour maxPlayers:', payload.maxPlayers);
	  maxPlayers.value = payload.maxPlayers;
	}
	
	console.log('[WaitingRoom] Après handlePlayerUpdate:');
	console.log('[WaitingRoom] - players.value:', players.value);
	console.log('[WaitingRoom] - playerNames.value:', playerNames.value);
	console.log('[WaitingRoom] - readyPlayers.value:', readyPlayers.value);
	console.log('[WaitingRoom] - isReady.value:', isReady.value);
  }
  
  onUnmounted(() => {
	console.log('[WaitingRoom] Nettoyage onUnmounted');
  });
  
  function onReady() {
	if (isReady.value) {
	  console.log('[WaitingRoom] Déjà prêt, ignorer');
	  return;
	}
	console.log('[WaitingRoom] ===== BOUTON PRÊT CLIQUÉ =====');
	console.log('[WaitingRoom] GameId:', gameId);
	console.log('[WaitingRoom] PlayerId:', playerId);
	sendMessage('player-ready', { gameId, playerId });
	console.log('[WaitingRoom] Message player-ready envoyé');
  }
  
  function goBack() {
	// 🚨 AJOUT: Notifier le serveur de la déconnexion volontaire
	if (gameId && playerId) {
	  sendMessage('player-disconnect', { 
		gameId, 
		playerId,
		reason: 'left_waiting_room' // Quitté la salle d'attente
	  });
	}
	
	router.push({ name: 'CreateOrJoin' });
  }
  
  async function copyGameId() {
	if (!gameId) return;
	
	try {
	  await navigator.clipboard.writeText(gameId);
	  gameIdCopied.value = true;
	  setTimeout(() => {
		gameIdCopied.value = false;
	  }, 2000);
	} catch (err) {
	  console.error('Erreur lors de la copie:', err);
	}
  }
  </script>
  
  <style scoped>
  .waiting-room {
	min-height: 100vh;
	background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%);
	color: #f8f9fa;
	position: relative;
	overflow-x: hidden;
	display: flex;
	flex-direction: column;
  }
  
  .header {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding: 1rem 2rem;
	background: rgba(0, 0, 0, 0.3);
	backdrop-filter: blur(10px);
	border-bottom: 1px solid rgba(212, 175, 55, 0.3);
	position: relative;
	z-index: 10;
  }
  
  .logo-section {
	display: flex;
	align-items: center;
	gap: 1rem;
  }
  
  .logo-text {
	font-size: 1.8rem;
	font-weight: bold;
	color: #d4af37;
	margin: 0;
	text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .main-content {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	position: relative;
	z-index: 2;
  }
  
  .content-container {
	max-width: 800px;
	width: 100%;
  }
  
  .page-header {
	text-align: center;
	margin-bottom: 2rem;
  }
  
  .main-title {
	font-size: 3rem;
	font-weight: bold;
	color: #d4af37;
	margin-bottom: 0.5rem;
	text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  .subtitle {
	font-size: 1.2rem;
	color: #e0e0e0;
	margin-bottom: 1.5rem;
	opacity: 0.9;
  }
  
  .game-card {
	background: rgba(0, 0, 0, 0.4);
	backdrop-filter: blur(15px);
	border: 2px solid rgba(212, 175, 55, 0.3);
	border-radius: 1.5rem;
	padding: 2rem;
	margin-bottom: 2rem;
  }
  
  .game-info {
	margin-bottom: 2rem;
  }
  
  .section-title {
	color: #d4af37;
	font-size: 1.2rem;
	font-weight: 600;
	margin-bottom: 1rem;
	text-align: center;
  }
  
  .game-id-section {
	text-align: center;
	margin-bottom: 2rem;
  }
  
  .game-id-display {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	margin-top: 0.5rem;
  }
  
  .game-id-value {
	font-family: monospace;
	font-size: 1.5rem;
	font-weight: bold;
	color: #d4af37;
	background: rgba(0, 0, 0, 0.3);
	padding: 0.75rem 1.5rem;
	border-radius: 0.5rem;
	border: 1px solid rgba(212, 175, 55, 0.3);
  }
  
  .copy-button {
	background: rgba(212, 175, 55, 0.1);
	border: 1px solid #d4af37;
	border-radius: 0.5rem;
	color: #d4af37;
	padding: 0.75rem;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
  }
  
  .copy-button:hover {
	background: rgba(212, 175, 55, 0.2);
	transform: translateY(-2px);
  }
  
  .copy-button.copied {
	background: rgba(16, 185, 129, 0.2);
	border-color: #10b981;
	color: #10b981;
  }
  
  .copy-icon {
	width: 20px;
	height: 20px;
  }
  
  .players-section {
	margin-bottom: 2rem;
  }
  
  .players-list {
	list-style: none;
	padding: 0;
	margin: 1rem 0;
  }
  
  .player-item {
	font-size: 1.2rem;
	padding: 1rem;
	margin-bottom: 0.5rem;
	background: rgba(255, 255, 255, 0.05);
	border: 2px solid rgba(212, 175, 55, 0.2);
	border-radius: 0.5rem;
	display: flex;
	align-items: center;
	gap: 1rem;
	color: #f8f9fa;
  }
  
  .current-user-badge {
	font-size: 0.8rem;
	background: #d4af37;
	color: #1a1a1a;
	padding: 0.25rem 0.5rem;
	border-radius: 0.25rem;
	font-weight: bold;
	text-transform: uppercase;
	letter-spacing: 0.5px;
  }
  
  .ready-check {
	color: #4caf50;
	margin-left: auto;
	font-weight: bold;
  }
  
  .ready-section {
	text-align: center;
	margin-bottom: 2rem;
	padding: 1.5rem;
	background: rgba(212, 175, 55, 0.1);
	border-radius: 1rem;
	border: 1px solid rgba(212, 175, 55, 0.3);
  }
  
  .btn-ready {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
	width: 100%;
	max-width: 300px;
	margin: 0 auto 1rem auto;
	padding: 1rem 2rem;
	background: linear-gradient(135deg, #d4af37, #c19b2e);
	color: #1a1a1a;
	border: none;
	border-radius: 0.75rem;
	font-size: 1.1rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	text-transform: uppercase;
	letter-spacing: 0.5px;
  }
  
  .btn-ready:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
	background: linear-gradient(135deg, #f4d03f, #d4af37);
  }
  
  .btn-ready:disabled {
	background: rgba(109, 109, 109, 0.5);
	color: rgba(255, 255, 255, 0.7);
	cursor: not-allowed;
	transform: none;
	box-shadow: none;
  }
  
  .btn-ready.ready {
	background: rgba(34, 197, 94, 0.8);
	color: white;
  }
  
  .btn-icon {
	width: 20px;
	height: 20px;
  }
  
  .loading-spinner {
	width: 20px;
	height: 20px;
	border: 2px solid transparent;
	border-top: 2px solid currentColor;
	border-radius: 50%;
	animation: spin 1s linear infinite;
  }
  
  .ready-info {
	margin: 0;
	color: #d4af37;
	font-weight: 600;
	font-size: 0.9rem;
  }
  
  .status-message {
	text-align: center;
	padding: 1.5rem;
	margin-bottom: 2rem;
  }
  
  .waiting-message, .almost-ready-message, .all-ready-message {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
  }
  
  .waiting-message p, .almost-ready-message p, .all-ready-message p {
	margin: 0;
	font-size: 1.1rem;
	color: #e0e0e0;
  }
  
  .all-ready-message p {
	color: #22c55e;
	font-weight: 600;
  }
  
  .instruction-text {
	font-size: 0.9rem !important;
	color: rgba(255, 255, 255, 0.7) !important;
	font-style: italic;
  }
  
  .ready-icon {
	font-size: 3rem;
	animation: bounce 1s infinite;
  }
  
  .footer {
	padding: 2rem;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	z-index: 10;
  }
  
  .back-button {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	background: rgba(239, 68, 68, 0.1);
	border: 2px solid #ef4444;
	border-radius: 0.5rem;
	color: #ef4444;
	padding: 0.75rem 1.5rem;
	cursor: pointer;
	transition: all 0.3s ease;
	font-weight: 600;
	font-size: 1rem;
	backdrop-filter: blur(10px);
  }
  
  .back-button:hover {
	background: rgba(239, 68, 68, 0.2);
	transform: translateY(-2px);
	box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
  }
  
  .back-icon {
	width: 20px;
	height: 20px;
  }
  
  .billiard-decoration {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	pointer-events: none;
	z-index: 1;
  }
  
  .billiard-ball {
	position: absolute;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .ball-8-small {
	width: 40px;
	height: 40px;
	background-color: #000;
	border-radius: 50%;
	position: relative;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .ball-8-small::after {
	content: "8";
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	color: white;
	font-weight: bold;
	font-size: 18px;
  }
  
  .ball-1 { background-color: #ffeb3b; }
  .ball-2 { background-color: #2196f3; }
  .ball-3 { background-color: #f44336; }
  .ball-4 { background-color: #9c27b0; }
  .ball-5 { background-color: #ff9800; }
  
  .floating {
	animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
	0%, 100% { transform: translateY(0px) rotate(0deg); }
	50% { transform: translateY(-20px) rotate(180deg); }
  }
  
  @keyframes bounce {
	0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
	40%, 43% { transform: translateY(-10px); }
	70% { transform: translateY(-5px); }
	90% { transform: translateY(-2px); }
  }
  
  @keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
	.header {
	  padding: 1rem;
	}
	
	.logo-text {
	  font-size: 1.5rem;
	}
	
	.main-content {
	  padding: 1rem;
	}
	
	.main-title {
	  font-size: 2.5rem;
	}
	
	.game-card {
	  padding: 1.5rem;
	}
	
	.game-id-display {
	  flex-direction: column;
	  gap: 1rem;
	}
	
	.btn-ready {
	  font-size: 1rem;
	  padding: 0.875rem 1.5rem;
	}
  }
  
  @media (max-width: 480px) {
	.main-title {
	  font-size: 2rem;
	}
	
	.game-card {
	  padding: 1rem;
	}
	
	.logo-text {
	  font-size: 1.2rem;
	}
	
	.back-button {
	  padding: 0.5rem 1rem;
	  font-size: 0.9rem;
	}
	
	.game-id-value {
	  font-size: 1.2rem;
	  padding: 0.5rem 1rem;
	}
	
	.btn-ready {
	  font-size: 0.9rem;
	  padding: 0.75rem 1.25rem;
	}
	
	.ready-section {
	  padding: 1rem;
	}
  }
  </style>