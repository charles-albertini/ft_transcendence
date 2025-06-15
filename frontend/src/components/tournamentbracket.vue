<template>
	<div class="tournament-container">
	  <!-- Header -->
	  <div class="tournament-header">
		<button @click="goBack" class="back-button">
		  ← Retour à la configuration
		</button>
		<div class="header-content">
		  <h1 class="tournament-title">BRACKET TOURNOI</h1>
		  <p class="tournament-subtitle">Tournoi à élimination directe - 8 Joueurs</p>
		</div>
		<button @click="resetTournament" class="reset-button">
		  🔄 Nouveau Tournoi
		</button>
	  </div>
  
	  <!-- Bracket -->
	  <div class="bracket-container">
		<!-- Côté gauche - Quarts de finale -->
		<div class="bracket-side left-side">
		  <div class="round round-1">
			<div class="match-wrapper" v-for="(match, index) in leftQuarterFinals" :key="'left-qf-' + index">
			  <div class="match">
				<div class="team-container">
				 <div 
					:class="['team', { 'winner': match.team1.isWinner }]"
				  >
					{{ match.team1.name }}
				  </div>
				  <div 
					:class="['team', { 'winner': match.team2.isWinner }]"
				  >
					{{ match.team2.name }}
				  </div>
				</div>
				<div class="connector-right"></div>
			  </div>
			  <!-- Zone d'action avec hauteur fixe -->
			  <div class="action-zone">
				<button 
				  v-if="!match.isCompleted" 
				  @click="launchPongGame(match)"
				  class="play-pong-btn"
				>
				  🏓 Jouer Pong
				</button>
				<div v-else class="match-completed">
				  ✅ Match terminé
				</div>
			  </div>
			</div>
		  </div>
  
		  <!-- Demi-finale gauche -->
		  <div class="round round-2">
			<div class="match-wrapper">
			  <div class="match">
				<div class="team-container">
				  <div 
					:class="['team', { 
					  'winner': leftSemiFinal.team1.isWinner, 
					  'ready-to-play': isMatchReadyToPlay(leftSemiFinal)
					}]"
				  >
					{{ leftSemiFinal.team1.name || 'En attente' }}
				  </div>
				  <div 
					:class="['team', { 
					  'winner': leftSemiFinal.team2.isWinner, 
					  'ready-to-play': isMatchReadyToPlay(leftSemiFinal)
					}]"
				  >
					{{ leftSemiFinal.team2.name || 'En attente' }}
				  </div>
				</div>
				<div class="connector-right"></div>
			  </div>
			  <!-- Zone d'action avec hauteur fixe -->
			  <div class="action-zone">
				<button 
				  v-if="isMatchReadyToPlay(leftSemiFinal)" 
				  @click="launchPongGame(leftSemiFinal)"
				  class="play-pong-btn ready-btn"
				>
				  🏓 Jouer Pong
				</button>
				<div v-else-if="leftSemiFinal.isCompleted" class="match-completed">
				  ✅ Match terminé
				</div>
				<div v-else-if="!canPlaySemiFinal(leftSemiFinal) && (leftSemiFinal.team1.name || leftSemiFinal.team2.name)" class="waiting-message">
				  Terminez tous les quarts de finale
				</div>
			  </div>
			</div>
		  </div>
		</div>
  
		<!-- Centre - Finale -->
		<div class="bracket-center">
		  <div class="final-section">
			<h2 class="final-title">JOUEUR<br>GAGNANT</h2>
			
			<div class="final-match-wrapper">
			  <div class="final-match">
				<div class="team-container final-teams">
				  <div 
					:class="['team final-team', { 
					  'winner': finalMatch.team1.isWinner, 
					  'ready-to-play': isMatchReadyToPlay(finalMatch)
					}]"
				  >
					{{ finalMatch.team1.name || 'En attente' }}
				  </div>
				  <div 
					:class="['team final-team', { 
					  'winner': finalMatch.team2.isWinner, 
					  'ready-to-play': isMatchReadyToPlay(finalMatch)
					}]"
				  >
					{{ finalMatch.team2.name || 'En attente' }}
				  </div>
				</div>
			  </div>
			  <!-- Zone d'action finale avec hauteur fixe -->
			  <div class="action-zone final-action-zone">
				<button 
				  v-if="isMatchReadyToPlay(finalMatch)" 
				  @click="launchPongGame(finalMatch)"
				  class="play-pong-btn final-pong-btn ready-btn"
				>
				  🏓 FINALE PONG
				</button>
				<div v-else-if="finalMatch.isCompleted" class="match-completed">
				  ✅ Finale terminée
				</div>
				<div v-else-if="!canPlayFinal() && (finalMatch.team1.name || finalMatch.team2.name)" class="waiting-message">
				  Terminez toutes les demi-finales
				</div>
			  </div>
			</div>
  
			<!-- Champion avec hauteur fixe -->
			<div class="champion-section">
			  <div v-if="champion" class="champion-content">
				<div class="trophy">🏆</div>
				<div class="champion-name">{{ champion }}</div>
				<div class="champion-subtitle">Champion du Tournoi !</div>
				<button @click="celebrateAndReset" class="celebrate-button">
				  🎉 Nouveau Tournoi
				</button>
			  </div>
			</div>
		  </div>
		</div>
  
		<!-- Côté droit -->
		<div class="bracket-side right-side">
		  <!-- Demi-finale droite -->
		  <div class="round round-2">
			<div class="match-wrapper">
			  <div class="match">
				<div class="connector-left"></div>
				<div class="team-container">
				  <div 
					:class="['team', { 
					  'winner': rightSemiFinal.team1.isWinner, 
					  'ready-to-play': isMatchReadyToPlay(rightSemiFinal)
					}]"
				  >
					{{ rightSemiFinal.team1.name || 'En attente' }}
				  </div>
				  <div 
					:class="['team', { 
					  'winner': rightSemiFinal.team2.isWinner, 
					  'ready-to-play': isMatchReadyToPlay(rightSemiFinal)
					}]"
				  >
					{{ rightSemiFinal.team2.name || 'En attente' }}
				  </div>
				</div>
			  </div>
			  <!-- Zone d'action avec hauteur fixe -->
			  <div class="action-zone">
				<button 
				  v-if="isMatchReadyToPlay(rightSemiFinal)" 
				  @click="launchPongGame(rightSemiFinal)"
				  class="play-pong-btn ready-btn"
				>
				  🏓 Jouer Pong
				</button>
				<div v-else-if="rightSemiFinal.isCompleted" class="match-completed">
				  ✅ Match terminé
				</div>
				<div v-else-if="!canPlaySemiFinal(rightSemiFinal) && (rightSemiFinal.team1.name || rightSemiFinal.team2.name)" class="waiting-message">
				  Terminez tous les quarts de finale
				</div>
			  </div>
			</div>
		  </div>
  
		  <!-- Quarts de finale droite -->
		  <div class="round round-1">
			<div class="match-wrapper" v-for="(match, index) in rightQuarterFinals" :key="'right-qf-' + index">
			  <div class="match">
				<div class="connector-left"></div>
				<div class="team-container">
				  <div 
					:class="['team', { 'winner': match.team1.isWinner }]"
				  >
					{{ match.team1.name }}
				  </div>
				  <div 
					:class="['team', { 'winner': match.team2.isWinner }]"
				  >
					{{ match.team2.name }}
				  </div>
				</div>
			  </div>
			  <!-- Zone d'action avec hauteur fixe -->
			  <div class="action-zone">
				<button 
				  v-if="!match.isCompleted" 
				  @click="launchPongGame(match)"
				  class="play-pong-btn"
				>
				  🏓 Jouer Pong
				</button>
				<div v-else class="match-completed">
				  ✅ Match terminé
				</div>
			  </div>
			</div>
		  </div>
		</div>
	  </div>
  
	  <!-- Instructions -->
	  <div class="instructions">
		<p>🎮 <strong>Instructions :</strong> Cliquez sur "Jouer Pong" pour lancer un match entre deux joueurs</p>
		<p>🏓 <strong>Automatique :</strong> Les vainqueurs avancent automatiquement au tour suivant après chaque match</p>
		<p>⚡ <strong>Nouveau :</strong> Plus besoin de cliquer sur les joueurs - tout se fait automatiquement !</p>
	  </div>
  
	  <!-- Notification de résultat -->
	  <div v-if="lastMatchResult" class="match-result-notification">
		<div class="notification-content">
		  <div class="notification-icon">🏆</div>
		  <div class="notification-text">
			<strong>{{ lastMatchResult.winner }}</strong> a gagné le match !
			<br>
			<small>{{ lastMatchResult.player1 }} {{ lastMatchResult.score1 }} - {{ lastMatchResult.score2 }} {{ lastMatchResult.player2 }}</small>
		  </div>
		  <button @click="dismissNotification" class="dismiss-btn">✕</button>
		</div>
	  </div>
	</div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  
  const router = useRouter()
  const route = useRoute()
  
  interface Team {
	name: string
	isWinner: boolean
  }
  
  interface Match {
	team1: Team
	team2: Team
	isCompleted: boolean
	winner?: Team
	autoAdvance?: boolean
  }
  
  interface MatchResult {
	winner: string
	player1: string
	player2: string
	score1: number
	score2: number
	completed: boolean
  }
  
  // État du tournoi
  const leftQuarterFinals = ref<Match[]>([])
  const rightQuarterFinals = ref<Match[]>([])
  const leftSemiFinal = ref<Match>({
	team1: { name: '', isWinner: false },
	team2: { name: '', isWinner: false },
	isCompleted: false
  })
  const rightSemiFinal = ref<Match>({
	team1: { name: '', isWinner: false },
	team2: { name: '', isWinner: false },
	isCompleted: false
  })
  const finalMatch = ref<Match>({
	team1: { name: '', isWinner: false },
	team2: { name: '', isWinner: false },
	isCompleted: false
  })
  
  // Notification du dernier résultat
  const lastMatchResult = ref<MatchResult | null>(null)
  
  // Intervalle pour vérifier les résultats - FIXED: Proper typing for browser environment
  let resultCheckInterval: ReturnType<typeof setInterval> | null = null
  
  // Navigation et réinitialisation
  const goBack = () => {
	localStorage.removeItem('tournament_state')
	router.push({ 
	  name: 'tournament-setup',
	  query: {}
	})
  }
  
  const resetTournament = () => {
	localStorage.removeItem('tournament_state')
	localStorage.removeItem('tournamentMatchResult')
	const defaultPlayers = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry']
	initializeTournament(defaultPlayers)
  }
  
  // Champion
  const champion = computed(() => {
	if (finalMatch.value.isCompleted) {
	  return finalMatch.value.winner?.name || ''
	}
	return ''
  })
  
  // Statistiques de progression
  const completedQuarterFinals = computed(() => {
	return [...leftQuarterFinals.value, ...rightQuarterFinals.value]
	  .filter(match => match.isCompleted).length
  })
  
  const completedSemiFinals = computed(() => {
	let count = 0
	if (leftSemiFinal.value.isCompleted) count++
	if (rightSemiFinal.value.isCompleted) count++
	return count
  })
  
  // Fonctions de sauvegarde et chargement de l'état
  const saveTournamentState = () => {
	const state = {
	  leftQuarterFinals: leftQuarterFinals.value,
	  rightQuarterFinals: rightQuarterFinals.value,
	  leftSemiFinal: leftSemiFinal.value,
	  rightSemiFinal: rightSemiFinal.value,
	  finalMatch: finalMatch.value,
	  players: route.query.players
	}
	localStorage.setItem('tournament_state', JSON.stringify(state))
  }
  
  const loadTournamentState = () => {
	const saved = localStorage.getItem('tournament_state')
	if (saved) {
	  try {
		const state = JSON.parse(saved)
		
		if (state.leftQuarterFinals && state.rightQuarterFinals) {
		  leftQuarterFinals.value = state.leftQuarterFinals
		  rightQuarterFinals.value = state.rightQuarterFinals
		  leftSemiFinal.value = state.leftSemiFinal || { team1: { name: '', isWinner: false }, team2: { name: '', isWinner: false }, isCompleted: false }
		  rightSemiFinal.value = state.rightSemiFinal || { team1: { name: '', isWinner: false }, team2: { name: '', isWinner: false }, isCompleted: false }
		  finalMatch.value = state.finalMatch || { team1: { name: '', isWinner: false }, team2: { name: '', isWinner: false }, isCompleted: false }
		  return true
		}
	  } catch (e) {
		console.error('Erreur lors du chargement de l\'état du tournoi:', e)
		localStorage.removeItem('tournament_state')
	  }
	}
	return false
  }
  
  // Fonctions de validation
  const canPlaySemiFinal = (semiFinal: Match) => {
	return completedQuarterFinals.value === 4 && 
		   semiFinal.team1.name && 
		   semiFinal.team2.name && 
		   !semiFinal.isCompleted
  }
  
  const canPlayFinal = () => {
	return completedSemiFinals.value === 2 && 
		   finalMatch.value.team1.name && 
		   finalMatch.value.team2.name && 
		   !finalMatch.value.isCompleted
  }
  
  // Vérifier si un match est prêt à être joué
  const isMatchReadyToPlay = (match: Match) => {
	if (match.isCompleted) return false
	
	// Pour les demi-finales
	if (match === leftSemiFinal.value || match === rightSemiFinal.value) {
	  return completedQuarterFinals.value === 4 && match.team1.name && match.team2.name
	}
	
	// Pour la finale
	if (match === finalMatch.value) {
	  return completedSemiFinals.value === 2 && match.team1.name && match.team2.name
	}
	
	return false
  }
  
  // Vérification automatique des résultats de match
  const checkForMatchResults = () => {
	const resultData = localStorage.getItem('tournamentMatchResult')
	if (resultData) {
	  try {
		const result: MatchResult = JSON.parse(resultData)
		
		// Vérifier si ce résultat n'a pas déjà été traité
		if (result.completed && !hasResultBeenProcessed(result)) {
		  processMatchResult(result)
		  
		  // Nettoyer le résultat du localStorage après traitement
		  localStorage.removeItem('tournamentMatchResult')
		}
	  } catch (e) {
		console.error('Erreur lors de la lecture du résultat:', e)
		localStorage.removeItem('tournamentMatchResult')
	  }
	}
  }
  
  // Vérifier si un résultat a déjà été traité
  const hasResultBeenProcessed = (result: MatchResult): boolean => {
	const allMatches = [
	  ...leftQuarterFinals.value,
	  ...rightQuarterFinals.value,
	  leftSemiFinal.value,
	  rightSemiFinal.value,
	  finalMatch.value
	]
	
	// Chercher un match correspondant qui est déjà terminé avec le même gagnant
	return allMatches.some(match => 
	  match.isCompleted &&
	  match.winner?.name === result.winner &&
	  ((match.team1.name === result.player1 && match.team2.name === result.player2) ||
	   (match.team1.name === result.player2 && match.team2.name === result.player1))
	)
  }
  
  // Traiter automatiquement le résultat d'un match
  const processMatchResult = (result: MatchResult) => {
	console.log('Traitement du résultat:', result)
	
	// Trouver le match correspondant
	const allMatches = [
	  ...leftQuarterFinals.value,
	  ...rightQuarterFinals.value,
	  leftSemiFinal.value,
	  rightSemiFinal.value,
	  finalMatch.value
	]
	
	const match = allMatches.find(m => 
	  !m.isCompleted &&
	  ((m.team1.name === result.player1 && m.team2.name === result.player2) ||
	   (m.team1.name === result.player2 && m.team2.name === result.player1))
	)
	
	if (match) {
	  // Déterminer le gagnant
	  if (result.winner === match.team1.name) {
		selectWinnerAutomatically(match, 1, result)
	  } else if (result.winner === match.team2.name) {
		selectWinnerAutomatically(match, 2, result)
	  }
	  
	  // Afficher la notification
	  lastMatchResult.value = result
	  
	  // Masquer la notification après 5 secondes
	  setTimeout(() => {
		if (lastMatchResult.value === result) {
		  lastMatchResult.value = null
		}
	  }, 5000)
	}
  }
  
  // Sélectionner un gagnant automatiquement (sans interaction utilisateur)
  const selectWinnerAutomatically = (match: Match, teamNumber: 1 | 2, result: MatchResult) => {
	if (match.isCompleted) return
  
	console.log(`Sélection automatique du gagnant: ${result.winner}`)
  
	match.team1.isWinner = false
	match.team2.isWinner = false
  
	if (teamNumber === 1) {
	  match.team1.isWinner = true
	  match.winner = match.team1
	} else {
	  match.team2.isWinner = true
	  match.winner = match.team2
	}
  
	match.isCompleted = true
	
	// Avancer automatiquement le vainqueur au tour suivant
	advanceWinner(match)
	
	saveTournamentState()
	
	// Vérifier si c'est la fin du tournoi
	if (finalMatch.value.isCompleted) {
	  checkAutoReset()
	}
  }
  
  // Initialiser le tournoi avec les joueurs
  const initializeTournament = (playerNames: string[]) => {
  
	if (playerNames.length < 8) {
	  playerNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry']
	}
  
	if (loadTournamentState()) {
	  return
	}
	
	leftQuarterFinals.value = [
	  {
		team1: { name: playerNames[0], isWinner: false },
		team2: { name: playerNames[1], isWinner: false },
		isCompleted: false,
		autoAdvance: true
	  },
	  {
		team1: { name: playerNames[2], isWinner: false },
		team2: { name: playerNames[3], isWinner: false },
		isCompleted: false,
		autoAdvance: true
	  }
	]
  
	rightQuarterFinals.value = [
	  {
		team1: { name: playerNames[4], isWinner: false },
		team2: { name: playerNames[5], isWinner: false },
		isCompleted: false,
		autoAdvance: true
	  },
	  {
		team1: { name: playerNames[6], isWinner: false },
		team2: { name: playerNames[7], isWinner: false },
		isCompleted: false,
		autoAdvance: true
	  }
	]
  
	leftSemiFinal.value = {
	  team1: { name: '', isWinner: false },
	  team2: { name: '', isWinner: false },
	  isCompleted: false,
	  autoAdvance: true
	}
  
	rightSemiFinal.value = {
	  team1: { name: '', isWinner: false },
	  team2: { name: '', isWinner: false },
	  isCompleted: false,
	  autoAdvance: true
	}
  
	finalMatch.value = {
	  team1: { name: '', isWinner: false },
	  team2: { name: '', isWinner: false },
	  isCompleted: false
	}
	
	saveTournamentState()
  }
  
  // Lancer le jeu Pong
  const launchPongGame = (match: Match) => {
	saveTournamentState()
	
	router.push({
	  name: 'tournamentgame',
	  query: {
		player1: match.team1.name,
		player2: match.team2.name,
		returnTo: 'tournamentbracket'
	  }
	})
  }
  
  // Avancer le gagnant au tour suivant
  const advanceWinner = (match: Match) => {
	if (!match.winner) return
  
	const leftQFIndex = leftQuarterFinals.value.indexOf(match)
	const rightQFIndex = rightQuarterFinals.value.indexOf(match)
  
	if (leftQFIndex !== -1) {
	  // Quart de finale gauche
	  if (leftQFIndex === 0) {
		leftSemiFinal.value.team1.name = match.winner.name
		leftSemiFinal.value.team1.isWinner = false
	  } else {
		leftSemiFinal.value.team2.name = match.winner.name
		leftSemiFinal.value.team2.isWinner = false
	  }
	} else if (rightQFIndex !== -1) {
	  // Quart de finale droite
	  if (rightQFIndex === 0) {
		rightSemiFinal.value.team1.name = match.winner.name
		rightSemiFinal.value.team1.isWinner = false
	  } else {
		rightSemiFinal.value.team2.name = match.winner.name
		rightSemiFinal.value.team2.isWinner = false
	  }
	} else if (match === leftSemiFinal.value) {
	  // Demi-finale gauche vers finale
	  finalMatch.value.team1.name = match.winner.name
	  finalMatch.value.team1.isWinner = false
	} else if (match === rightSemiFinal.value) {
	  // Demi-finale droite vers finale
	  finalMatch.value.team2.name = match.winner.name
	  finalMatch.value.team2.isWinner = false
	}
	
	saveTournamentState()
  }
  
  // Célébrer et réinitialiser après la finale
  const celebrateAndReset = () => {
	setTimeout(() => {
	  localStorage.removeItem('tournament_state')
	  localStorage.removeItem('tournamentMatchResult')
	  const defaultPlayers = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry']
	  initializeTournament(defaultPlayers)
	}, 1000)
  }
  
  // Réinitialiser automatiquement après la finale
  const checkAutoReset = () => {
	if (finalMatch.value.isCompleted && champion.value) {
	  setTimeout(() => {
		if (finalMatch.value.isCompleted) {
		  localStorage.removeItem('tournament_state')
		  localStorage.removeItem('tournamentMatchResult')
		  initializeTournament(['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'])
		}
	  }, 5000)
	}
  }
  
  // Masquer la notification
  const dismissNotification = () => {
	lastMatchResult.value = null
  }
  
  // Initialisation
  const playersParam = route.query.players as string
  let playerNames: string[] = []
  
  if (!playersParam) {
	playerNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry']
  } else {
	playerNames = playersParam.split(',').filter(name => name.trim() !== '')
	while (playerNames.length < 8) {
	  playerNames.push(`Joueur ${playerNames.length + 1}`)
	}
  }
  
  onMounted(() => {
	initializeTournament(playerNames)
	
	// Démarrer la vérification automatique des résultats
	resultCheckInterval = setInterval(checkForMatchResults, 1000)
	
	// Vérification immédiate au cas où il y aurait déjà un résultat
	checkForMatchResults()
  })
  
  onUnmounted(() => {
	if (resultCheckInterval) {
	  clearInterval(resultCheckInterval)
	}
  })
  </script>
  
  <style scoped>
  .tournament-container {
	min-height: 100vh;
	background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%);
	padding: 2rem;
	font-family: 'Inter', sans-serif;
	position: relative;
  }
  
  .tournament-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 3rem;
	padding: 2rem;
	border: 3px solid #d4af37;
	border-radius: 1rem;
	background: rgba(0, 0, 0, 0.3);
	backdrop-filter: blur(10px);
  }
  
  .header-content {
	text-align: center;
	flex: 1;
  }
  
  .back-button, .reset-button {
	background: #6b7280;
	color: white;
	border: none;
	padding: 0.75rem 1.5rem;
	border-radius: 0.5rem;
	font-weight: bold;
	cursor: pointer;
	transition: all 0.3s ease;
  }
  
  .back-button:hover {
	background: #4b5563;
	transform: translateY(-2px);
  }
  
  .reset-button:hover {
	background: #d4af37;
	color: #1a472a;
	transform: translateY(-2px);
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
  
  .bracket-container {
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	gap: 2rem;
	max-width: 1300px;
	margin: 0 auto;
	padding: 2rem;
	border: 2px solid #d4af37;
	border-radius: 1rem;
	background: rgba(0, 0, 0, 0.2);
	backdrop-filter: blur(10px);
  }
  
  .bracket-side {
	display: flex;
	gap: 3rem;
  }
  
  .left-side {
	justify-content: flex-end;
  }
  
  .right-side {
	justify-content: flex-start;
  }
  
  .round {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
  }
  
  .round-1 {
	min-height: 500px;
	gap: 2rem;
  }
  
  .round-2 {
	min-height: 500px;
	justify-content: center;
  }
  
  .match-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 120px;
	position: relative;
  }
  
  .final-match-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 140px;
	position: relative;
  }
  
  .match {
	display: flex;
	align-items: center;
	position: relative;
  }
  
  .team-container {
	display: flex;
	flex-direction: column;
	gap: 2px;
	position: relative;
  }
  
  .team {
	background: white;
	color: #1a472a;
	padding: 0.75rem 1.5rem;
	border: 2px solid #d4af37;
	font-weight: 600;
	min-width: 150px;
	text-align: center;
	transition: all 0.3s ease;
	/* position */
  }
</style>