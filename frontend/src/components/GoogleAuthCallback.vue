<template>
  <div class="auth-callback-container">
    <div class="auth-callback-content">
      <!-- État de chargement -->
      <div v-if="isProcessing" class="loading-state">
        <div class="loading-spinner"></div>
        <h2>{{ $t('processingAuthentication') || 'Traitement de l\'authentification...' }}</h2>
        <p>{{ $t('pleaseWait') || 'Veuillez patienter pendant que nous vous connectons.' }}</p>
      </div>

      <!-- Succès -->
      <div v-else-if="authStatus === 'success'" class="success-state">
        <div class="success-icon">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <h2>{{ $t('authenticationSuccess') || 'Connexion réussie !' }}</h2>
        <p>{{ $t('redirectingToHome') || 'Redirection vers l\'accueil...' }}</p>
      </div>

      <!-- Erreur -->
      <div v-else-if="authStatus === 'error'" class="error-state">
        <div class="error-icon">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <h2>{{ $t('authenticationError') || 'Erreur d\'authentification' }}</h2>
        <p>{{ errorMessage || $t('defaultAuthError') || 'Une erreur s\'est produite lors de l\'authentification avec Google.' }}</p>
        <div class="error-actions">
          <button @click="retryAuthentication" class="retry-btn">
            {{ $t('retry') || 'Réessayer' }}
          </button>
          <router-link to="/signin" class="signin-link">
            {{ $t('backToSignIn') || 'Retour à la connexion' }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '../composable/useAuths'
import { googleAuthService } from '../services/googleAuthAPI'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { initializeAuth } = useAuth()

// États réactifs
const isProcessing = ref(true)
const authStatus = ref<'pending' | 'success' | 'error'>('pending')
const errorMessage = ref('')

// Traitement du callback Google
const processGoogleCallback = async () => {
  try {
    // Vérifier si nous sommes sur la route d'erreur
    if (route.name === 'GoogleAuthError') {
      authStatus.value = 'error'
      errorMessage.value = t('googleAuthenticationFailed') || 'L\'authentification Google a échoué.'
      isProcessing.value = false
      return
    }

    // Extraire les tokens de l'URL
    const { token, refreshToken } = googleAuthService.extractTokensFromUrl()

    if (!token || !refreshToken) {
      throw new Error('Tokens manquants dans la réponse de Google')
    }

    // Nettoyer l'URL
    googleAuthService.cleanUrl()

    // Stocker les tokens
    localStorage.setItem('auth_token', token)
    localStorage.setItem('refresh_token', refreshToken)
    localStorage.setItem('user-token', token) // Pour compatibilité

    // Mettre à jour l'état d'authentification
    initializeAuth()

    // Marquer comme succès
    authStatus.value = 'success'
    isProcessing.value = false

    // Rediriger vers la page d'accueil après un court délai
    setTimeout(() => {
      router.push('/Home2')
    }, 2000)

  } catch (error) {
    authStatus.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : 'Erreur inconnue'
    isProcessing.value = false
  }
}

// Réessayer l'authentification
const retryAuthentication = () => {
  googleAuthService.initiateGoogleLogin()
}

// Traitement au montage du composant
onMounted(() => {
  processGoogleCallback()
})
</script>

<style scoped>
.auth-callback-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-callback-content {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 1rem;
  padding: 3rem;
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.loading-state {
  color: #f8f9fa;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(212, 175, 55, 0.3);
  border-top: 4px solid #d4af37;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success-state {
  color: #10b981;
}

.success-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
}

.error-state {
  color: #ef4444;
}

.error-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
}

.auth-callback-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.auth-callback-content p {
  margin-bottom: 2rem;
  opacity: 0.8;
}

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.retry-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background: #dc2626;
}

.signin-link {
  color: #d4af37;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.signin-link:hover {
  color: #fbbf24;
}
</style>
