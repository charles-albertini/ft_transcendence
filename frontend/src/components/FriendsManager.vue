<template>
  <div class="friends-manager min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 py-10">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          👥 {{ $t('friendsManager') || 'Gestion des Amis' }}
        </h1>
        <p class="text-green-200 text-lg">{{ $t('manageFriendsDescription') || 'Gérez vos amis, envoyez des invitations et voyez qui est en ligne' }}</p>
      </div>

      <!-- Navigation par onglets -->
      <div class="tabs-container mb-8">
        <div class="tabs-nav">
          <button 
            @click="activeTab = 'friends'"
            :class="['tab-button', { active: activeTab === 'friends' }]"
          >
            👥 {{ $t('myFriends') || 'Mes Amis' }} 
            <span class="tab-count">{{ friends.length }}</span>
          </button>
          <button 
            @click="activeTab = 'pending'"
            :class="['tab-button', { active: activeTab === 'pending' }]"
          >
            📬 {{ $t('pendingRequests') || 'Demandes Reçues' }}
            <span class="tab-count" v-if="pendingRequests.length > 0">{{ pendingRequests.length }}</span>
          </button>
          <button 
            @click="activeTab = 'sent'"
            :class="['tab-button', { active: activeTab === 'sent' }]"
          >
            📤 {{ $t('sentRequests') || 'Demandes Envoyées' }}
            <span class="tab-count" v-if="sentRequests.length > 0">{{ sentRequests.length }}</span>
          </button>
          <button 
            @click="activeTab = 'add'"
            :class="['tab-button', { active: activeTab === 'add' }]"
          >
            ➕ {{ $t('addFriend') || 'Ajouter un Ami' }}
          </button>
        </div>
      </div>

      <!-- Contenu des onglets -->
      <div class="tab-content">
        <!-- Onglet Liste d'amis -->
        <div v-if="activeTab === 'friends'" class="friends-tab">
          <div v-if="loadingFriends" class="loading-state">
            <div class="spinner"></div>
            <p>{{ $t('loadingFriends') || 'Chargement des amis...' }}</p>
          </div>
          
          <div v-else-if="friends.length === 0" class="empty-state">
            <div class="empty-icon">👥</div>
            <h3>{{ $t('noFriendsYet') || 'Aucun ami pour le moment' }}</h3>
            <p>{{ $t('addFirstFriend') || 'Commencez par ajouter votre premier ami !' }}</p>
            <button @click="activeTab = 'add'" class="btn btn-primary">
              ➕ {{ $t('addFriend') || 'Ajouter un Ami' }}
            </button>
          </div>
          
          <div v-else class="friends-grid">
            <div 
              v-for="friend in friends" 
              :key="friend.friendship_id"
              class="friend-card"
            >
              <div class="friend-avatar">
                <img :src="friend.avatar || defaultAvatar" :alt="friend.friend.username" />
                <div :class="['status-indicator', friend.isOnline ? 'online' : 'offline']"></div>
              </div>
              <div class="friend-info">
                <h3 class="friend-name">{{ friend.friend.username }}</h3>
                <p class="friend-status">
                  <span :class="['status-dot', friend.isOnline ? 'online' : 'offline']"></span>
                  {{ friend.isOnline ? ($t('online') || 'En ligne') : ($t('offline') || 'Hors ligne') }}
                </p>
                <p class="friend-since">
                  {{ $t('friendsSince') || 'Amis depuis' }} {{ formatDate(friend.creation_date) }}
                </p>
              </div>
              <div class="friend-actions">
                <button @click="viewProfile(friend.friend.username)" class="btn btn-secondary btn-sm">
                  👤 {{ $t('viewProfile') || 'Voir Profil' }}
                </button>
                <button @click="removeFriend(friend)" class="btn btn-danger btn-sm">
                  🗑️ {{ $t('remove') || 'Supprimer' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet Demandes reçues -->
        <div v-if="activeTab === 'pending'" class="pending-tab">
          <div v-if="loadingPending" class="loading-state">
            <div class="spinner"></div>
            <p>{{ $t('loadingRequests') || 'Chargement des demandes...' }}</p>
          </div>
          
          <div v-else-if="pendingRequests.length === 0" class="empty-state">
            <div class="empty-icon">📬</div>
            <h3>{{ $t('noPendingRequests') || 'Aucune demande en attente' }}</h3>
            <p>{{ $t('noPendingDescription') || 'Vous n\'avez aucune demande d\'ami en attente.' }}</p>
          </div>
          
          <div v-else class="requests-list">
            <div 
              v-for="request in pendingRequests" 
              :key="request.friendship_id"
              class="request-card"
            >
              <div class="request-avatar">
                <img :src="request.avatar || defaultAvatar" :alt="request.sender.username" />
              </div>
              <div class="request-info">
                <h3 class="request-name">{{ request.sender.username }}</h3>
                <p class="request-date">
                  {{ $t('sentOn') || 'Envoyée le' }} {{ formatDate(request.creation_date) }}
                </p>
              </div>
              <div class="request-actions">
                <button @click="acceptRequest(request)" class="btn btn-success btn-sm" :disabled="processingRequest">
                  ✅ {{ $t('accept') || 'Accepter' }}
                </button>
                <button @click="declineRequest(request)" class="btn btn-danger btn-sm" :disabled="processingRequest">
                  ❌ {{ $t('decline') || 'Refuser' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet Demandes envoyées -->
        <div v-if="activeTab === 'sent'" class="sent-tab">
          <div v-if="loadingSent" class="loading-state">
            <div class="spinner"></div>
            <p>{{ $t('loadingSentRequests') || 'Chargement des demandes envoyées...' }}</p>
          </div>
          
          <div v-else-if="sentRequests.length === 0" class="empty-state">
            <div class="empty-icon">📤</div>
            <h3>{{ $t('noSentRequests') || 'Aucune demande envoyée' }}</h3>
            <p>{{ $t('noSentDescription') || 'Vous n\'avez envoyé aucune demande d\'ami.' }}</p>
          </div>
          
          <div v-else class="requests-list">
            <div 
              v-for="request in sentRequests" 
              :key="request.friendship_id"
              class="request-card"
            >
              <div class="request-avatar">
                <img :src="request.avatar || defaultAvatar" :alt="request.receiver.username" />
              </div>
              <div class="request-info">
                <h3 class="request-name">{{ request.receiver.username }}</h3>
                <p class="request-date">
                  {{ $t('sentOn') || 'Envoyée le' }} {{ formatDate(request.creation_date) }}
                </p>
                <p class="request-status">
                  ⏳ {{ $t('pending') || 'En attente' }}
                </p>
              </div>
              <div class="request-actions">
                <button @click="cancelRequest(request)" class="btn btn-danger btn-sm" :disabled="processingRequest">
                  🗑️ {{ $t('cancel') || 'Annuler' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet Ajouter un ami -->
        <div v-if="activeTab === 'add'" class="add-tab">
          <div class="add-friend-form">
            <h3>{{ $t('searchFriend') || 'Rechercher un ami' }}</h3>
            <div class="search-container">
              <input 
                v-model="searchQuery"
                type="text" 
                :placeholder="$t('enterUsername') || 'Entrez le nom d\'utilisateur...'"
                class="search-input"
                @keyup.enter="searchUsers"
              />
              <button @click="searchUsers" class="btn btn-primary" :disabled="!searchQuery.trim()">
                🔍 {{ $t('search') || 'Rechercher' }}
              </button>
            </div>
            
            <!-- Résultats de recherche -->
            <div v-if="searchResults.length > 0" class="search-results">
              <h4>{{ $t('searchResults') || 'Résultats de recherche' }}</h4>
              <div class="results-list">
                <div 
                  v-for="user in searchResults" 
                  :key="user.username"
                  class="result-card"
                >
                  <div class="result-avatar">
                    <img :src="user.avatar || defaultAvatar" :alt="user.username" />
                  </div>
                  <div class="result-info">
                    <h3 class="result-name">{{ user.username }}</h3>
                    <p class="result-stats">
                      {{ user.number_of_matches }} matchs • {{ Math.round(user.ratio * 100) }}% winrate
                    </p>
                  </div>
                  <div class="result-actions">
                    <button 
                      v-if="!isAlreadyFriend(user.username) && !hasPendingRequest(user.username)"
                      @click="sendFriendRequest(user.username)" 
                      class="btn btn-primary btn-sm"
                      :disabled="sendingRequest"
                    >
                      ➕ {{ $t('addFriend') || 'Ajouter' }}
                    </button>
                    <span v-else-if="isAlreadyFriend(user.username)" class="status-badge friends">
                      ✅ {{ $t('alreadyFriends') || 'Déjà amis' }}
                    </span>
                    <span v-else class="status-badge pending">
                      ⏳ {{ $t('requestSent') || 'Demande envoyée' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Aucun résultat -->
            <div v-else-if="searchPerformed && searchResults.length === 0" class="no-results">
              <p>{{ $t('noUsersFound') || 'Aucun utilisateur trouvé avec ce nom.' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bouton de retour -->
      <div class="flex justify-center mt-8">
        <router-link 
          to="/profile" 
          class="btn btn-secondary"
        >
          ← {{ $t('backToProfile') || 'Retour au Profil' }}
        </router-link>
      </div>
    </div>

    <!-- Messages de notification -->
    <div v-if="notification.show" :class="['notification', notification.type]">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { friendsApi } from '../services/friendsAPI'
import { userApi } from '../services/userAPI'
import { DEFAULT_AVATARS_BASE64 } from '../utils/imageUtils'
import { onlineStatusService } from '../services/onlineStatusService'

const { t } = useI18n()
const router = useRouter()

// État réactif
const activeTab = ref('friends')
const friends = ref([])
const pendingRequests = ref([])
const sentRequests = ref([])
const searchQuery = ref('')
const searchResults = ref([])
const searchPerformed = ref(false)

// États de chargement
const loadingFriends = ref(false)
const loadingPending = ref(false)
const loadingSent = ref(false)
const processingRequest = ref(false)
const sendingRequest = ref(false)

// Notification
const notification = ref({
  show: false,
  message: '',
  type: 'success'
})

// Avatar par défaut
const defaultAvatar = DEFAULT_AVATARS_BASE64.default

// Méthodes pour charger les données
const loadFriends = async () => {
  try {
    loadingFriends.value = true
    const response = await friendsApi.getFriendsList()
    
    if (response.friends) {
      // Récupérer les statuts en ligne réels
      const usernames = response.friends.map(friend => friend.friend.username)
      const onlineStatuses = await onlineStatusService.getMultipleUsersStatus(usernames)
      
      friends.value = response.friends.map(friend => ({
        ...friend,
        isOnline: onlineStatuses[friend.friend.username] || false,
        avatar: defaultAvatar // À remplacer par les vraies données depuis le backend
      }))
    }
  } catch (error) {
    showNotification('Erreur lors du chargement des amis', 'error')
  } finally {
    loadingFriends.value = false
  }
}

const loadPendingRequests = async () => {
  try {
    loadingPending.value = true
    const response = await friendsApi.getPendingRequests()
    
    if (response.pending_requests) {
      pendingRequests.value = response.pending_requests.map(request => ({
        ...request,
        avatar: defaultAvatar // À remplacer par les vraies données
      }))
    }
  } catch (error) {
    showNotification('Erreur lors du chargement des demandes', 'error')
  } finally {
    loadingPending.value = false
  }
}

const loadSentRequests = async () => {
  try {
    loadingSent.value = true
    // Note: Il faudra créer cette API côté backend
    sentRequests.value = [] // Placeholder
  } catch (error) {
    showNotification('Erreur lors du chargement des demandes envoyées', 'error')
  } finally {
    loadingSent.value = false
  }
}

// Méthodes d'action
const acceptRequest = async (request) => {
  try {
    processingRequest.value = true
    await friendsApi.acceptFriendRequest(request.friendship_id)
    
    // Retirer de la liste des demandes et ajouter aux amis
    pendingRequests.value = pendingRequests.value.filter(r => r.friendship_id !== request.friendship_id)
    
    // Recharger la liste des amis
    await loadFriends()
    
    showNotification(`Demande de ${request.sender.username} acceptée !`, 'success')
  } catch (error) {
    showNotification('Erreur lors de l\'acceptation de la demande', 'error')
  } finally {
    processingRequest.value = false
  }
}

const declineRequest = async (request) => {
  try {
    processingRequest.value = true
    await friendsApi.declineFriendRequest(request.friendship_id)
    
    // Retirer de la liste des demandes
    pendingRequests.value = pendingRequests.value.filter(r => r.friendship_id !== request.friendship_id)
    
    showNotification(`Demande de ${request.sender.username} refusée`, 'success')
  } catch (error) {
    showNotification('Erreur lors du refus de la demande', 'error')
  } finally {
    processingRequest.value = false
  }
}

const removeFriend = async (friend) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer ${friend.friend.username} de vos amis ?`)) {
    return
  }
  
  try {
    await friendsApi.deleteFriendship(friend.friendship_id)
    
    // Retirer de la liste des amis
    friends.value = friends.value.filter(f => f.friendship_id !== friend.friendship_id)
    
    showNotification(`${friend.friend.username} retiré de vos amis`, 'success')
  } catch (error) {
    showNotification('Erreur lors de la suppression de l\'ami', 'error')
  }
}

const searchUsers = async () => {
  if (!searchQuery.value.trim()) return
  
  try {
    searchPerformed.value = true
    console.log('🔍 Recherche de:', searchQuery.value.trim())
    
    // Vérifier le token
    const token = localStorage.getItem('auth_token') || localStorage.getItem('user-token')
    console.log('🔑 Token présent:', !!token)
    
    // Appel API
    const response = await friendsApi.searchUsers(searchQuery.value.trim())
    console.log('📊 Réponse API complète:', response)
    console.log('📊 Type de réponse:', typeof response)
    console.log('📊 Nombre de résultats:', response?.length || 0)
    
    searchResults.value = response || []
    
    if (searchResults.value.length === 0) {
      console.log('❌ Aucun utilisateur trouvé pour:', searchQuery.value)
    } else {
      console.log('✅ Utilisateurs trouvés:', searchResults.value.map(u => u.username))
    }
  } catch (error) {
    console.error('❌ Erreur complète:', error)
    console.error('❌ Message d\'erreur:', error.message)
    console.error('❌ Stack trace:', error.stack)
    showNotification('Erreur lors de la recherche: ' + error.message, 'error')
    searchResults.value = []
  }
}

const sendFriendRequest = async (username) => {
  try {
    sendingRequest.value = true
    await friendsApi.sendFriendRequest(username)
    
    showNotification(`Demande d'ami envoyée à ${username} !`, 'success')
    
    // Recharger les demandes envoyées
    await loadSentRequests()
  } catch (error) {
    showNotification('Erreur lors de l\'envoi de la demande', 'error')
  } finally {
    sendingRequest.value = false
  }
}

const viewProfile = (username) => {
  router.push(`/profile/${username}`)
}

// Méthodes utilitaires
const isAlreadyFriend = (username) => {
  return friends.value.some(friend => friend.friend.username === username)
}

const hasPendingRequest = (username) => {
  return sentRequests.value.some(request => request.receiver.username === username)
}

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString))
}

const showNotification = (message, type = 'success') => {
  notification.value = {
    show: true,
    message,
    type
  }
  
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadFriends(),
    loadPendingRequests(),
    loadSentRequests()
  ])
})
</script>

<style scoped>
.friends-manager {
  min-height: 100vh;
  color: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Onglets */
.tabs-container {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 0.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.tabs-nav {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  background: transparent;
  color: #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  position: relative;
}

.tab-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #f8f9fa;
}

.tab-button.active {
  background: linear-gradient(135deg, #d4af37, #c19b2e);
  color: #1a1a1a;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.tab-count {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 50%;
  font-size: 0.8rem;
  min-width: 1.5rem;
  text-align: center;
}

.tab-button.active .tab-count {
  background: rgba(26, 26, 26, 0.2);
  color: #1a1a1a;
}

/* Contenu */
.tab-content {
  margin-top: 2rem;
}

/* États de chargement et vides */
.loading-state, .empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid rgba(212, 175, 55, 0.3);
  border-top: 3px solid #d4af37;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.empty-state h3 {
  color: #d4af37;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #e0e0e0;
  margin-bottom: 1.5rem;
}

/* Grille d'amis */
.friends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.friend-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.friend-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  border-color: #d4af37;
  box-shadow: 0 10px 25px rgba(212, 175, 55, 0.2);
}

.friend-avatar {
  position: relative;
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
}

.friend-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #d4af37;
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #1a1a1a;
}

.status-indicator.online {
  background-color: #22c55e;
}

.status-indicator.offline {
  background-color: #6b7280;
}

.friend-info {
  text-align: center;
  margin-bottom: 1rem;
}

.friend-name {
  color: #d4af37;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.friend-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  color: #e0e0e0;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.online {
  background-color: #22c55e;
}

.status-dot.offline {
  background-color: #6b7280;
}

.friend-since {
  font-size: 0.8rem;
  color: #a0a0a0;
}

.friend-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

/* Listes de demandes */
.requests-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.request-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.request-card:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #d4af37;
}

