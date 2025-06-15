// Fonction utilitaire pour les requêtes fetch
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
	// Récupérer le token d'authentification
	const token = localStorage.getItem("auth_token")
  
	// Préparer les headers avec le token
	const headers = {
	  "Content-Type": "application/json",
	  ...(token ? { Authorization: `Bearer ${token}` } : {}),
	  ...options.headers,
	}
  
	try {
	  // Effectuer la requête
	  const response = await fetch(`/api${url}`, {
		...options,
		headers,
	  })
  
	  // Gérer les erreurs d'authentification
	  if (response.status === 401) {
		localStorage.removeItem("auth_token")
		window.location.href = "/signin"
		throw new Error("Session expirée. Veuillez vous reconnecter.")
	  }
  
	  // Vérifier si la réponse est OK
	  if (!response.ok) {
		const errorData = await response.json().catch(() => ({}))
		throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`)
	  }
  
	  // Vérifier si la réponse est vide
	  const contentType = response.headers.get("content-type")
	  if (contentType && contentType.includes("application/json")) {
		return await response.json()
	  }
  
	  return {}
	} catch (error) {
	  console.error("API request error:", error)
	  throw error
	}
  }
  
  // API des statistiques utilisateur
  export const userApi = {
	// Récupérer les informations utilisateur
	getUser: async () => {
	  return fetchWithAuth("/stats/user")
	},
  
	// Supprimer un utilisateur
	deleteUser: async () => {
	  return fetchWithAuth("/stats/delete", {
		method: "DELETE",
	  })
	},
  
	// Mettre à jour les informations utilisateur
	updateUser: async (userData: Record<string, any>) => {
	  return fetchWithAuth("/stats/update", {
		method: "PATCH",
		body: JSON.stringify(userData),
	  })
	},
  
	// Récupérer l'historique d'un utilisateur
	getHistory: async (username: string) => {
	  return fetchWithAuth(`/stats/history/${username}`)
	},
  }
  