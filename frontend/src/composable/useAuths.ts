import { ref, computed } from "vue"
import { authApi } from "../services/authAPI"

// Fonction pour récupérer le token actuel
const getCurrentToken = () => {
  return localStorage.getItem("auth_token") || localStorage.getItem("user-token");
}

const user = ref(null)
const token = ref(getCurrentToken())
const refreshToken = ref(localStorage.getItem("refresh_token"))
const loading = ref(false)
const error = ref("")

// Écouter les changements dans localStorage
const updateTokenFromStorage = () => {
  token.value = getCurrentToken();
}

// Ajouter un écouteur pour les changements de storage
if (typeof window !== 'undefined') {
  window.addEventListener('storage', updateTokenFromStorage);
}

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value)
  const isLoading = computed(() => loading.value)

  const register = async (userData: { username: string; email_adress: string; password: string }) => {
    loading.value = true
    error.value = ""

    try {
      const response = await authApi.register(userData)
      return response
    } catch (err: any) {
      error.value = err.message || "Erreur d'inscription"
      throw err
    } finally {
      loading.value = false
    }
  }

  const login = async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    loading.value = true
    error.value = ""

    try {
      const response = await authApi.login(credentials)

      if (response.token || response.accessToken) {
        const authToken = response.token || response.accessToken
        token.value = authToken
        localStorage.setItem("auth_token", authToken)
        // Supprimer l'ancien token s'il existe
        localStorage.removeItem("user-token")
      }

      if (response.refreshToken) {
        refreshToken.value = response.refreshToken
        localStorage.setItem("refresh_token", response.refreshToken)
      }

      if (response.user) {
        user.value = response.user
        localStorage.setItem("user_data", JSON.stringify(response.user))
      }

      return response
    } catch (err: any) {
      error.value = err.message || "Erreur de connexion"
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    refreshToken.value = null
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user-token") // Nettoyer aussi l'ancien token
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user_data")
    localStorage.removeItem("remember_me")
    localStorage.removeItem("user_email")
  }

  const initializeAuth = () => {
    // Mettre à jour le token depuis localStorage
    token.value = getCurrentToken();
    
    const savedUser = localStorage.getItem("user_data")
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (error) {
        localStorage.removeItem("user_data")
      }
    }
  }

  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    isAuthenticated,
    isLoading,
    error: computed(() => error.value),
    login,
    logout,
    initializeAuth,
    register,
  }
}