.request-avatar img, .result-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #d4af37;
}

.request-info {
  flex: 1;
}

.request-name, .result-name {
  color: #d4af37;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.request-date, .result-stats {
  color: #e0e0e0;
  font-size: 0.9rem;
}

.request-status {
  color: #a0a0a0;
  font-size: 0.8rem;
}

.request-actions, .result-actions {
  display: flex;
  gap: 0.5rem;
}

/* Formulaire d'ajout */
.add-friend-form {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 1rem;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.add-friend-form h3 {
  color: #d4af37;
  margin-bottom: 1.5rem;
  text-align: center;
}

.search-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input {
  flex: 1;
  padding: 1rem;
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: #f8f9fa;
  backdrop-filter: blur(10px);
}

.search-input:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.3);
}

.search-input::placeholder {
  color: #a0a0a0;
}

.search-results {
  margin-top: 2rem;
}

.search-results h4 {
  color: #d4af37;
  margin-bottom: 1rem;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 0.75rem;
  padding: 1rem;
}

.result-info {
  flex: 1;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.friends {
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.status-badge.pending {
  background: rgba(251, 191, 36, 0.2);
  color: #fcd34d;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: #a0a0a0;
}

/* Boutons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  justify-content: center;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-primary {
  background: linear-gradient(135deg, #d4af37, #c19b2e);
  color: #1a1a1a;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #f8f9fa;
  border: 2px solid rgba(212, 175, 55, 0.3);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #d4af37;
  transform: translateY(-2px);
}

.btn-success {
  background: rgba(34, 197, 94, 0.8);
  color: white;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.btn-success:hover {
  background: rgba(34, 197, 94, 0.9);
  transform: translateY(-2px);
}

.btn-danger {
  background: rgba(239, 68, 68, 0.8);
  color: white;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.9);
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Notification */
.notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.notification.success {
  background: rgba(34, 197, 94, 0.9);
  color: white;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.notification.error {
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* Classes utilitaires */
.flex { display: flex; }
.justify-center { justify-content: center; }
.items-center { align-items: center; }
.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1rem; }
.mt-8 { margin-top: 2rem; }

/* Animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0 0.5rem;
  }
  
  .tabs-nav {
    flex-direction: column;
  }
  
  .tab-button {
    padding: 0.75rem 1rem;
  }
  
  .friends-grid {
    grid-template-columns: 1fr;
  }
  
  .search-container {
    flex-direction: column;
  }
  
  .request-card, .result-card {
    flex-direction: column;
    text-align: center;
  }
  
  .request-actions, .result-actions {
    justify-content: center;
    margin-top: 1rem;
  }
  
  .friend-actions {
    flex-direction: column;
  }
}
</style>