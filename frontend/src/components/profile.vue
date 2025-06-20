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
				<img :src="displayAvatar" alt="Avatar" class="avatar" />
			  </div>
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

			  <div class="info-row">
				<span class="label">{{ $t('security') || 'Sécurité' }}:</span>
				<span class="value security-status" :class="{ 'secure': twoFactorEnabled }">
				  {{ twoFactorEnabled ? '🔒 2FA Activée' : '🔓 2FA Désactivée' }}
				</span>
			  </div>
			</div>
		  </div>

		  <!-- Composant pour l'édition du profil -->
		  <!-- Debug: showEditProfile = {{ showEditProfile }} -->
		  <div v-if="showEditProfile" style="color: red; text-align: center; padding: 10px; background: rgba(255,0,0,0.1);">
			DEBUG: Modal devrait être visible (showEditProfile = {{ showEditProfile }})
		  </div>
		  <EditProfileModal 
			:show="showEditProfile"
			:userProfile="editProfileData"
			@close="closeEditProfile"
			@profile-updated="handleProfileUpdated"
		  />
		  
		  <!-- Statistiques Pong -->
		  <div class="stats mt-10">
			<h2 class="text-3xl font-bold text-white mb-4 text-center flex items-center justify-center gap-3">
			  {{ $t('pongStatistics') }}
			</h2>
			
			<!-- Indicateur pour les matchs en ligne uniquement -->
			<div class="online-only-indicator mb-6 text-center">
			  <div class="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-400/50 rounded-lg px-4 py-2">
				<span class="text-blue-300 text-lg">🌐</span>
				<span class="text-blue-100 font-medium">Statistiques des matchs en ligne uniquement</span>
			  </div>
			</div>
			
			<!-- Statistiques principales -->
			<div class="stats-grid mb-8">
			  <div class="stat-card">
				<div class="stat-icon">🌐</div>
				<h3>{{ $t('matchesPlayed') }} (En ligne)</h3>
				<div class="stat-value">{{ pongStats.matchesPlayed }}</div>
			  </div>
			  <div class="stat-card">
				<div class="stat-icon">🏆</div>
				<h3>{{ $t('victories') }} (En ligne)</h3>
				<div class="stat-value">{{ pongStats.victories }}</div>
				<div class="stat-subtitle">{{ pongStats.matchesPlayed - pongStats.victories }} défaites</div>
			  </div>
			  <div class="stat-card">
				<div class="stat-icon">📊</div>
				<h3>{{ $t('winRate') }} (En ligne)</h3>
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
				<h3 class="chart-title">🌐 {{ $t('matchHistory') }} (Matchs en ligne)</h3>
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
				  <div class="no-history-icon">🌐</div>
				  <h4 class="no-history-title">Aucun match en ligne joué</h4>
				  <p class="no-history-text">Commencez à jouer en ligne pour voir votre historique !</p>
				</div>
			  </div>

			  <!-- Diagramme d'évolution du Winrate -->
			  <div class="chart-container">
				<h3 class="chart-title">{{ $t('winrateEvolution') }} (Matchs en ligne)</h3>
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
			<button 
			  @click="openEditProfile" 
			  class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
			>
			  ⚙️ {{ $t('editProfile') || 'Modifier le profil' }}
			</button>
			<router-link 
			  to="/Home2" 
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
import { useAuth } from '../composable/useAuths';
import { useUser } from '../composable/useUser';
import { useRouter } from 'vue-router';
import { userApi } from '../services/userAPI.ts';
import { DEFAULT_AVATARS_BASE64 } from '../utils/imageUtils.ts';
import EditProfileModal from './EditProfileModal.vue';

const { t } = useI18n()
const { user: currentUser, isAuthenticated, initializeAuth } = useAuth();
const { fetchUser, isLoading, error } = useUser();
const router = useRouter();

// État local avec la Composition API
const username = ref('')
const level = ref(1)
const avatar = ref(DEFAULT_AVATARS_BASE64.default) // Utilise l'avatar par défaut en base64
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

// État de la 2FA (lecture seule pour l'affichage)
const twoFactorEnabled = ref(false)

// Computed properties
const winRatePercentage = computed(() => {
  return pongStats.value.matchesPlayed > 0 ? Math.round((pongStats.value.victories / pongStats.value.matchesPlayed) * 100) : 0
})

const levelProgress = computed(() => {
  const baseMatches = (level.value - 1) * 10
  const currentMatches = pongStats.value.matchesPlayed // Nombre de matchs en ligne seulement
  const progressInLevel = currentMatches - baseMatches
  return Math.min((progressInLevel / 10) * 100, 100)
})

