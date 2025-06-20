<template>
  <!-- Page d'inscription -->
  <div class="signup-container">
    <!-- Header avec retour et langue -->
    <header class="header">
      <button @click="goBack" class="back-button">
        <svg class="back-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
        </svg>
        {{ $t('backToHome') }}
      </button>
      
      <div class="language-switcher-header">
        <select v-model="$i18n.locale" @change="saveLanguagePreference" class="language-select">
          <option value="en">🇺🇸 English</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="es">🇪🇸 Español</option>
          <option value="it">🇮🇹 Italiano</option>
        </select>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="signup-main">
      <div class="signup-content">
        <!-- Logo et titre -->
        <div class="logo-container">
          <div class="billiard-ball ball-8"></div>
          <h1 class="title">{{ $t('signUpTitle') }}</h1>
          <p class="subtitle">{{ $t('signUpSubtitle') }}</p>
        </div>
        
        <!-- Messages d'erreur -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <!-- Messages de succès -->
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
        
        <!-- Formulaire d'inscription -->
        <form @submit.prevent="handleSignUp" class="signup-form">
          <div class="form-group">
            <label for="username">{{ $t('username') }}</label>
            <input 
              id="username"
              v-model="form.username"
              type="text"
              required
              placeholder="username"
              class="form-input"
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="email">{{ $t('email') }}</label>
            <input 
              id="email"
              v-model="form.email"
              type="email"
              required
              :placeholder="$t('emailPlaceholder')"
              class="form-input"
              :disabled="loading"
            />
          </div>
          
          <div class="form-group">
            <label for="password">{{ $t('password') }}</label>
            <div class="password-input-container">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Password"
                class="form-input"
                :disabled="loading"
              />
              <button 
                type="button" 
                @click="togglePassword" 
                class="password-toggle"
                :disabled="loading"
              >
                <svg v-if="showPassword" class="eye-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"></path>
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"></path>
                </svg>
                <svg v-else class="eye-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
            <!-- Jauge de force du mot de passe -->
            <div class="password-strength-container">
              <div class="password-strength-bar" :style="{ width: passwordStrength + '%' }">
                <div class="strength-level" :class="[
                  { 'very-weak': passwordStrength <= 20 },
                  { 'weak': passwordStrength > 20 && passwordStrength <= 40 },
                  { 'medium': passwordStrength > 40 && passwordStrength <= 60 },
                  { 'strong': passwordStrength > 60 && passwordStrength <= 80 },
                  { 'very-strong': passwordStrength > 80 }
                ]"></div>
              </div>
              <div v-if="passwordFeedback" class="password-feedback">
                {{ passwordFeedback }}
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">{{ $t('confirmPassword') }}</label>
            <div class="password-input-container">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                :placeholder="$t('confirmPasswordPlaceholder')"
                class="form-input"
                :disabled="loading"
              />
              <button 
                type="button" 
                @click="toggleConfirmPassword" 
                class="password-toggle"
                :disabled="loading"
              >
                <svg v-if="showConfirmPassword" class="eye-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"></path>
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"></path>
                </svg>
                <svg v-else class="eye-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <button type="submit" class="signup-button" :disabled="loading">
            <svg v-if="loading" class="loading-spinner" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? $t('signingUp') : $t('signUp') }}
          </button>
        </form>
        
        <!-- Lien vers connexion -->
        <p class="signin-link">
          {{ $t('alreadyHaveAccount') }} 
          <a href="#" @click.prevent="goToSignIn" class="link">{{ $t('signIn') }}</a>
        </p>
      </div>

      <!-- Décoration avec boules de billard -->
      <div class="billiard-decoration">
        <div class="billiard-ball ball-1 floating" style="top: 15%; left: 10%;"></div>
        <div class="billiard-ball ball-2 floating" style="top: 25%; right: 15%;"></div>
        <div class="billiard-ball ball-3 floating" style="top: 65%; left: 8%;"></div>
        <div class="billiard-ball ball-4 floating" style="top: 75%; right: 12%;"></div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuth } from '../composable/useAuths'

// Utilisation de vue-i18n
const { t, locale } = useI18n()

// Utilisation du composable d'authentification
const { register, login } = useAuth()

// Router
const router = useRouter()

// États réactifs
const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const passwordStrength = ref(0)
const passwordFeedback = ref('')

// Charger la langue préférée
const savedLanguage = localStorage.getItem('preferred-language')
if (savedLanguage && ['en', 'fr', 'es', 'it'].includes(savedLanguage)) {
  locale.value = savedLanguage
}

