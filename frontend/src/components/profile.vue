<template>
	<div class="profile min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 py-10">
	  <div class="container mx-auto px-4">
		<!-- État de chargement -->
		<div v-if="isLoadingData" class="text-center py-20">
		  <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto"></div>
		  <p class="text-white mt-4 text-xl">{{ $t('loading') }}...</p>
		</div>

		<!-- Contenu principal -->
		<div v-else>
		  <h1 class="text-4xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
			{{ $t('profileTitle') }} {{ username }}
		  </h1>
		  
		  <!-- Section principale du profil -->
		  <div class="profile-container bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-yellow-500/30 shadow-2xl">
			<div class="avatar-section">
			  <div class="avatar-wrapper">
				<img :src="avatar" alt="Avatar" class="avatar" />
				<div class="level-badge">
				  <BillardBall :number="level" :size="32" />
				</div>
				<div class="pong-indicator">
				  <div class="paddle"></div>
				  <div class="ball"></div>
				</div>
			  </div>
			  <button @click="changeAvatar" class="btn mt-4">
				{{ $t('changeAvatar') }}
			  </button>
			  <div class="player-rank">
				<span class="rank-label">{{ $t('rank') }}</span>
				<span class="rank-value">{{ playerRank }}</span>
			  </div>
			</div>
			
			<div class="info-section">
			  <div class="info-row">
				<span class="label">{{ $t('username') }}:</span>
				<input 
				  v-model="username" 
				  type="text" 
				  class="input-field"
				  :placeholder="$t('enterUsername')"
				  readonly
				/>
			  </div>
			  
			  <div class="info-row">
				<span class="label">{{ $t('level') }}:</span>
				<div class="level-display">
				  <span class="value">{{ level }}</span>
				  <div class="level-progress">
					<div class="progress-bar" :style="{ width: levelProgress + '%' }"></div>
				  </div>
				  <span class="level-text">{{ experienceText }}</span>
				</div>
			  </div>
			  
			  <div class="info-row">
				<span class="label">{{ $t('pongRating') }}:</span>
				<div class="rating-display">
				  <span class="rating-value">{{ pongStats.rating }}</span>
				  <div class="rating-stars">
					<span v-for="star in ratingStars" :key="star" class="star">⭐</span>
				  </div>
				</div>
			  </div>

			  <div class="info-row">
				<span class="label">{{ $t('status') }}:</span>
				<span class="status online">{{ $t('online') }}</span>
			  </div>

			  <div class="info-row">
				<span class="label">{{ $t('memberSince') }}:</span>
				<span class="value">{{ formatDate(memberSince) }}</span>
			  </div>

			  <div class="info-row">
				<span class="label">{{ $t('title') }}:</span>
				<span class="value title-badge">{{ playerTitle }}</span>
			  </div>
			</div>
		  </div>
		  
		  <!-- Statistiques Pong -->
		  <div class="stats mt-10">
			<h2 class="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
			  {{ $t('pongStatistics') }}
			</h2>
			
			<!-- Statistiques principales -->
			<div class="stats-grid mb-8">
			  <div class="stat-card">
				<div class="stat-icon">🎮</div>
				<h3>{{ $t('matchesPlayed') }}</h3>
				<div class="stat-value">{{ pongStats.matchesPlayed }}</div>
			  </div>
			  <div class="stat-card">
				<div class="stat-icon">🏆</div>
				<h3>{{ $t('victories') }}</h3>
				<div class="stat-value">{{ pongStats.victories }}</div>
				<div class="stat-subtitle">{{ pongStats.matchesPlayed - pongStats.victories }} défaites</div>
			  </div>
			  <div class="stat-card">
				<div class="stat-icon">📊</div>
				<h3>{{ $t('winRate') }}</h3>
				<div class="stat-value">{{ winRatePercentage }}%</div>
			  </div>
			  <div class="stat-card">
				<div class="stat-icon">⚡</div>
				<h3>{{ $t('rating') }}</h3>
				<div class="stat-value">{{ pongStats.rating }}</div>
			  </div>
			</div>

			<!-- Historique des matches et Évolution du Winrate -->
			<div class="charts-section">
			  <!-- Historique des matches détaillé -->
			  <div class="chart-container match-history-extended">
				<h3 class="chart-title">📋 {{ $t('matchHistory') }}</h3>
				<div class="history-list" v-if="pongMatchHistory.length > 0">
				  <div 
					v-for="match in pongMatchHistory" 
					:key="match.id"
					class="match-item"
				  >
					<div class="match-result">
					  <div :class="['result-indicator', match.won ? 'win' : 'loss']">
						{{ match.won ? 'V' : 'D' }}
					  </div>
					</div>
					<div class="match-details">
					  <div class="match-score">
						{{ match.playerScore }} - {{ match.opponentScore }}
					  </div>
					  <div class="match-info">
						<span class="match-opponent">vs {{ match.opponent }}</span>
						<span class="match-duration">{{ match.duration }}</span>
					  </div>
					  <div class="match-stats">
						<span class="match-date">{{ formatDate(match.date) }}</span>
					  </div>
					</div>
					<div class="match-points">
					  <span class="points-earned">+{{ match.pointsEarned }}</span>
					  <div class="match-rating">
						<span class="rating-change" :class="match.ratingChange >= 0 ? 'positive' : 'negative'">
						  {{ match.ratingChange >= 0 ? '+' : '' }}{{ match.ratingChange }}
						</span>
					  </div>
					</div>
				  </div>
				</div>
				<!-- Message quand aucun historique -->
				<div v-else class="no-history">
				  <div class="no-history-icon">🎮</div>
				  <h4 class="no-history-title">Aucun match joué</h4>
				  <p class="no-history-text">Commencez à jouer pour voir votre historique !</p>
				  <router-link 
					to="/game" 
					class="btn-play-now"
				  >
					🏓 Jouer maintenant
				  </router-link>
				</div>
			  </div>

			  <!-- Diagramme d'évolution du Winrate -->
			  <div class="chart-container">
				<h3 class="chart-title">{{ $t('winrateEvolution') }}</h3>
				<div class="winrate-chart">
				  <div class="chart-area">
					<svg class="winrate-svg" viewBox="0 0 400 200">
					  <!-- Grille de fond -->
					  <defs>
						<pattern id="winrate-grid" width="40" height="20" patternUnits="userSpaceOnUse">
						  <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#374151" stroke-width="1" opacity="0.3"/>
						</pattern>
					  </defs>
					  <rect width="400" height="200" fill="url(#winrate-grid)" />
					  
					  <!-- Ligne de 50% (ligne de référence) -->
					  <line x1="0" y1="100" x2="400" y2="100" stroke="#6b7280" stroke-width="1" stroke-dasharray="5,5" opacity="0.5"/>
					  
					  <!-- Aire sous la courbe -->
					  <path
						:d="winrateAreaPath"
						fill="url(#winrateGradient)"
						opacity="0.3"
					  />
					  
					  <!-- Ligne de winrate -->
					  <polyline
						:points="winrateLinePoints"
						fill="none"
						stroke="#d4af37"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
					  />
					  
					  <!-- Points de données -->
					  <circle
						v-for="(point, index) in winratePoints"
						:key="index"
						:cx="point.x"
						:cy="point.y"
						r="4"
						fill="#d4af37"
						stroke="#ffffff"
						stroke-width="2"
					  />
					  
					  <!-- Dégradé pour l'aire -->
					  <defs>
						<linearGradient id="winrateGradient" x1="0%" y1="0%" x2="0%" y2="100%">
						  <stop offset="0%" style="stop-color:#d4af37;stop-opacity:0.8" />
						  <stop offset="100%" style="stop-color:#d4af37;stop-opacity:0.1" />
						</linearGradient>
					  </defs>
					</svg>
				  </div>
				  <div class="chart-labels">
					<span v-for="(data, index) in winrateHistory" :key="index" class="chart-label">
					  {{ formatShortDate(data.date) }}
					</span>
				  </div>
				  <div class="chart-legend">
					<div class="legend-item">
					  <div class="legend-color" style="background-color: #d4af37;"></div>
					  <span>{{ $t('winRate') }}</span>
					</div>
					<div class="current-winrate">
					  {{ $t('current') }}: {{ winRatePercentage }}%
					</div>
				  </div>
				</div>
			  </div>
			</div>
		  </div>

		  <!-- Boutons d'action -->
		  <div class="flex justify-center gap-4 mt-8">
			<router-link 
			  to="/game" 
			  class="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
			>
			  🏓 {{ $t('playPong') }}
			</router-link>
			<button 
			  @click="exportStats" 
			  class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
			>
			  📊 {{ $t('exportStats') }}
			</button>
			<router-link 
			  to="/" 
			  class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
			>
			  🏠 {{ $t('backToHome') }}
			</router-link>
		  </div>
		</div>
	  </div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BillardBall from './BillardBall.vue'
