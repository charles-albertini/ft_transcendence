class OnlineStatusService {
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private readonly HEARTBEAT_INTERVAL = 60000; // 1 minute
  private isActive = true;

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('user-token');
    if (!token) {
      throw new Error('Token d\'authentification non trouvé');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  /**
   * Démarre le service de statut en ligne
   * Envoie un heartbeat régulier au serveur
   */
  start(): void {
    if (this.heartbeatInterval) {
      return; // Déjà démarré
    }

    // Marquer immédiatement comme en ligne
    this.sendHeartbeat();

    // Configurer le heartbeat périodique
    this.heartbeatInterval = setInterval(() => {
      if (this.isActive) {
        this.sendHeartbeat();
      }
    }, this.HEARTBEAT_INTERVAL);

    // Écouter les événements de visibilité de la page
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Écouter les événements avant fermeture
    window.addEventListener('beforeunload', this.stop.bind(this));
  }

  /**
   * Arrête le service de statut en ligne
   */
  stop(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    // Marquer comme hors ligne
    this.setOffline();

    // Nettoyer les écouteurs d'événements
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    window.removeEventListener('beforeunload', this.stop.bind(this));
  }

  /**
   * Envoie un heartbeat au serveur pour indiquer que l'utilisateur est en ligne
   */
  private async sendHeartbeat(): Promise<void> {
    try {
      await fetch('/api/profile/status/online', {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
    } catch (error) {
      console.warn('Erreur lors de l\'envoi du heartbeat:', error);
    }
  }

  /**
   * Marque l'utilisateur comme hors ligne
   */
  private async setOffline(): Promise<void> {
    try {
      await fetch('/api/profile/status/offline', {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
    } catch (error) {
      console.warn('Erreur lors de la mise hors ligne:', error);
    }
  }

  /**
   * Gère les changements de visibilité de la page
   */
  private handleVisibilityChange(): void {
    if (document.hidden) {
      this.isActive = false;
    } else {
      this.isActive = true;
      // Envoyer immédiatement un heartbeat quand la page redevient visible
      this.sendHeartbeat();
    }
  }

  /**
   * Obtient le statut en ligne d'un utilisateur
   */
  async getUserStatus(username: string): Promise<{ isOnline: boolean; lastSeen: string | null }> {
    try {
      const response = await fetch(`/api/profile/status/${username}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return {
        isOnline: data.isOnline,
        lastSeen: data.lastSeen
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du statut utilisateur:', error);
      return { isOnline: false, lastSeen: null };
    }
  }

  /**
   * Obtient le statut en ligne de plusieurs utilisateurs
   */
  async getMultipleUsersStatus(usernames: string[]): Promise<Record<string, boolean>> {
    try {
      const response = await fetch('/api/profile/status/multiple', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ usernames })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.statuses || {};
    } catch (error) {
      console.error('Erreur lors de la récupération des statuts multiples:', error);
      return {};
    }
  }

  /**
   * Rafraîchit le statut en ligne (utile après une période d'inactivité)
   */
  refresh(): void {
    this.sendHeartbeat();
  }
}

// Instance singleton
export const onlineStatusService = new OnlineStatusService();