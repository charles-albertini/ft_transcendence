// Service pour l'authentification Google
export class GoogleAuthService {
  private static instance: GoogleAuthService
  private baseURL = '/api'

  static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService()
    }
    return GoogleAuthService.instance
  }

  // Rediriger vers Google OAuth
  initiateGoogleLogin(): void {
    const googleAuthUrl = `${this.baseURL}/auth/google`
    window.location.href = googleAuthUrl
  }

  // Extraire les tokens depuis l'URL après redirect
  extractTokensFromUrl(): { token: string | null; refreshToken: string | null } {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const refreshToken = urlParams.get('refreshToken')
    
    return { token, refreshToken }
  }

  // Nettoyer l'URL après extraction des tokens
  cleanUrl(): void {
    const url = new URL(window.location.href)
    url.search = ''
    window.history.replaceState({}, document.title, url.toString())
  }
}

// Export de l'instance singleton
export const googleAuthService = GoogleAuthService.getInstance()