import { useAuth } from '../composable/useAuths';
import { useUser } from '../composable/useUser';
import { useRouter } from 'vue-router';
import { userApi } from '../services/userAPI.ts';

const { t } = useI18n()
const { user: currentUser, isAuthenticated } = useAuth();
const { fetchUser, fetchHistory, isLoading, error } = useUser();
const router = useRouter();

// État local avec la Composition API
const username = ref('')
const level = ref(1)
const avatar = ref('https://via.placeholder.com/150x150/d4af37/000000?text=🏓')
const memberSince = ref(new Date())

// Données backend réelles
const userProfile = ref(null)
const matchHistory = ref([])
const isLoadingData = ref(true)

// Statistiques Pong calculées à partir des vraies données
const pongStats = ref({
  matchesPlayed: 0,
  victories: 0,
  rating: 1000,
  avgReactionTime: 200, // Valeur par défaut
  accuracy: 0,
  longestRally: 0,
  ballControl: 50, // Valeurs simulées pour le moment
  defensivePlay: 50,
  aggressivePlay: 50,
  totalPlayTime: 0
})

// Computed properties
const winRatePercentage = computed(() => {
  return pongStats.value.matchesPlayed > 0 ? Math.round((pongStats.value.victories / pongStats.value.matchesPlayed) * 100) : 0
})

