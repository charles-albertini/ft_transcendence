export interface FriendRequest {
  friendship_id: number;
  sender: {
    username: string;
  };
  receiver: {
    username: string;
  };
  status: string;
  creation_date: string;
}

export interface Friend {
  friendship_id: number;
  friend: {
    username: string;
  };
  creation_date: string;
  status: string;
}

export interface FriendsListResponse {
  total_friends: number;
  friends: Friend[];
}

export interface PendingRequestsResponse {
  total_pending: number;
  pending_requests: FriendRequest[];
}

export interface SentRequestsResponse {
  total_sent: number;
  sent_requests: FriendRequest[];
}

class FriendsAPI {
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

  async getFriendsList(): Promise<FriendsListResponse> {
    try {
      const response = await fetch('/api/profile/friendList', {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la liste d\'amis:', error);
      throw error;
    }
  }

  async getPendingRequests(): Promise<PendingRequestsResponse> {
    try {
      const response = await fetch('/api/profile/friendRequest/pending', {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes en attente:', error);
      throw error;
    }
  }

  async getSentRequests(): Promise<SentRequestsResponse> {
    try {
      const response = await fetch('/api/profile/friendRequest/sent', {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes envoyées:', error);
      throw error;
    }
  }

  async sendFriendRequest(username: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`/api/profile/friendRequest/${username}`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande d\'ami:', error);
      throw error;
    }
  }

  async acceptFriendRequest(friendshipId: number): Promise<{ message: string }> {
    try {
      const response = await fetch('/api/profile/friendRequest/accept', {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ friendship_id: friendshipId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de la demande d\'ami:', error);
      throw error;
    }
  }

  async declineFriendRequest(friendshipId: number): Promise<{ message: string }> {
    try {
      const response = await fetch('/api/profile/friendRequest/decline', {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ friendship_id: friendshipId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors du refus de la demande d\'ami:', error);
      throw error;
    }
  }

  async deleteFriendship(friendshipId: number): Promise<{ message: string }> {
    try {
      const response = await fetch('/api/profile/friendRequest/delete', {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ friendship_id: friendshipId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'amitié:', error);
      throw error;
    }
  }

  async searchUsers(query: string): Promise<any[]> {
    try {
      const response = await fetch(`/api/profile/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.users || [];
    } catch (error) {
      console.error('Erreur lors de la recherche d\'utilisateurs:', error);
      throw error;
    }
  }

  async getUserOnlineStatus(username: string): Promise<{ isOnline: boolean }> {
    try {
      const response = await fetch(`/api/profile/status/${username}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du statut en ligne:', error);
      // Retourner un statut par défaut en cas d'erreur
      return { isOnline: false };
    }
  }

  async getMultipleUsersOnlineStatus(usernames: string[]): Promise<Record<string, boolean>> {
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
      console.error('Erreur lors de la récupération des statuts en ligne:', error);
      // Retourner un objet vide en cas d'erreur
      return {};
    }
  }
}

export const friendsApi = new FriendsAPI();