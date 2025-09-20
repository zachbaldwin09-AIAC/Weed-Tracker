import { Strain, UserStrainExperience, InsertStrain, InsertUserStrainExperience, User } from '../types';

// Configuration for API calls
// Note: For real device testing, replace with your computer's IP address (e.g., 'http://192.168.1.100:5000')
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000' // Will work in Expo web, needs IP for device/simulator
  : 'https://your-production-url.com';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Strain API methods
  async getAllStrains(): Promise<Strain[]> {
    return this.request<Strain[]>('/api/strains');
  }

  async createStrain(strain: InsertStrain): Promise<Strain> {
    return this.request<Strain>('/api/strains', {
      method: 'POST',
      body: JSON.stringify(strain),
    });
  }

  async deleteStrain(strainId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/strains/${strainId}`, {
      method: 'DELETE',
    });
  }

  // User Strain Experience API methods
  async getUserStrainExperiences(userId: string): Promise<UserStrainExperience[]> {
    return this.request<UserStrainExperience[]>(`/api/user-strain-experiences/${userId}`);
  }

  async saveUserStrainExperience(experience: InsertUserStrainExperience): Promise<UserStrainExperience> {
    return this.request<UserStrainExperience>('/api/user-strain-experiences', {
      method: 'POST',
      body: JSON.stringify(experience),
    });
  }

  async deleteUserStrainExperience(userId: string, strainId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/user-strain-experiences/${userId}/${strainId}`, {
      method: 'DELETE',
    });
  }

  // User API methods
  async getUser(userId: string): Promise<Omit<User, 'password'>> {
    return this.request<Omit<User, 'password'>>(`/api/users/${userId}`);
  }

  async updateUserProfile(userId: string, profile: { displayName?: string }): Promise<Omit<User, 'password'>> {
    return this.request<Omit<User, 'password'>>(`/api/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(profile),
    });
  }
}

export const apiService = new ApiService();
export default apiService;