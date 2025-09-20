// Mock data for offline/demo functionality
import { Strain, UserStrainExperience, User } from '../types';

export const mockStrains: Strain[] = [
  {
    id: '1',
    name: 'Blue Dream',
    type: 'Hybrid',
    thcContent: 18,
    description: 'A balanced hybrid that provides gentle cerebral invigoration and full-body relaxation.'
  },
  {
    id: '2', 
    name: 'OG Kush',
    type: 'Indica',
    thcContent: 24,
    description: 'A classic indica strain known for its heavy euphoria and stress-relieving properties.'
  },
  {
    id: '3',
    name: 'Green Crack',
    type: 'Sativa',
    thcContent: 22,
    description: 'An energizing sativa that provides mental buzz and focus for daytime activities.'
  },
  {
    id: '4',
    name: 'Girl Scout Cookies',
    type: 'Hybrid',
    thcContent: 20,
    description: 'A sweet hybrid offering euphoria and relaxation with dessert-like flavors.'
  },
  {
    id: '5',
    name: 'Northern Lights',
    type: 'Indica',
    thcContent: 16,
    description: 'A pure indica strain famous for its resinous buds and relaxing effects.'
  }
];

export const mockUserExperiences: UserStrainExperience[] = [
  {
    id: '1',
    userId: 'user-1',
    strainId: '1',
    liked: true,
    saved: true,
    notes: 'Great for evening relaxation. Helped with sleep.',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: 'user-1', 
    strainId: '3',
    liked: true,
    saved: false,
    notes: 'Perfect morning strain. Increased focus and energy.',
    createdAt: new Date().toISOString()
  }
];

export const mockUser: User = {
  id: 'user-1',
  username: 'demo_user',
  displayName: 'Demo User'
};