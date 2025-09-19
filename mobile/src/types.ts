// Types matching the shared schema from the web app
export interface User {
  id: string;
  username: string;
  displayName?: string;
}

export interface Strain {
  id: string;
  name: string;
  type: 'Indica' | 'Sativa' | 'Hybrid';
  thcContent?: number;
  description?: string;
}

export interface UserStrainExperience {
  id: string;
  userId: string;
  strainId: string;
  liked?: boolean;
  saved?: boolean;
  notes?: string;
  createdAt?: string;
}

export interface InsertStrain {
  name: string;
  type: string;
  thcContent?: number;
  description?: string;
}

export interface InsertUserStrainExperience {
  userId: string;
  strainId: string;
  liked?: boolean;
  saved?: boolean;
  notes?: string;
}