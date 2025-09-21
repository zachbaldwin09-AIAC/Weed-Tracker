import { type User, type InsertUser, type Strain, type InsertStrain, type UserStrainExperience, type InsertUserStrainExperience } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProfile(id: string, updates: { displayName?: string | null; homeState?: string | null }): Promise<User>;
  
  // Strain methods
  getStrain(id: string): Promise<Strain | undefined>;
  getStrainByName(name: string): Promise<Strain | undefined>;
  createStrain(strain: InsertStrain): Promise<Strain>;
  getAllStrains(): Promise<Strain[]>;
  deleteStrain(id: string): Promise<boolean>;
  
  // User strain experience methods
  getUserStrainExperience(userId: string, strainId: string): Promise<UserStrainExperience | undefined>;
  createUserStrainExperience(experience: InsertUserStrainExperience): Promise<UserStrainExperience>;
  updateUserStrainExperience(id: string, updates: Partial<InsertUserStrainExperience>): Promise<UserStrainExperience>;
  getUserStrainExperiences(userId: string): Promise<UserStrainExperience[]>;
  deleteUserStrainExperience(userId: string, strainId: string): Promise<boolean>;
  deleteAllUserStrainExperiencesForStrain(strainId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private strains: Map<string, Strain>;
  private userStrainExperiences: Map<string, UserStrainExperience>;

  constructor() {
    this.users = new Map();
    this.strains = new Map();
    this.userStrainExperiences = new Map();
    
    // Initialize default user for MVP (using hardcoded user-1 ID)
    this.initializeDefaultUser();
  }
  
  private initializeDefaultUser() {
    const defaultUser: User = {
      id: "user-1",
      username: "default_user",
      password: "placeholder", // Not used in MVP
      displayName: null,
      homeState: null
    };
    this.users.set("user-1", defaultUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      displayName: insertUser.displayName ?? null,
      homeState: insertUser.homeState ?? null
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserProfile(id: string, updates: { displayName?: string | null; homeState?: string | null }): Promise<User> {
    const existing = this.users.get(id);
    if (!existing) {
      throw new Error('User not found');
    }
    
    const updated = { 
      ...existing, 
      displayName: updates.displayName !== undefined ? updates.displayName : existing.displayName,
      homeState: updates.homeState !== undefined ? updates.homeState : existing.homeState
    };
    this.users.set(id, updated);
    return updated;
  }
  
  // Strain methods
  async getStrain(id: string): Promise<Strain | undefined> {
    return this.strains.get(id);
  }
  
  async getStrainByName(name: string): Promise<Strain | undefined> {
    return Array.from(this.strains.values()).find(
      (strain) => strain.name.toLowerCase() === name.toLowerCase(),
    );
  }
  
  async createStrain(insertStrain: InsertStrain): Promise<Strain> {
    const id = randomUUID();
    const strain: Strain = { 
      ...insertStrain, 
      id,
      thcContent: insertStrain.thcContent ?? null,
      description: insertStrain.description ?? null
    };
    this.strains.set(id, strain);
    return strain;
  }
  
  async getAllStrains(): Promise<Strain[]> {
    return Array.from(this.strains.values());
  }
  
  // User strain experience methods
  async getUserStrainExperience(userId: string, strainId: string): Promise<UserStrainExperience | undefined> {
    return Array.from(this.userStrainExperiences.values()).find(
      (experience) => experience.userId === userId && experience.strainId === strainId,
    );
  }
  
  async createUserStrainExperience(insertExperience: InsertUserStrainExperience): Promise<UserStrainExperience> {
    const id = randomUUID();
    const experience: UserStrainExperience = { 
      ...insertExperience,
      id,
      liked: insertExperience.liked ?? null,
      saved: insertExperience.saved ?? false,
      notes: insertExperience.notes ?? null,
      createdAt: new Date() 
    };
    this.userStrainExperiences.set(id, experience);
    return experience;
  }
  
  async updateUserStrainExperience(id: string, updates: Partial<InsertUserStrainExperience>): Promise<UserStrainExperience> {
    const existing = this.userStrainExperiences.get(id);
    if (!existing) {
      throw new Error('Experience not found');
    }
    
    // Create sanitized update object with proper types
    const sanitized: Partial<InsertUserStrainExperience> = {};
    
    if (updates.liked !== undefined) {
      sanitized.liked = updates.liked ?? null;
    }
    if (updates.saved !== undefined) {
      sanitized.saved = updates.saved;
    }
    if (updates.notes !== undefined) {
      sanitized.notes = updates.notes;
    }
    if (updates.userId !== undefined) {
      sanitized.userId = updates.userId;
    }
    if (updates.strainId !== undefined) {
      sanitized.strainId = updates.strainId;
    }
    
    const updated = { 
      ...existing, 
      ...sanitized
    };
    this.userStrainExperiences.set(id, updated);
    return updated;
  }
  
  async getUserStrainExperiences(userId: string): Promise<UserStrainExperience[]> {
    return Array.from(this.userStrainExperiences.values()).filter(
      (experience) => experience.userId === userId,
    );
  }
  
  // Delete methods
  async deleteStrain(id: string): Promise<boolean> {
    const hasStrain = this.strains.has(id);
    if (hasStrain) {
      this.strains.delete(id);
      // Also delete all user experiences for this strain
      await this.deleteAllUserStrainExperiencesForStrain(id);
    }
    return hasStrain;
  }
  
  async deleteUserStrainExperience(userId: string, strainId: string): Promise<boolean> {
    const experience = await this.getUserStrainExperience(userId, strainId);
    if (experience) {
      this.userStrainExperiences.delete(experience.id);
      return true;
    }
    return false;
  }
  
  async deleteAllUserStrainExperiencesForStrain(strainId: string): Promise<void> {
    const experiencesToDelete = Array.from(this.userStrainExperiences.values()).filter(
      (experience) => experience.strainId === strainId,
    );
    
    experiencesToDelete.forEach(experience => {
      this.userStrainExperiences.delete(experience.id);
    });
  }
}

import { DatabaseStorage } from "./database-storage";

// Use DatabaseStorage if DATABASE_URL is available, otherwise fallback to MemStorage
let storage;
if (process.env.DATABASE_URL) {
  try {
    storage = new DatabaseStorage();
    // Initialize default user for database
    storage.initializeDefaultUser().catch(console.error);
  } catch (error) {
    console.warn('Failed to connect to database, falling back to MemStorage:', error);
    storage = new MemStorage();
  }
} else {
  console.log('No DATABASE_URL found, using MemStorage for development');
  storage = new MemStorage();
}

export { storage };
