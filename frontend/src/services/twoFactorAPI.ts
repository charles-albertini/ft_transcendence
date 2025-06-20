// Service pour les appels API 2FA
export class TwoFactorService {
  private static instance: TwoFactorService
  private baseURL = '/api/auth'

  static getInstance(): TwoFactorService {
    if (!TwoFactorService.instance) {
      TwoFactorService.instance = new TwoFactorService()
    }
    return TwoFactorService.instance
  }

  // Activer la 2FA et générer le QR code
  async enable2FA(token: string): Promise<{ qrCode: string; secret: string }> {
    const response = await fetch(`${this.baseURL}/enable2FA`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    return {
      qrCode: data.qrCode,
      secret: data.secret
    }
  }

  // Vérifier le code 2FA
  async verify2FA(token: string, code: string): Promise<{ success: boolean; message?: string }> {
    const response = await fetch(`${this.baseURL}/check2FA`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    })

    if (response.ok) {
      await response.json()
      return { success: true, message: 'Code verified successfully' }
    } else {
      const errorData = await response.json()
      return { success: false, message: errorData.error || 'Invalid code' }
    }
  }

  // Désactiver la 2FA
  async disable2FA(token: string): Promise<{ success: boolean; message?: string }> {
    const response = await fetch(`${this.baseURL}/disable2FA`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      return { success: true, message: '2FA disabled successfully' }
    } else {
      const errorData = await response.json()
      return { success: false, message: errorData.error || 'Failed to disable 2FA' }
    }
  }
}

// Export de l'instance singleton
export const twoFactorService = TwoFactorService.getInstance()
