<template>
	<div class="tournament-container" :key="componentKey">
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
  import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
    import { useRoute } from 'vue-router'
  
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
  const componentKey = ref(Date.now())
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
	
	// Utiliser window.location.href pour une navigation plus fiable
	window.location.href = '/tournamentplayer'
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
		selectWinnerAutomatically(match, 1)
	  } else if (result.winner === match.team2.name) {
		selectWinnerAutomatically(match, 2)
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
  const selectWinnerAutomatically = (match: Match, teamNumber: 1 | 2) => {
	if (match.isCompleted) return
  
  
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
  
    // Ne pas charger l'état sauvegardé si on vient avec de nouveaux joueurs
    const shouldLoadSaved = route.query.timestamp ? false : loadTournamentState()
    
	if (shouldLoadSaved) {
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
	
	// Utiliser window.location.href pour une navigation plus fiable
	const gameUrl = `/tournamentgame?player1=${encodeURIComponent(match.team1.name)}&player2=${encodeURIComponent(match.team2.name)}&returnTo=tournamentbracket`
	
	window.location.href = gameUrl
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
  
  // Fonction pour initialiser le tournoi selon les paramètres
  const initializeFromRoute = () => {
    const playersParam = route.query.players as string
    let playerNames: string[] = []
    
    // Forcer une nouvelle clé pour re-rendre le composant
    componentKey.value = Date.now()
    
    if (!playersParam) {
      playerNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry']
    } else {
      playerNames = playersParam.split(',').filter(name => name.trim() !== '')
      while (playerNames.length < 8) {
        playerNames.push(`Joueur ${playerNames.length + 1}`)
      }
    }
    
    
    // Réinitialiser complètement l'état
    resetTournamentState()
    
    initializeTournament(playerNames)
  }
  
  // Fonction pour réinitialiser complètement l'état du tournoi
  const resetTournamentState = () => {
    leftQuarterFinals.value = []
    rightQuarterFinals.value = []
    leftSemiFinal.value = {
      team1: { name: '', isWinner: false },
      team2: { name: '', isWinner: false },
      isCompleted: false
    }
    rightSemiFinal.value = {
      team1: { name: '', isWinner: false },
      team2: { name: '', isWinner: false },
      isCompleted: false
    }
    finalMatch.value = {
      team1: { name: '', isWinner: false },
      team2: { name: '', isWinner: false },
      isCompleted: false
    }
    lastMatchResult.value = null
  }
  
  // Watcher pour les changements de route avec debounce
  let routeWatchTimeout: ReturnType<typeof setTimeout> | null = null
  
  watch(() => route.query.players, () => {
    
    // Nettoyer le timeout précédent
    if (routeWatchTimeout) {
      clearTimeout(routeWatchTimeout)
    }
    
    // Attendre un peu pour éviter les appels multiples rapides
    routeWatchTimeout = setTimeout(() => {
      nextTick(() => {
        initializeFromRoute()
      })
    }, 100)
  }, { immediate: false })
  
  // Watcher pour les changements de route complète (pour détecter toute navigation)
  watch(() => route.fullPath, (newPath) => {
    if (newPath.includes('/tournamentbracket')) {
      nextTick(() => {
        initializeFromRoute()
      })
    }
  }, { immediate: false })
  
  // Initialisation avec vérification de l'état de montage
  onMounted(() => {
    
    nextTick(() => {
      // S'assurer que le composant est complètement monté
      setTimeout(() => {
        initializeFromRoute()
        
        // Démarrer la vérification automatique des résultats
        resultCheckInterval = setInterval(checkForMatchResults, 1000)
        
        // Vérification immédiate au cas où il y aurait déjà un résultat
        checkForMatchResults()
      }, 50)
    })
  })
  
  onUnmounted(() => {
	if (resultCheckInterval) {
	  clearInterval(resultCheckInterval)
	}
	if (routeWatchTimeout) {
	  clearTimeout(routeWatchTimeout)
	}
  })
  </script>
 <style scoped>
.tournament-container {
  height: 100vh;
  background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%);
  background-size: 400% 400%;
  animation: backgroundMove 20s ease infinite;
  padding: 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

@keyframes backgroundMove {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.tournament-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(187, 247, 208, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.tournament-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1.5rem 2rem;
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.header-content {
  text-align: center;
  flex: 1;
}

.back-button, .reset-button {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(107, 114, 128, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.back-button::before, .reset-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s;
}

.back-button:hover::before, .reset-button:hover::before {
  left: 100%;
}

.back-button:hover {
  background: linear-gradient(135deg, #4b5563, #374151);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(107, 114, 128, 0.4);
}

.reset-button:hover {
  background: linear-gradient(135deg, #d4af37, #c19b2e);
  color: #1a472a;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
}

.tournament-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #d4af37;
  margin: 0 0 0.5rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
  font-family: 'Georgia', serif;
}

.tournament-subtitle {
  font-size: 1.1rem;
  color: #e0e0e0;
  margin: 0;
  font-weight: 500;
}

.bracket-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  flex: 1;
  padding: 1.5rem;
  border: 2px solid #d4af37;
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  overflow: hidden;
  position: relative;
  z-index: 1;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 10px 30px rgba(0, 0, 0, 0.2);
}

.bracket-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.03) 0%, transparent 70%);
  pointer-events: none;
}

.bracket-side {
  display: flex;
  gap: 2rem;
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
  min-height: 400px;
  gap: 1.5rem;
}

.round-2 {
  min-height: 400px;
  justify-content: center;
}

.match-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100px;
  position: relative;
}

.final-match-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 120px;
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
  background: rgba(255, 255, 255, 0.9);
  color: #1a472a;
  padding: 0.6rem 1.2rem;
  border: 2px solid #d4af37;
  border-radius: 0.5rem;
  font-weight: 600;
  min-width: 140px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-size: 0.9rem;
  position: relative;
  overflow: hidden;
}

.team::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
  transition: left 0.6s;
}