const levelProgress = computed(() => {
  const baseMatches = (level.value - 1) * 10
  const currentMatches = pongStats.value.matchesPlayed
  const progressInLevel = currentMatches - baseMatches
  return Math.min((progressInLevel / 10) * 100, 100)
})

const experienceText = computed(() => {
  const nextLevel = level.value + 1
  const baseMatches = (level.value - 1) * 10
  const currentMatches = pongStats.value.matchesPlayed
  const progressInLevel = currentMatches - baseMatches
  const remaining = 10 - progressInLevel
  return `${remaining} matches vers niveau ${nextLevel}`
})

const playerTitle = computed(() => {
  const rating = pongStats.value.rating
  if (rating >= 2000) return 'Légende du Pong'
  if (rating >= 1800) return 'Maître Paddle'
  if (rating >= 1600) return 'Expert Pong'
  if (rating >= 1400) return 'Joueur Avancé'
  if (rating >= 1200) return 'Joueur Confirmé'
  return 'Débutant'
})

const playerRank = computed(() => {
  const rating = pongStats.value.rating
  if (rating >= 2000) return 'Diamant'
  if (rating >= 1800) return 'Platine'
  if (rating >= 1600) return 'Or'
  if (rating >= 1400) return 'Argent'
  if (rating >= 1200) return 'Bronze'
  return 'Fer'
})

