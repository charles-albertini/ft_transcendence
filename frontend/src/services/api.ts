// Fonction utilitaire pour les requêtes fetch
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
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
  
  // API d'authentification - CORRIGÉE pour correspondre au backend
  export const authApi = {
	// Connexion utilisateur - CHANGÉ: /auth/login -> /auth
	login: async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
	  return await fetchWithAuth('/auth', {
		method: 'POST',
		body: JSON.stringify(credentials),
	  })
	},
  
	// Vérification 2FA - CHANGÉ: /auth/verify-2fa -> /auth/check2FA
	check2FA: async (code: string) => {
	  return await fetchWithAuth('/auth/check2FA', {
		method: 'POST',
		body: JSON.stringify({ code }),
	  })
	},
  
	// Inscription utilisateur - Mise à jour pour correspondre au backend
	register: async (userData: { 
	  username: string;
	  email_adress: string;
	  password: string;
	}) => {
	  return await fetchWithAuth('/auth/register', {
		method: 'POST',
		body: JSON.stringify(userData),
	  })
	},
  
	// Actualisation du token - CHANGÉ: /auth/refresh-token -> /auth/refreshtoken
	refreshToken: async () => {
	  const refreshToken = localStorage.getItem('refresh_token')
	  if (!refreshToken) {
		throw new Error('No refresh token available')
	  }
	  
	  return await fetchWithAuth('/auth/refreshtoken', {
		method: 'POST',
		body: JSON.stringify({ refreshToken }),
	  })
	},
  
	// Routes non encore implémentées côté backend - À commenter ou implémenter
	/*
	logout: async () => {
	  return await fetchWithAuth('/auth/logout', {
		method: 'POST',
	  })
	},
  
	getProfile: async () => {
	  return await fetchWithAuth('/auth/profile')
	},
  
	updateProfile: async (profileData: any) => {
	  return await fetchWithAuth('/auth/profile', {
		method: 'PUT',
		body: JSON.stringify(profileData),
	  })
	},
  
	forgotPassword: async (email: string) => {
	  return await fetchWithAuth('/auth/forgot-password', {
		method: 'POST',
		body: JSON.stringify({ email }),
	  })
	},
  
	resetPassword: async (token: string, password: string) => {
	  return await fetchWithAuth('/auth/reset-password', {
		method: 'POST',
		body: JSON.stringify({ token, password }),
	  })
	},
  
	verifyToken: async () => {
	  return await fetchWithAuth('/auth/verify-token')
	}
	*/
  }