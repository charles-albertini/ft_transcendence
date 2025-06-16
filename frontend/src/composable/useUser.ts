import { ref, computed } from "vue"
import { userApi } from "../services/userAPI"

const user = ref(null)
const userHistory = ref([])
const loading = ref(false)
const error = ref("")

export function useUser() {
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => !!error.value)

  // Récupérer les informations utilisateur
  const fetchUser = async () => {
    loading.value = true
    error.value = ""

    try {
      const userData = await userApi.getUser()
      user.value = userData
      return userData
    } catch (err: any) {
      error.value = err.message || "Erreur lors de la récupération des données utilisateur"
      throw err
    } finally {
      loading.value = false
    }
  }

  // Mettre à jour les informations utilisateur
  const updateUser = async (userData: Record<string, any>) => {
    loading.value = true
    error.value = ""

    try {
      const updatedUser = await userApi.updateUser(userData)
      user.value = updatedUser
      return updatedUser
    } catch (err: any) {
      error.value = err.message || "Erreur lors de la mise à jour"
      throw err
    } finally {
      loading.value = false
    }
  }

  // Supprimer le compte utilisateur
  const deleteUser = async () => {
    loading.value = true
    error.value = ""

    try {
      const result = await userApi.deleteUser()
      // Nettoyer les données locales après suppression
      user.value = null
      localStorage.removeItem("auth_token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("user_data")
      return result
    } catch (err: any) {
      error.value = err.message || "Erreur lors de la suppression du compte"
      throw err
    } finally {
      loading.value = false
    }
  }

  // Récupérer l'historique d'un utilisateur
  const fetchHistory = async (username: string) => {
    loading.value = true
    error.value = ""

    try {
      const history = await userApi.getHistory(username)
      userHistory.value = history
      return history
    } catch (err: any) {
      error.value = err.message || "Erreur lors de la récupération de l'historique"
      throw err
    } finally {
      loading.value = false
    }
  }

  // Réinitialiser les erreurs
  const clearError = () => {
    error.value = ""
  }

  return {
    // État
    user: computed(() => user.value),
    userHistory: computed(() => userHistory.value),
    isLoading,
    error: computed(() => error.value),
    hasError,

    // Actions
    fetchUser,
    updateUser,
    deleteUser,
    fetchHistory,
    clearError,
  }
}
