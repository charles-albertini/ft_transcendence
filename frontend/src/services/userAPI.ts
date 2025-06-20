// Fonction pour rafraîchir le token (sans utiliser fetchWithAuth pour éviter la référence circulaire)
const refreshTokenDirect = async (refreshToken: string) => {
  const response = await fetch("/api/auth/refreshtoken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${refreshToken}`,
    },
    body: JSON.stringify({ refreshtoken: refreshToken }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
  }

  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return await response.json()
  }

  return {}
}

// Fonction utilitaire pour les requêtes fetch
const fetchWithAuth = async (url: string, options: RequestInit = {}, isRetry = false) => {
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
  
	  // Si le token a expiré (401) et qu'on n'a pas encore essayé de le rafraîchir
	  if (response.status === 401 && !isRetry && url !== "/auth/refreshtoken") {
		const refreshToken = localStorage.getItem("refresh_token")
		
		if (refreshToken) {
		  try {
			// Tenter de rafraîchir le token directement
			const refreshResponse = await refreshTokenDirect(refreshToken)
			
			// Sauvegarder le nouveau token
			if (refreshResponse.token) {
			  localStorage.setItem("auth_token", refreshResponse.token)
			  
			  // Optionnel: sauvegarder le nouveau refresh token s'il est fourni
			  if (refreshResponse.refreshToken) {
				localStorage.setItem("refresh_token", refreshResponse.refreshToken)
			  }
			  
			  // Réessayer la requête originale avec le nouveau token
			  return fetchWithAuth(url, options, true)
			}
		  } catch (refreshError) {
			// Si le refresh échoue, déconnecter l'utilisateur
			localStorage.removeItem("auth_token")
			localStorage.removeItem("refresh_token")
			localStorage.removeItem("temp_2fa_token")
			
			// Rediriger vers la page de connexion
			window.location.href = "/signin"
			throw new Error("Session expired. Please log in again.")
		  }
		} else {
		  // Pas de refresh token, déconnecter
		  localStorage.removeItem("auth_token")
		  localStorage.removeItem("temp_2fa_token")
		  window.location.href = "/signin"
		  throw new Error("Session expired. Please log in again.")
		}
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
	  throw error
	}
  }
  
  // API des statistiques utilisateur
  export const userApi = {
	// Récupérer les informations utilisateur
	getUser: async (username?: string) => {
		const currentUser = JSON.parse(localStorage.getItem("user_data") || '{}');
		const usernameParam = username || currentUser.username;
		if (!usernameParam) {
			throw new Error("Nom d'utilisateur requis");
		}
		return fetchWithAuth(`/profile/user/${usernameParam}`)
	},

	// Supprimer un utilisateur
	deleteUser: async () => {
		return fetchWithAuth("/profile/delete", {
			method: "DELETE",
		})
	},

	// Mettre à jour les informations utilisateur
	updateUser: async (userData: Record<string, any>) => {
		return fetchWithAuth("/profile/update", {
			method: "PATCH",
			body: JSON.stringify(userData),
		})
	},

	// Récupérer l'historique d'un utilisateur
	getHistory: async (username?: string) => {
		const currentUser = JSON.parse(localStorage.getItem("user_data") || '{}');
		const usernameParam = username || currentUser.username;
		if (!usernameParam) {
			throw new Error("Nom d'utilisateur requis");
		}
		return fetchWithAuth(`/profile/history/${usernameParam}`)
	},

	// Changer le mot de passe
	changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
		return fetchWithAuth("/profile/changePassword", {
			method: "PATCH",
			body: JSON.stringify(passwordData),
		})
	}
}