.team:hover::before {
  left: 100%;
}

.team:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.team.winner {
  background: linear-gradient(135deg, #d4af37, #c19b2e);
  color: #1a472a;
  border-color: #b8941f;
  font-weight: bold;
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.5);
  animation: winnerGlow 2s ease-in-out infinite alternate;
}

@keyframes winnerGlow {
  from { box-shadow: 0 4px 15px rgba(212, 175, 55, 0.5); }
  to { box-shadow: 0 6px 20px rgba(212, 175, 55, 0.7); }
}

.team.ready-to-play {
  background: linear-gradient(135deg, #bbf7d0, #86efac);
  border-color: #10b981;
  animation: readyPulse 2s ease-in-out infinite;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

@keyframes readyPulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  }
  50% { 
    transform: scale(1.02);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
  }
}

.final-teams {
  gap: 4px;
}

.final-team {
  min-width: 160px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
}

.connector-right, .connector-left {
  width: 30px;
  height: 2px;
  background: #d4af37;
  position: relative;
}

.connector-right::after, .connector-left::before {
  content: '';
  position: absolute;
  width: 2px;
  height: 40px;
  background: #d4af37;
  top: 50%;
  transform: translateY(-50%);
}

.connector-right::after {
  right: 0;
}

.connector-left::before {
  left: 0;
}

.bracket-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 200px;
}

.final-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.final-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #d4af37;
  text-align: center;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
}

.action-zone {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
}

.final-action-zone {
  height: 50px;
  margin-top: 0.8rem;
}

.play-pong-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: bold;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.play-pong-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s;
}

.play-pong-btn:hover::before {
  left: 100%;
}

.play-pong-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.final-pong-btn {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background: linear-gradient(135deg, #d4af37, #c19b2e);
  color: #1a472a;
}

.final-pong-btn:hover {
  background: linear-gradient(135deg, #c19b2e, #b8941f);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5);
}

.ready-btn {
  animation: readyGlow 2s ease-in-out infinite alternate;
}

@keyframes readyGlow {
  from { 
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
    transform: scale(1);
  }
  to { 
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.6);
    transform: scale(1.02);
  }
}

.match-completed {
  color: #10b981;
  font-weight: bold;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.waiting-message {
  color: #fbbf24;
  font-size: 0.8rem;
  text-align: center;
  font-style: italic;
}

.champion-section {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
}

.champion-content {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(193, 155, 46, 0.1));
  border: 3px solid #d4af37;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  animation: championVictory 2s ease-in-out infinite;
}

@keyframes championVictory {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 12px 30px rgba(212, 175, 55, 0.5);
  }
}

.trophy {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  animation: trophyBounce 1s ease-in-out infinite;
}

@keyframes trophyBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.champion-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #d4af37;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.champion-subtitle {
  color: #bbf7d0;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.celebrate-button {
  background: linear-gradient(135deg, #d4af37, #c19b2e);
  color: #1a472a;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.celebrate-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s;
}

.celebrate-button:hover::before {
  left: 100%;
}

.celebrate-button:hover {
  background: linear-gradient(135deg, #c19b2e, #b8941f);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.6);
}

.instructions {
  text-align: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 1rem;
  border: 1px solid rgba(212, 175, 55, 0.3);
  backdrop-filter: blur(10px);
  margin-top: 1rem;
  flex-shrink: 0;
}

.instructions p {
  color: #bbf7d0;
  margin: 0.3rem 0;
  font-size: 0.95rem;
}

.instructions p:first-child {
  margin-top: 0;
}

.instructions p:last-child {
  margin-bottom: 0;
}

.match-result-notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1000;
  animation: notificationSlide 0.5s ease-out;
}

@keyframes notificationSlide {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.notification-content {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.9));
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border: 2px solid #10b981;
  display: flex;
  align-items: center;
  gap: 1rem;
  backdrop-filter: blur(10px);
  max-width: 350px;
}

.notification-icon {
  font-size: 2rem;
  animation: bounce 1s ease-in-out infinite;
}

.notification-text {
  flex: 1;
}

.notification-text strong {
  font-size: 1.1rem;
}

.notification-text small {
  opacity: 0.9;
  font-size: 0.85rem;
}

.dismiss-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.dismiss-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>