const ratingStars = computed(() => {
  return Math.floor(pongStats.value.rating / 400) + 1
})

// Données d'évolution du winrate (calculées à partir des vraies données)
const winrateHistory = ref([
  { date: new Date(), winrate: 50 }
])

// Historique des matches (formaté pour l'affichage)
const pongMatchHistory = ref([])

// Fonction pour charger les données utilisateur depuis le backend
const loadUserData = async () => {
  try {
    console.log('Starting loadUserData...')
    isLoadingData.value = true
    
    // Récupérer les informations du profil utilisateur
    console.log('Fetching user data...')
    const userInfo = await fetchUser()
    console.log('User info received:', userInfo)
    userProfile.value = userInfo
    
    // Mise à jour des données de base
    username.value = userInfo.username || ''
    memberSince.value = new Date(userInfo.created_at) || new Date()
    avatar.value = userInfo.avatar || 'https://via.placeholder.com/150x150/d4af37/000000?text=🏓'
    
    // Calcul des statistiques à partir des vraies données
    pongStats.value.matchesPlayed = userInfo.number_of_matches || 0
    pongStats.value.victories = userInfo.number_of_win || 0
    
    // Calcul du niveau basé sur le nombre de matches
    level.value = Math.floor((userInfo.number_of_matches || 0) / 10) + 1
    
    // Calcul du rating basé sur le ratio
    const ratio = userInfo.ratio || 0
    pongStats.value.rating = Math.round(1000 + (ratio * 800))
    
    console.log('Stats calculated:', pongStats.value)
    
    // Récupérer l'historique des matches depuis le serveur
    try {
      console.log('Fetching match history from server...')
      const history = await userApi.getHistory(userInfo.username)
      if (history && history.matches) {
        matchHistory.value = history.matches
        // Traiter les données d'historique pour les graphiques
        processMatchHistory(history.matches)
      }
    } catch (historyError) {
      console.log('Aucun historique de matches trouvé:', historyError)
      // Utiliser des données par défaut si pas d'historique
      generateDefaultData()
    }
    
    console.log('User data loaded successfully')
    
  } catch (err) {
    console.error('Erreur lors du chargement des données utilisateur:', err)
    // Utiliser des données par défaut en cas d'erreur
    generateDefaultData()
  } finally {
    console.log('Setting isLoadingData to false')
    isLoadingData.value = false
  }
}

// Fonction pour traiter l'historique et générer les données des graphiques
const processMatchHistory = (matches) => {
  // Calculer les données de winrate au fil du temps
  let wins = 0
  const winrateData = []
  
  matches.slice(-10).forEach((match, index) => {
    if (match.i_won) wins++
    const winrate = Math.round((wins / (index + 1)) * 100)
    winrateData.push({
      date: new Date(match.match_date),
      winrate: winrate
    })
  })
  
  winrateHistory.value = winrateData.length > 0 ? winrateData : [
    { date: new Date(), winrate: pongStats.value.matchesPlayed > 0 ? Math.round((pongStats.value.victories / pongStats.value.matchesPlayed) * 100) : 0 }
  ]
  
  // Adapter l'historique des matches pour l'affichage (seulement matches en ligne)
  pongMatchHistory.value = matches.slice(0, 10)
    .filter(match => match.opponents[0]?.username !== 'IA') // Exclure les matches contre l'IA
    .map((match, index) => ({
    id: index + 1,
    playerScore: match.my_score,
    opponentScore: match.opponents[0]?.score || 0,
    opponent: match.opponents[0]?.username || 'Inconnu',
    won: match.i_won,
    duration: formatDuration(match.game_duration),
    pointsEarned: match.i_won ? 20 : 5,
    ratingChange: match.i_won ? Math.floor(Math.random() * 20) + 5 : -Math.floor(Math.random() * 15) - 5,
    date: new Date(match.match_date)
  }))
}

