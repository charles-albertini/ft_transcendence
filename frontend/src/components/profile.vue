<template>
	<div class="profile min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 py-10">
	  <div class="container mx-auto px-4">
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
			
			<button @click="updateProfile" class="btn primary mt-6">
			  {{ $t('saveProfile') }}
			</button>
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
			</div>
			<div class="stat-card">
			  <div class="stat-icon">📊</div>
			  <h3>{{ $t('winRate') }}</h3>
			  <div class="stat-value">{{ winRatePercentage }}%</div>
			</div>
			<div class="stat-card">
			  <div class="stat-icon">⚡</div>
			  <h3>{{ $t('avgReactionTime') }}</h3>
			  <div class="stat-value">{{ pongStats.avgReactionTime }}ms</div>
			</div>
			<!-- <div class="stat-card">
			  <div class="stat-icon">🎯</div>
			  <h3>{{ $t('accuracy') }}</h3>
			  <div class="stat-value">{{ pongStats.accuracy }}%</div>
			</div> -->
			<div class="stat-card">
			  <div class="stat-icon">🔥</div>
			  <h3>{{ $t('longestRally') }}</h3>
			  <div class="stat-value">{{ pongStats.longestRally }}</div>
			</div>
		  </div>
  
		  <!-- Graphiques de progression Pong -->
		  <div class="charts-section">
			<div class="chart-container">
			  <h3 class="chart-title">{{ $t('pongSkills') }}</h3>
			  <div class="skills-chart">
				<div class="skill-item" v-for="skill in pongSkills" :key="skill.name">
				  <div class="skill-info">
					<span class="skill-name">{{ skill.name }}</span>
					<span class="skill-value">{{ skill.value }}%</span>
				  </div>
				  <div class="skill-bar">
					<div 
					  class="skill-fill" 
					  :style="{ 
						width: skill.value + '%',
						backgroundColor: skill.color 
					  }"
					></div>
				  </div>
				</div>
			  </div>
			</div>
  
			<!-- Nouveau: Diagramme d'évolution du Winrate -->
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
  
		  <!-- Nouveau: Diagramme des parties jouées par jour -->
		  <div class="daily-matches-section mt-8">
			<div class="chart-container">
			  <h3 class="chart-title">{{ $t('dailyMatches') }}</h3>
			  <div class="daily-matches-chart">
				<div class="chart-area">
				  <div class="daily-bars">
					<div 
					  v-for="(day, index) in dailyMatchesData" 
					  :key="index"
					  class="daily-bar-container"
					>
					  <div 
						class="daily-bar"
						:style="{ 
						  height: (day.matches / maxDailyMatches) * 100 + '%',
						  backgroundColor: getDayBarColor(day.matches)
						}"
						:title="`${formatShortDate(day.date)}: ${day.matches} matches`"
					  >
						<div class="bar-value">{{ day.matches }}</div>
					  </div>
					</div>
				  </div>
				</div>
				<div class="daily-labels">
				  <span v-for="(day, index) in dailyMatchesData" :key="index" class="daily-label">
					{{ formatDayName(day.date) }}
				  </span>
				</div>
				<div class="daily-stats">
				  <div class="daily-stat">
					<span class="stat-label">{{ $t('totalThisWeek') }}:</span>
					<span class="stat-value">{{ totalWeeklyMatches }}</span>
				  </div>
				  <div class="daily-stat">
					<span class="stat-label">{{ $t('avgPerDay') }}:</span>
					<span class="stat-value">{{ averageDailyMatches }}</span>
				  </div>
				  <div class="daily-stat">
					<span class="stat-label">{{ $t('bestDay') }}:</span>
					<span class="stat-value">{{ bestDayMatches }}</span>
				  </div>
				</div>
			  </div>
			</div>
		  </div>

		  <!-- Historique des matches Pong -->
		  <div class="match-history mt-10">
			<h3 class="text-2xl font-bold text-white mb-6 text-center">
			  📋 {{ $t('matchHistory') }}
			</h3>
			<div class="history-list">
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
					<span class="rally-count">{{ match.rallies }} rallies</span>
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
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import BillardBall from './BillardBall.vue'
  import { useAuth } from '../composable/useAuths';
  import { useRouter } from 'vue-router';
  
  const { t } = useI18n()
  
  // État local avec la Composition API
  const username = ref('PongMaster')
  const level = ref(15)
  const avatar = ref('https://via.placeholder.com/150x150/d4af37/000000?text=🏓')
  const memberSince = ref(new Date('2023-01-15'))
  
  // Statistiques Pong spécifiques
  const pongStats = ref({
	matchesPlayed: 342,
	victories: 234,
	rating: 1847,
	avgReactionTime: 185, // en millisecondes
	accuracy: 87, // pourcentage de coups réussis
	longestRally: 47, // nombre d'échanges
	ballControl: 82,
	defensivePlay: 78,
	aggressivePlay: 91,
	totalPlayTime: 1240 // en minutes
  })
  
  // Compétences spécifiques au Pong
  const pongSkills = ref([
	{ name: 'Temps de Réaction', value: 88, color: '#fbbf24' },
	{ name: 'Précision Paddle', value: 85, color: '#3b82f6' },
	{ name: 'Anticipation', value: 92, color: '#8b5cf6' },
	{ name: 'Contrôle Vitesse', value: 79, color: '#10b981' },
	{ name: 'Placement Balle', value: 83, color: '#ef4444' }
  ])
  
  // Nouveau: Données d'évolution du winrate
  const winrateHistory = ref([
	{ date: new Date('2024-06-01'), winrate: 45 },
	{ date: new Date('2024-06-03'), winrate: 52 },
	{ date: new Date('2024-06-05'), winrate: 48 },
	{ date: new Date('2024-06-07'), winrate: 58 },
	{ date: new Date('2024-06-09'), winrate: 62 },
	{ date: new Date('2024-06-11'), winrate: 67 },
	{ date: new Date('2024-06-13'), winrate: 64 },
	{ date: new Date('2024-06-15'), winrate: 68 },
	{ date: new Date('2024-06-17'), winrate: 72 },
	{ date: new Date('2024-06-19'), winrate: 69 }
  ])
  
  // Nouveau: Données des parties jouées par jour (7 derniers jours)
  const dailyMatchesData = ref([
	{ date: new Date('2024-06-13'), matches: 8 },
	{ date: new Date('2024-06-14'), matches: 12 },
	{ date: new Date('2024-06-15'), matches: 6 },
	{ date: new Date('2024-06-16'), matches: 15 },
	{ date: new Date('2024-06-17'), matches: 9 },
	{ date: new Date('2024-06-18'), matches: 11 },
	{ date: new Date('2024-06-19'), matches: 7 }
  ])
  
  // Achievements spécifiques au Pong
  const pongAchievements = ref([
	{
	  id: 1,
	  name: 'Premier Service',
	  description: 'Jouer votre premier match de Pong',
	  icon: '🏓',
	  unlocked: true
	},
	{
	  id: 2,
	  name: 'Réflexes d\'Acier',
	  description: 'Temps de réaction sous 150ms',
	  icon: '⚡',
	  unlocked: true
	},
	{
	  id: 3,
	  name: 'Mur Infranchissable',
	  description: 'Gagner un match sans concéder de point',
	  icon: '🛡️',
	  unlocked: true
	},
	{
	  id: 4,
	  name: 'Rally Master',
	  description: 'Réaliser un rally de 50 échanges',
	  icon: '🔥',
	  unlocked: false,
	  progress: 94
	},
	{
	  id: 5,
	  name: 'Centurion Pong',
	  description: 'Gagner 100 matches',
	  icon: '💯',
	  unlocked: true
	},
	{
	  id: 6,
	  name: 'Légende du Paddle',
	  description: 'Atteindre 2000 de rating',
	  icon: '👑',
	  unlocked: false,
	  progress: 92
	}
  ])
  
  // Historique des matches Pong
  const pongMatchHistory = ref([
	{
	  id: 1,
	  playerScore: 21,
	  opponentScore: 18,
	  opponent: 'IA Expert',
	  won: true,
	  duration: '8m 32s',
	  rallies: 34,
	  pointsEarned: 25,
	  ratingChange: +12,
	  date: new Date('2024-06-15')
	},
	{
	  id: 2,
	  playerScore: 19,
	  opponentScore: 21,
	  opponent: 'IA Pro',
	  won: false,
	  duration: '12m 15s',
	  rallies: 42,
	  pointsEarned: 8,
	  ratingChange: -8,
	  date: new Date('2024-06-14')
	},
	{
	  id: 3,
	  playerScore: 21,
	  opponentScore: 15,
	  opponent: 'IA Avancé',
	  won: true,
	  duration: '6m 45s',
	  rallies: 28,
	  pointsEarned: 20,
	  ratingChange: +15,
	  date: new Date('2024-06-13')
	},
	{
	  id: 4,
	  playerScore: 21,
	  opponentScore: 16,
	  opponent: 'IA Expert',
	  won: true,
	  duration: '9m 12s',
	  rallies: 31,
	  pointsEarned: 22,
	  ratingChange: +10,
	  date: new Date('2024-06-12')
	}
  ])
  
  // Computed properties
  const winRatePercentage = computed(() => {
	return Math.round((pongStats.value.victories / pongStats.value.matchesPlayed) * 100)
  })
  
  const levelProgress = computed(() => {
	return ((level.value % 1) * 100) || 65
  })
  
  const experienceText = computed(() => {
	const nextLevel = level.value + 1
	return `${Math.floor(levelProgress.value)}% vers niveau ${nextLevel}`
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
  
  // Computed pour les graphiques winrate
  const winrateLinePoints = computed(() => {
	return winrateHistory.value.map((item, index) => {
	  const x = (index / (winrateHistory.value.length - 1)) * 380 + 10
	  const y = 180 - ((item.winrate / 100) * 160)
	  return `${x},${y}`
	}).join(' ')
  })
  
  const winrateAreaPath = computed(() => {
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
	return winrateHistory.value.map((item, index) => {
	  const x = (index / (winrateHistory.value.length - 1)) * 380 + 10
	  const y = 180 - ((item.winrate / 100) * 160)
	  return { x, y }
	})
  })
  
  // Computed pour les statistiques quotidiennes
  const maxDailyMatches = computed(() => {
	return Math.max(...dailyMatchesData.value.map(day => day.matches))
  })
  
  const totalWeeklyMatches = computed(() => {
	return dailyMatchesData.value.reduce((total, day) => total + day.matches, 0)
  })
  
  const averageDailyMatches = computed(() => {
	return Math.round(totalWeeklyMatches.value / dailyMatchesData.value.length)
  })
  
  const bestDayMatches = computed(() => {
	return maxDailyMatches.value
  })
  
  // Méthodes
  const updateProfile = () => {
	console.log('Profil Pong mis à jour:', username.value)
	localStorage.setItem('pongProfile', JSON.stringify({
	  username: username.value,
	  level: level.value,
	  avatar: avatar.value,
	  stats: pongStats.value
	}))
  }
  
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
  
  const formatDayName = (date) => {
	return new Intl.DateTimeFormat('fr-FR', {
	  weekday: 'short'
	}).format(date)
  }
  
  const getDayBarColor = (matches) => {
	if (matches >= 12) return '#22c55e' // Vert pour beaucoup de matches
	if (matches >= 8) return '#fbbf24'  // Jaune pour un bon nombre
	if (matches >= 5) return '#f97316'  // Orange pour moyen
	return '#ef4444' // Rouge pour peu de matches
  }
  
  const exportStats = () => {
	const stats = {
	  profile: {
		username: username.value,
		level: level.value,
		memberSince: memberSince.value
	  },
	  pongStats: pongStats.value,
	  matchHistory: pongMatchHistory.value,
	  skills: pongSkills.value,
	  achievements: pongAchievements.value,
	  winrateHistory: winrateHistory.value,
	  dailyMatches: dailyMatchesData.value
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
  const savedProfile = ref(null);
  onMounted(() => {
	console.log('Composant Pong Profile monté')
	savedProfile.value = localStorage.getItem('pongProfile')
	if (savedProfile.value) {
	  const profile = JSON.parse(savedProfile.value)
	  username.value = profile.username || username.value
	  level.value = profile.level || level.value
	  avatar.value = profile.avatar || avatar.value
	  if (profile.stats) {
		pongStats.value = { ...pongStats.value, ...profile.stats }
	  }
	}
  })
  
  // Vérification de l'authentification
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  onMounted(() => {
    if (!isAuthenticated.value) {
      router.push({
        path: '/signin',
        query: { redirect: '/profile' }
      });
    }
  });
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
  
  .btn.primary {
	background: linear-gradient(135deg, #d4af37, #c19b2e);
	color: #1a1a1a;
	border-color: #d4af37;
	box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
  }
  
  .btn.primary:hover {
	background: linear-gradient(135deg, #c19b2e, #b8941f);
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
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
	grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
	gap: 30px;
	margin-top: 30px;
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
  
  /* Styles pour le graphique des matches quotidiens */
  .daily-matches-section {
	grid-column: 1 / -1;
  }
  
  .daily-matches-chart {
	display: flex;
	flex-direction: column;
	gap: 15px;
  }
  
  .daily-bars {
	display: flex;
	align-items: end;
	gap: 12px;
	height: 200px;
	padding: 20px 10px 10px;
  }
  
  .daily-bar-container {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
  }
  
  .daily-bar {
	width: 100%;
	min-height: 20px;
	border-radius: 6px 6px 0 0;
	transition: all 0.3s ease;
	cursor: pointer;
	position: relative;
	display: flex;
	align-items: end;
	justify-content: center;
	padding-bottom: 5px;
  }
  
  .daily-bar:hover {
	opacity: 0.8;
	transform: scaleY(1.05);
  }
  
  .bar-value {
	color: white;
	font-size: 0.8em;
	font-weight: bold;
	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  }
  
  .daily-labels {
	display: flex;
	justify-content: space-between;
	color: #e0e0e0;
	font-size: 0.9em;
	padding: 0 10px;
  }
  
  .daily-label {
	text-align: center;
	flex: 1;
  }
  
  .daily-stats {
	display: flex;
	justify-content: space-around;
	margin-top: 15px;
	padding: 15px;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 8px;
	backdrop-filter: blur(10px);
  }
  
  .daily-stat {
	text-align: center;
  }
  
  .stat-label {
	display: block;
	color: #e0e0e0;
	font-size: 0.8em;
	margin-bottom: 4px;
  }
  
  .stat-value {
	display: block;
	color: #d4af37;
	font-weight: bold;
	font-size: 1.2em;
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
  
  .rally-count {
	color: #e0e0e0;
	font-size: 0.8em;
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
  
  /* Boutons d'action en bas */
  .flex {
	display: flex;
  }
  
  .justify-center {
	justify-content: center;
  }
  
  .gap-4 {
	gap: 1rem;
  }
  
  .mt-8 {
	margin-top: 2rem;
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
  
  .font-bold {
	font-weight: bold;
  }
  
  .py-3 {
	padding-top: 0.75rem;
	padding-bottom: 0.75rem;
  }
  
  .px-6 {
	padding-left: 1.5rem;
	padding-right: 1.5rem;
  }
  
  .rounded-lg {
	border-radius: 0.5rem;
  }
  
  .transition-colors {
	transition: all 0.3s ease;
  }
  
  .items-center {
	align-items: center;
  }
  
  .gap-2 {
	gap: 0.5rem;
  }

  </style>