// Fonction pour rafraîchir le token (sans utiliser fetchApi pour éviter la référence circulaire)
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
const fetchApi = async (url: string, options: RequestInit = {}, isRetry = false) => {
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
			  return fetchApi(url, options, true)
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
		throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
	  }
  
	  // Vérifier si la réponse est vide
	  const contentType = response.headers.get("content-type")
	  if (contentType && contentType.includes("application/json")) {
		return await response.json()
	  }
  
	  return {}
	} catch (error: any) {
	  throw error
	}
  }
  
  // Fonctions d'authentification
  export const authApi = {
	// Inscription
	register: async (userData: Record<string, any>) => {
	  try {
		return await fetchApi("/auth/register", {
		  method: "POST",
		  body: JSON.stringify(userData),
		})
	  } catch (error) {
		throw error
	  }
	},
  
	// Connexion
	login: async (credentials: Record<string, any>) => {
	  const response = await fetchApi("/auth", {
		method: "POST",
		body: JSON.stringify(credentials),
	  })
	  
	  // Sauvegarder le refresh token après connexion réussie
	  if (response.refreshToken) {
		localStorage.setItem("refresh_token", response.refreshToken)
	  }
	  
	  return response
	},
  
	// Rafraîchir le token
	refreshToken: async (refreshToken: string) => {
	  return fetchApi("/auth/refreshtoken", {
		method: "POST",
		body: JSON.stringify({ refreshtoken: refreshToken }),
	  })
	},
  
	// Activer 2FA
	enable2FA: async () => {
	  return fetchApi("/auth/enable2FA")
	},
  
	// Vérifier 2FA
	check2FA: async (code: string) => {
	  // Utiliser le token temporaire pour la vérification 2FA
	  const tempToken = localStorage.getItem('temp_2fa_token')
	  
	  const response = await fetchApi("/auth/check2FA", {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		  ...(tempToken ? { Authorization: `Bearer ${tempToken}` } : {}),
		},
		body: JSON.stringify({ code }),
	  })
	  
	  // Sauvegarder le refresh token après vérification 2FA réussie
	  if (response.refreshToken) {
		localStorage.setItem("refresh_token", response.refreshToken)
	  }
	  
	  return response
	},
  
	// Désactiver 2FA
	disable2FA: async (code: string) => {
	  return fetchApi("/auth/disable2FA", {
		method: "POST",
		body: JSON.stringify({ code }),
	  })
	},
  }
