import { Strain, UserStrainExperience, InsertStrain, InsertUserStrainExperience, User } from '../types';
import { mockStrains, mockUserExperiences, mockUser } from './mockData';

// Configuration for API calls
// Using Replit's public domain for both dev and production since mobile needs a reachable URL
const API_BASE_URL = 'https://e11f9830-1cb8-433c-9ce8-fdd0ab8d65cd-00-148f6itm8ejpe.riker.replit.dev';

// Mock data flag - set to true to use mock data instead of real API
// Disabled to provide fresh user experience
const USE_MOCK_DATA = false;

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
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockStrains;
    }
    return this.request<Strain[]>('/api/strains');
  }

  async createStrain(strain: InsertStrain): Promise<Strain> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newStrain: Strain = {
        id: Date.now().toString(),
        name: strain.name,
        type: strain.type as 'Indica' | 'Sativa' | 'Hybrid',
        thcContent: strain.thcContent,
        description: strain.description
      };
      mockStrains.push(newStrain);
      return newStrain;
    }
    return this.request<Strain>('/api/strains', {
      method: 'POST',
      body: JSON.stringify(strain),
    });
  }

  async deleteStrain(strainId: string): Promise<{ success: boolean }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = mockStrains.findIndex(strain => strain.id === strainId);
      if (index > -1) {
        mockStrains.splice(index, 1);
      }
      return { success: true };
    }
    return this.request<{ success: boolean }>(`/api/strains/${strainId}`, {
      method: 'DELETE',
    });
  }

  // User Strain Experience API methods
  async getUserStrainExperiences(userId: string): Promise<UserStrainExperience[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockUserExperiences.filter(exp => exp.userId === userId);
    }
    return this.request<UserStrainExperience[]>(`/api/user-strain-experiences/${userId}`);
  }

  async saveUserStrainExperience(experience: InsertUserStrainExperience): Promise<UserStrainExperience> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const newExperience: UserStrainExperience = {
        id: Date.now().toString(),
        userId: experience.userId,
        strainId: experience.strainId,
        liked: experience.liked,
        saved: experience.saved,
        notes: experience.notes,
        createdAt: new Date().toISOString()
      };
      mockUserExperiences.push(newExperience);
      return newExperience;
    }
    return this.request<UserStrainExperience>('/api/user-strain-experiences', {
      method: 'POST',
      body: JSON.stringify(experience),
    });
  }

  async deleteUserStrainExperience(userId: string, strainId: string): Promise<{ success: boolean }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = mockUserExperiences.findIndex(exp => exp.userId === userId && exp.strainId === strainId);
      if (index > -1) {
        mockUserExperiences.splice(index, 1);
      }
      return { success: true };
    }
    return this.request<{ success: boolean }>(`/api/user-strain-experiences/${userId}/${strainId}`, {
      method: 'DELETE',
    });
  }

  // User API methods
  async getUser(userId: string): Promise<Omit<User, 'password'>> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockUser;
    }
    return this.request<Omit<User, 'password'>>(`/api/users/${userId}`);
  }

  async updateUserProfile(userId: string, profile: { displayName?: string }): Promise<Omit<User, 'password'>> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      if (profile.displayName) {
        mockUser.displayName = profile.displayName;
      }
      return mockUser;
    }
    return this.request<Omit<User, 'password'>>(`/api/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(profile),
    });
  }
}

export const apiService = new ApiService();
export default apiService;