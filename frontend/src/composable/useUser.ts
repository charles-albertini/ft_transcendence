import { ref, computed } from "vue"
import { userApi } from "../services/userAPI"

const user = ref(null)
const userHistory = ref([])
const loading = ref(false)
const error = ref("")

export function useUser() {
  const isLoading = computed(() => loading.value)

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

  return {
    // État
    user: computed(() => user.value),
    userHistory: computed(() => userHistory.value),
    isLoading,
    error: computed(() => error.value),

    // Actions
    fetchUser,
    updateUser,
    deleteUser,
  }
}