const experienceText = computed(() => {
  const nextLevel = level.value + 1
  const baseMatches = (level.value - 1) * 10
  const currentMatches = pongStats.value.matchesPlayed // Nombre de matchs en ligne seulement
  const progressInLevel = currentMatches - baseMatches
  const remaining = 10 - progressInLevel
  return `${remaining} matchs en ligne vers niveau ${nextLevel}`
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

// Computed pour l'avatar avec fallback
const displayAvatar = computed(() => {
  return avatar.value || DEFAULT_AVATAR
})

// Computed pour détecter si l'avatar actuel est personnalisé (non-défaut)
const isCustomAvatar = computed(() => {
  const currentAvatar = avatar.value
  return currentAvatar && 
         currentAvatar !== DEFAULT_AVATAR && 
         !Object.values(DEFAULT_AVATARS_BASE64).includes(currentAvatar)
})

// URL de l'avatar par défaut (même que le backend)
const DEFAULT_AVATAR = DEFAULT_AVATARS_BASE64.default

// Données d' évolution du winrate (calculées à partir des vraies données)
const winrateHistory = ref([
  { date: new Date(), winrate: 50 }
])

// Historique des matches (formaté pour l'affichage)
const pongMatchHistory = ref([])

// Variables pour l'édition du profil (simplifiées pour le composant)
const showEditProfile = ref(false)

// Computed pour l'interface avec EditProfileModal
const editProfileData = computed(() => {
  return {
    username: username.value,
    twoFA: userProfile.value?.twoFA || false,
    avatar: avatar.value || DEFAULT_AVATAR,
    google_user: userProfile.value?.google_user || false
  }
})

// Fonction pour charger les données utilisateur depuis le backend
const loadUserData = async () => {
  try {
    isLoadingData.value = true
    
    // Récupérer les informations du profil utilisateur
    const userInfo = await fetchUser()
    userProfile.value = userInfo
    
    // Mise à jour des données de base
    username.value = userInfo.username || ''
    memberSince.value = new Date(userInfo.created_at) || new Date()
    avatar.value = userInfo.avatar || DEFAULT_AVATAR // Utilise l'avatar par défaut si null en DB
    
    // Mise à jour de l'état 2FA
    twoFactorEnabled.value = userInfo.twoFA || false
    
    // Calcul des statistiques à partir des vraies données (sera mise à jour par processMatchHistory)
    pongStats.value.matchesPlayed = 0 // Sera calculé avec les matchs en ligne seulement
    pongStats.value.victories = 0     // Sera calculé avec les matchs en ligne seulement
    
    // Calcul du niveau basé sur le nombre de matches en ligne
    // level.value sera recalculé après avoir filtré les matchs en ligne
    
    // Calcul du rating basé sur le ratio des matchs en ligne
    const ratio = userInfo.ratio || 0
    pongStats.value.rating = Math.round(1000 + (ratio * 800))
    
    // Récupérer l'historique des matches depuis le serveur
    try {
      const history = await userApi.getHistory(userInfo.username)
      if (history && history.matches) {
        matchHistory.value = history.matches
        // Traiter les données d'historique pour les graphiques
        processMatchHistory(history.matches)
      }
    } catch (historyError) {
      // Utiliser des données par défaut si pas d'historique
      // Utiliser des données par défaut si pas d'historique
      generateDefaultData()
    }
    
  } catch (err) {
    // Utiliser des données par défaut en cas d'erreur
    generateDefaultData()
  } finally {
    isLoadingData.value = false
  }
}

const processMatchHistory = (matches) => {
  // Filtrer uniquement les matchs en ligne (exclure les matchs contre l'IA)
  const onlineMatches = matches.filter(match => 
    match.opponents && 
    match.opponents.length > 0 && 
    match.opponents[0]?.username && 
    match.opponents[0]?.username !== 'IA' &&
    match.opponents[0]?.username.toLowerCase() !== 'ia' &&
    match.opponents[0]?.username.toLowerCase() !== 'bot'
  )
  
  // Mettre à jour les statistiques pour ne compter que les matchs en ligne
  pongStats.value.matchesPlayed = onlineMatches.length
  pongStats.value.victories = onlineMatches.filter(match => match.i_won).length
  
  // Recalculer le niveau basé sur les matchs en ligne seulement
  level.value = Math.floor(onlineMatches.length / 10) + 1
  
  // Calculer les données de winrate au fil du temps (seulement matchs en ligne)
  let wins = 0
  const winrateData = []
  
  onlineMatches.slice(-10).forEach((match, index) => {
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
  pongMatchHistory.value = onlineMatches.slice(0, 10).map((match, index) => ({
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

// Générer des données par défaut (pas de matchs en ligne)
const generateDefaultData = () => {
  // Réinitialiser les statistiques pour les matchs en ligne seulement
  pongStats.value.matchesPlayed = 0
  pongStats.value.victories = 0
  level.value = 1 // Niveau 1 si aucun match en ligne
  
  const currentWinRate = 0 // Pas de matchs en ligne = 0% winrate
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
  if (winrateHistory.value.length === 1) {
    // Si un seul point, placer au centre
    return `200,${180 - ((winrateHistory.value[0].winrate / 100) * 160)}`
  }
  return winrateHistory.value.map((item, index) => {
    const x = (index / (winrateHistory.value.length - 1)) * 380 + 10
    const y = 180 - ((item.winrate / 100) * 160)
    return `${x},${y}`
  }).join(' ')
})

const winrateAreaPath = computed(() => {
  if (winrateHistory.value.length === 0) return ''
  if (winrateHistory.value.length === 1) {
    // Si un seul point, créer une petite aire autour de ce point
    const y = 180 - ((winrateHistory.value[0].winrate / 100) * 160)
    return `M 190 180 L 190 ${y} L 210 ${y} L 210 180 Z`
  }
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
  if (winrateHistory.value.length === 1) {
    // Si un seul point, placer au centre
    const y = 180 - ((winrateHistory.value[0].winrate / 100) * 160)
    return [{ x: 200, y }]
  }
  return winrateHistory.value.map((item, index) => {
    const x = (index / (winrateHistory.value.length - 1)) * 380 + 10
    const y = 180 - ((item.winrate / 100) * 160)
    return { x, y }
  })
})

// Méthodes
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

// Fonctions pour l'édition du profil (simplifiées pour le composant)
const openEditProfile = () => {
  console.log('openEditProfile appelé - Avant:', showEditProfile.value)
  showEditProfile.value = true
  console.log('openEditProfile appelé - Après:', showEditProfile.value)
}

const closeEditProfile = () => {
  console.log('closeEditProfile appelé')
  showEditProfile.value = false
}

// Fonction pour gérer la mise à jour du profil depuis le composant
const handleProfileUpdated = async (updatedProfile) => {
  // Mettre à jour les données locales
  username.value = updatedProfile.username
  avatar.value = updatedProfile.avatar
  
  // Recharger les données utilisateur pour synchroniser avec le backend
  await loadUserData()
}

// Fonctions pour la gestion de la 2FA
const toggle2FA = async () => {
  if (twoFactorEnabled.value) {
    await disable2FA()
  } else {
    await enable2FA()
  }
}

const enable2FA = async () => {
  showTwoFactorSetup.value = true
}

const disable2FA = async () => {
  twoFactorLoading.value = true
  twoFactorError.value = ''
  
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      twoFactorError.value = 'Token d\'authentification non trouvé'
      return
    }
    
    const result = await twoFactorService.disable2FA(token)
    
    if (result.success) {
      twoFactorEnabled.value = false
      twoFactorError.value = ''
    } else {
      twoFactorError.value = result.message || 'Erreur lors de la désactivation de la 2FA'
    }
  } catch (error) {
    twoFactorError.value = 'Erreur de connexion au serveur'
  } finally {
    twoFactorLoading.value = false
  }
}

const handleTwoFactorSetupComplete = (enabled) => {
  twoFactorEnabled.value = enabled
  showTwoFactorSetup.value = false
}

const handleTwoFactorSetupSkipped = () => {
  showTwoFactorSetup.value = false
}

// Hook de cycle de vie pour écouter les matches terminés
const handleMatchCompleted = async (event) => {
  try {
    // Recharger les données utilisateur après le match
    await loadUserData()
  } catch (error) {
    // Erreur silencieuse
  }
}

// Hook de cycle de vie
onMounted(async () => {
  // Initialiser l'authentification
  initializeAuth();
  
  // Le router guard s'occupe déjà de la vérification d'authentification
  // Pas besoin de vérifier ici, nous pouvons directement charger les données
  await loadUserData()
  
  // Ajouter un écouteur d'événements pour les matches terminés
  window.addEventListener('matchCompleted', handleMatchCompleted)
})

// Nettoyage lors du démontage
onUnmounted(() => {
  // Supprimer l'écouteur d'événements
  window.removeEventListener('matchCompleted', handleMatchCompleted)
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
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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

/* Styles pour l'état de sécurité */
.security-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.security-status.secure {
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
  border: 1px solid rgba(34, 197, 94, 0.3);
}
</style>