// Générer des données par défaut
const generateDefaultData = () => {
  const currentWinRate = pongStats.value.matchesPlayed > 0 ? Math.round((pongStats.value.victories / pongStats.value.matchesPlayed) * 100) : 0
  winrateHistory.value = [
    { date: new Date(), winrate: currentWinRate }
  ]
  pongMatchHistory.value = []
}

// Fonction pour formater la durée
const formatDuration = (seconds) => {
  if (!seconds) return '0m 0s'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

// Computed pour les graphiques winrate
const winrateLinePoints = computed(() => {
  if (winrateHistory.value.length === 0) return ''
  return winrateHistory.value.map((item, index) => {
    const x = (index / (winrateHistory.value.length - 1)) * 380 + 10
    const y = 180 - ((item.winrate / 100) * 160)
    return `${x},${y}`
  }).join(' ')
})

const winrateAreaPath = computed(() => {
  if (winrateHistory.value.length === 0) return ''
  const points = winrateHistory.value.map((item, index) => {
    const x = (index / (winrateHistory.value.length - 1)) * 380 + 10
    const y = 180 - ((item.winrate / 100) * 160)
    return { x, y }
  })
  
  let path = `M ${points[0].x} 180`
  points.forEach(point => {
    path += ` L ${point.x} ${point.y}`
  })
  path += ` L ${points[points.length - 1].x} 180 Z`
  
  return path
})

const winratePoints = computed(() => {
  if (winrateHistory.value.length === 0) return []
  return winrateHistory.value.map((item, index) => {
    const x = (index / (winrateHistory.value.length - 1)) * 380 + 10
    const y = 180 - ((item.winrate / 100) * 160)
    return { x, y }
  })
})

// Méthodes
const changeAvatar = () => {
  const avatars = [
    'https://via.placeholder.com/150x150/d4af37/000000?text=🏓',
    'https://via.placeholder.com/150x150/22c55e/ffffff?text=🏓',
    'https://via.placeholder.com/150x150/3b82f6/ffffff?text=🏓',
    'https://via.placeholder.com/150x150/8b5cf6/ffffff?text=🏓'
  ]
  const currentIndex = avatars.indexOf(avatar.value)
  avatar.value = avatars[(currentIndex + 1) % avatars.length]
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const formatShortDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const exportStats = () => {
  const stats = {
    profile: {
      username: username.value,
      level: level.value,
      memberSince: memberSince.value,
      avatar: avatar.value
    },
    pongStats: pongStats.value,
    matchHistory: pongMatchHistory.value,
    winrateHistory: winrateHistory.value
  }
  
  const dataStr = JSON.stringify(stats, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `pong-stats-${username.value}.json`
  link.click()
  
  URL.revokeObjectURL(url)
}

// Hook de cycle de vie
const handleMatchCompleted = async (event) => {
  console.log('Match completed event received:', event.detail)
  try {
    // Recharger les données utilisateur après le match
    await loadUserData()
    console.log('User data refreshed after match completion')
  } catch (error) {
    console.error('Error refreshing data after match:', error)
  }
}

// Hook de cycle de vie
onMounted(async () => {
  console.log('Profile component mounted')
  console.log('isAuthenticated:', isAuthenticated.value)
  console.log('currentUser:', currentUser.value)
  
  // Vérification de l'authentification
  if (!isAuthenticated.value) {
    console.log('User not authenticated, redirecting to signin')
    router.push({
      path: '/signin',
      query: { redirect: '/profile' }
    });
    return;
  }

  console.log('User authenticated, loading data...')
  // Charger les données utilisateur
  await loadUserData()
  
  // Ajouter un écouteur d'événements pour les matches terminés
  window.addEventListener('matchCompleted', handleMatchCompleted)
  console.log('Match completed event listener added')
})

// Nettoyage lors du démontage
onUnmounted(() => {
  // Supprimer l'écouteur d'événements
  window.removeEventListener('matchCompleted', handleMatchCompleted)
  console.log('Match completed event listener removed')
})
</script>

<style scoped>
.profile {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%);
  color: #f8f9fa;
  position: relative;
  overflow-x: hidden;
  padding: 2rem 0;
}

.profile-container {
  display: flex;
  margin: 30px 0;
  gap: 40px;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid #d4af37;
  object-fit: cover;
  margin-bottom: 15px;
  transition: transform 0.3s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.avatar:hover {
  transform: scale(1.05);
}

.level-badge {
  position: absolute;
  bottom: 10px;
  right: -10px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  padding: 4px;
  border: 2px solid #d4af37;
}

.pong-indicator {
  position: absolute;
  top: -5px;
  left: -5px;
  display: flex;
  align-items: center;
  gap: 2px;
}

.paddle {
  width: 3px;
  height: 15px;
  background: #d4af37;
  border-radius: 2px;
}

.ball {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(10px); }
}

.player-rank {
  margin-top: 10px;
  text-align: center;
}

.rank-label {
  display: block;
  color: #e0e0e0;
  font-size: 0.8em;
}

.rank-value {
  display: block;
  color: #d4af37;
  font-weight: bold;
  font-size: 1.1em;
}

.info-section {
  flex: 1;
  text-align: left;
}

.info-row {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.label {
  width: 150px;
  font-weight: bold;
  color: #d4af37;
  font-size: 1.1em;
}

.value {
  font-size: 1.1em;
  color: #f8f9fa;
}

.level-display {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.level-progress {
  width: 200px;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #d4af37, #c19b2e);
  transition: width 0.5s ease;
}

.level-text {
  font-size: 0.9em;
  color: #e0e0e0;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating-value {
  font-size: 1.3em;
  font-weight: bold;
  color: #d4af37;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 1.2em;
}

.title-badge {
  background: linear-gradient(45deg, #d4af37, #c19b2e);
  color: #1a1a1a;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.9em;
}

.input-field {
  padding: 12px;
  border: 2px solid rgba(212, 175, 55, 0.3);
  background-color: rgba(255, 255, 255, 0.1);
  color: #f8f9fa;
  border-radius: 8px;
  font-size: 1em;
  width: 250px;
  transition: border-color 0.3s ease;
  backdrop-filter: blur(10px);
}

.input-field:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.3);
}

.status {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.9em;
  font-weight: bold;
}

.status.online {
  background-color: #22c55e;
  color: white;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #f8f9fa;
  cursor: pointer;
  font-size: 1em;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid rgba(212, 175, 55, 0.3);
  backdrop-filter: blur(10px);
}

.btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #d4af37;
  transform: translateY(-2px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 1rem;
  padding: 20px;
  color: #f8f9fa;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.stat-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  border-color: #d4af37;
  box-shadow: 0 10px 25px rgba(212, 175, 55, 0.2);
}

.stat-icon {
  font-size: 2em;
  margin-bottom: 8px;
}

.stat-card h3 {
  color: #d4af37;
  margin-bottom: 10px;
  font-size: 0.9em;
  font-weight: 600;
}

.stat-value {
  font-size: 2em;
  font-weight: bold;
  color: #f8f9fa;
  margin-top: 8px;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 30px;
}

.match-history-extended {
  grid-column: 1;
}

.chart-container {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 1rem;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.chart-title {
  color: #d4af37;
  font-size: 1.3em;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.skills-chart {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-name {
  color: #f8f9fa;
  font-weight: 600;
}

.skill-value {
  color: #d4af37;
  font-weight: bold;
}

.skill-bar {
  height: 12px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 1s ease;
}

/* Styles pour l'historique des matches étendu */
.match-history-extended .history-list {
  max-height: 400px;
  overflow-y: auto;
}

.match-history-extended .history-list::-webkit-scrollbar {
  width: 6px;
}

.match-history-extended .history-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.match-history-extended .history-list::-webkit-scrollbar-thumb {
  background: #d4af37;
  border-radius: 3px;
}

.match-history-extended .history-list::-webkit-scrollbar-thumb:hover {
  background: #c19b2e;
}

/* Styles pour le message "Aucun historique" */
.no-history {
  text-align: center;
  padding: 40px 20px;
  color: #f8f9fa;
}

.no-history-icon {
  font-size: 4em;
  margin-bottom: 20px;
  opacity: 0.6;
}

.no-history-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #d4af37;
  margin-bottom: 10px;
}

.no-history-text {
  color: #e0e0e0;
  margin-bottom: 25px;
  font-size: 1.1em;
}

.btn-play-now {
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(135deg, #d4af37, #c19b2e);
  color: #1a1a1a;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.btn-play-now:hover {
  background: linear-gradient(135deg, #c19b2e, #b8941f);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
}

/* Styles pour le graphique de winrate */
.winrate-chart {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.chart-area {
  position: relative;
  height: 200px;
}

.winrate-svg {
  width: 100%;
  height: 100%;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  color: #e0e0e0;
  font-size: 0.8em;
  padding: 0 10px;
}

.chart-legend {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f8f9fa;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.current-winrate {
  color: #d4af37;
  font-weight: bold;
}

.match-history {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 1rem;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.match-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.match-item:hover {
  border-color: #d4af37;
  transform: translateX(5px);
  background: rgba(255, 255, 255, 0.15);
}

.result-indicator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2em;
}

.result-indicator.win {
  background-color: #22c55e;
  color: white;
}

.result-indicator.loss {
  background-color: #ef4444;
  color: white;
}

.match-details {
  flex: 1;
}

.match-score {
  font-size: 1.3em;
  font-weight: bold;
  color: #f8f9fa;
  margin-bottom: 4px;
}

.match-info {
  display: flex;
  gap: 15px;
  margin-bottom: 4px;
}

.match-opponent {
  color: #d4af37;
  font-weight: 600;
}

.match-duration {
  color: #e0e0e0;
  font-size: 0.9em;
}

.match-stats {
  display: flex;
  gap: 15px;
}

.match-date {
  color: #e0e0e0;
  font-size: 0.8em;
}

.match-points {
  text-align: right;
}

.points-earned {
  color: #d4af37;
  font-weight: bold;
  font-size: 1.1em;
  display: block;
  margin-bottom: 4px;
}

.rating-change {
  font-size: 0.9em;
  font-weight: bold;
}

.rating-change.positive {
  color: #22c55e;
}

.rating-change.negative {
  color: #ef4444;
}

/* Animation de chargement */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Styles pour les boutons d'action */
.bg-yellow-500 {
  background: linear-gradient(135deg, #d4af37, #c19b2e);
  color: #1a1a1a;
}

.bg-yellow-500:hover {
  background: linear-gradient(135deg, #c19b2e, #b8941f);
}

.bg-green-600 {
  background: rgba(34, 197, 94, 0.8);
  color: white;
  border: 1px solid rgba(34, 197, 94, 0.3);
  backdrop-filter: blur(10px);
}

.bg-green-600:hover {
  background: rgba(34, 197, 94, 0.9);
  border-color: rgba(34, 197, 94, 0.6);
}

.bg-gray-600 {
  background: rgba(255, 255, 255, 0.1);
  color: #f8f9fa;
  border: 1px solid rgba(212, 175, 55, 0.3);
  backdrop-filter: blur(10px);
}

.bg-gray-600:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #d4af37;
}

/* Classes utilitaires */
.font-bold { font-weight: bold; }
.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.rounded-lg { border-radius: 0.5rem; }
.transition-colors { transition: all 0.3s ease; }
.items-center { align-items: center; }
.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1rem; }
.mt-8 { margin-top: 2rem; }
.flex { display: flex; }
.justify-center { justify-content: center; }

/* Responsivité */
@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
    gap: 20px;
  }
  
  .avatar-section {
    min-width: auto;
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

/* Styles pour l'interactivité des cartes de statistiques */
.stat-card.interactive {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.stat-card.interactive:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3);
}

.stat-card.interactive.active {
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
}

.stat-subtitle {
  font-size: 0.8em;
  color: #e0e0e0;
  margin-top: 5px;
}

.interaction-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 0.8em;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.stat-card.interactive:hover .interaction-indicator {
  opacity: 1;
  transform: scale(1.2);
}

/* Styles pour les modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%);
  border: 2px solid #d4af37;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  animation: slideIn 0.3s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  color: #d4af37;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-close:hover {
  color: #fff;
  transform: scale(1.1);
}

.modal-title {
  color: #d4af37;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
}

.modal-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.modal-stat {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
}

.modal-stat-label {
  color: #e0e0e0;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.modal-stat-value {
  color: #d4af37;
  font-size: 1.5rem;
  font-weight: bold;
}

/* Styles pour la timeline des matches */
.matches-timeline h4 {
  color: #d4af37;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.8rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.timeline-dot.win {
  background-color: #22c55e;
}

.timeline-dot.loss {
  background-color: #ef4444;
}

.timeline-content {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.timeline-score {
  color: #f8f9fa;
  font-weight: bold;
}

.timeline-date {
  color: #e0e0e0;
  font-size: 0.8rem;
}

/* Styles pour l'analyse des victoires */
.victory-analysis {
  display: flex;
  gap: 2rem;
}

.victory-chart {
  flex: 1;
  display: flex;
  gap: 1rem;
  align-items: end;
  justify-content: center;
  height: 200px;
  margin-bottom: 1rem;
}

.chart-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: end;
}

.chart-bar {
  width: 60px;
  background: linear-gradient(to top, #d4af37, #c19b2e);
  border-radius: 4px 4px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  padding: 0.5rem;
  min-height: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.chart-bar.defeat {
  background: linear-gradient(to top, #ef4444, #dc2626);
}

.chart-bar:hover {
  transform: scaleY(1.1);
}

.bar-label {
  color: #fff;
  font-size: 0.7rem;
  font-weight: bold;
  margin-bottom: 0.2rem;
}

.bar-value {
  color: #fff;
  font-size: 0.9rem;
  font-weight: bold;
}

.victory-breakdown {
  flex: 1;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  margin-bottom: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.breakdown-label {
  color: #e0e0e0;
}

.breakdown-value {
  color: #d4af37;
  font-weight: bold;
}

.breakdown-value.win {
  color: #22c55e;
}

.breakdown-value.loss {
  color: #ef4444;
}

/* Styles pour l'analyse détaillée du winrate */
.winrate-detailed {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.winrate-gauge {
  flex-shrink: 0;
}

.gauge-text {
  fill: #d4af37;
  font-size: 16px;
  font-weight: bold;
}

.winrate-stats {
  flex: 1;
}

.winrate-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  margin-bottom: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.winrate-label {
  color: #e0e0e0;
}

.winrate-value {
  color: #d4af37;
  font-weight: bold;
}

.winrate-value.up {
  color: #22c55e;
}

.winrate-value.down {
  color: #ef4444;
}

.winrate-comparison h4 {
  color: #d4af37;
  margin: 1rem 0 0.5rem 0;
  font-size: 1rem;
}

.opponent-winrates {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.opponent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.3rem;
  color: #e0e0e0;
}

.opponent-rate {
  color: #d4af37;
  font-weight: bold;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsivité pour les modales */
@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    max-width: calc(100vw - 2rem);
    padding: 1.5rem;
  }
  
  .modal-stats-grid {
    grid-template-columns: 1fr;
  }
  
  .victory-analysis {
    flex-direction: column;
    gap: 1rem;
  }
  
  .winrate-detailed {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stat-card.interactive:hover {
    transform: translateY(-3px) scale(1.01);
  }
}
</style>