// Fonction pour évaluer la force du mot de passe
const evaluatePasswordStrength = (password) => {
  let strength = 0
  let feedback = []

  // Vérifier la longueur minimum (8 caractères)
  if (password.length >= 8) {
    strength += 20
  } else {
    feedback.push('Au moins 8 caractères')
  }

  // Vérifier les lettres majuscules
  if (/[A-Z]/.test(password)) {
    strength += 20
  } else {
    feedback.push('Au moins une majuscule')
  }

  // Vérifier les lettres minuscules
  if (/[a-z]/.test(password)) {
    strength += 20
  } else {
    feedback.push('Au moins une minuscule')
  }

  // Vérifier les chiffres
  if (/[0-9]/.test(password)) {
    strength += 20
  } else {
    feedback.push('Au moins un chiffre')
  }

  // Vérifier les caractères spéciaux
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    strength += 20
  } else {
    feedback.push('Au moins un caractère spécial')
  }

  passwordStrength.value = strength
  passwordFeedback.value = feedback.join(' - ')
}

// Méthodes
const saveLanguagePreference = () => {
  localStorage.setItem('preferred-language', locale.value)
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const validateForm = () => {
  if (!form.value.username || !form.value.email || !form.value.password || !form.value.confirmPassword) {
    error.value = t('allFieldsRequired')
    return false
  }

  if (form.value.password !== form.value.confirmPassword) {
    error.value = t('passwordsDoNotMatch')
    return false
  }

  if (form.value.password.length < 8) {
    error.value = t('passwordTooShort')
    return false
  }

  return true
}

const handleSignUp = async () => {
  if (!validateForm()) return

  error.value = ''
  successMessage.value = ''
  loading.value = true
  
  try {
    const response = await register({
      username: form.value.username,
      email_adress: form.value.email,
      password: form.value.password
    })
    
    if (response.message === 'User created successfully') {
      successMessage.value = t('registrationSuccessful')
      
      // Rediriger vers la page de connexion après inscription réussie
      setTimeout(() => {
        router.push('/signin')
      }, 2000)
    }
    
  } catch (err) {
    // Simplified error handling
    error.value = err?.message || t('registrationError')
  } finally {
    loading.value = false
  }
}

const goToSignIn = () => {
  router.push('/signin')
}

const goBack = () => {
  router.push('/')
}

// Écouter les changements du mot de passe
watch(() => form.value.password, (newPassword) => {
  if (newPassword) {
    evaluatePasswordStrength(newPassword)
  } else {
    passwordStrength.value = 0
    passwordFeedback.value = ''
  }
})
</script>

<style scoped>
.signup-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%);
  color: #f8f9fa;
  position: relative;
  overflow-x: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #d4af37;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  font-weight: 500;
}

.back-button:hover {
  background: rgba(212, 175, 55, 0.2);
}

.back-icon {
  width: 20px;
  height: 20px;
}

.language-select {
  padding: 0.5rem 1rem;
  border: 2px solid #d4af37;
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 0.9);
  color: #1a1a1a;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.signup-main {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
  position: relative;
}

.signup-content {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 1.5rem;
  padding: 3rem;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  z-index: 2;
}

.logo-container {
  text-align: center;
  margin-bottom: 2rem;
}

.ball-8 {
  width: 60px;
  height: 60px;
  background-color: #000;
  border-radius: 50%;
  position: relative;
  margin: 0 auto 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.ball-8::after {
  content: "8";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 24px;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: #d4af37;
  margin-bottom: 0.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.subtitle {
  color: #e0e0e0;
  margin-bottom: 0;
}

.error-message {
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  background-color: rgba(220, 53, 69, 0.8);
  color: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  border-left: 4px solid #dc3545;
}

.success-message {
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  background-color: rgba(40, 167, 69, 0.8);
  color: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  border-left: 4px solid #28a745;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-input {
  padding: 0.875rem;
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: #f8f9fa;
  transition: all 0.2s ease-in-out;
}

.form-input:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.3);
  background-color: rgba(255, 255, 255, 0.15);
}

.password-input-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #d4af37;
  cursor: pointer;
  padding: 0.25rem;
}

.eye-icon {
  width: 20px;
  height: 20px;
}

.signup-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #d4af37, #c19b2e);
  color: #1a1a1a;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 1rem;
}

.signup-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
}

.signup-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.signin-link {
  text-align: center;
  margin-top: 2rem;
  color: #e0e0e0;
  font-size: 0.875rem;
}

.link {
  color: #d4af37;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.link:hover {
  color: #c19b2e;
  text-decoration: underline;
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

.ball-1 { background-color: #ffeb3b; }
.ball-2 { background-color: #2196f3; }
.ball-3 { background-color: #f44336; }
.ball-4 { background-color: #9c27b0; }

.floating {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.password-strength-container {
  margin-top: 0.5rem;
}

.password-strength-bar {
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.strength-level {
  height: 100%;
  width: 100%;
  transition: all 0.3s ease;
}

.strength-level.very-weak {
  background-color: #ff4444;
  width: 20%;
}

.strength-level.weak {
  background-color: #ffa700;
  width: 40%;
}

.strength-level.medium {
  background-color: #ffdb4a;
  width: 60%;
}

.strength-level.strong {
  background-color: #99cc00;
  width: 80%;
}

.strength-level.very-strong {
  background-color: #00c851;
  width: 100%;
}

.password-feedback {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #e0e0e0;
  text-align: left;
}
</style>
