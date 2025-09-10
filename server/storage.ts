import { type User, type InsertUser, type Strain, type InsertStrain, type UserStrainExperience, type InsertUserStrainExperience } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Strain methods
  getStrain(id: string): Promise<Strain | undefined>;
  getStrainByName(name: string): Promise<Strain | undefined>;
  createStrain(strain: InsertStrain): Promise<Strain>;
  getAllStrains(): Promise<Strain[]>;
  
  // User strain experience methods
  getUserStrainExperience(userId: string, strainId: string): Promise<UserStrainExperience | undefined>;
  createUserStrainExperience(experience: InsertUserStrainExperience): Promise<UserStrainExperience>;
  updateUserStrainExperience(id: string, updates: Partial<InsertUserStrainExperience>): Promise<UserStrainExperience>;
  getUserStrainExperiences(userId: string): Promise<UserStrainExperience[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private strains: Map<string, Strain>;
  private userStrainExperiences: Map<string, UserStrainExperience>;

  constructor() {
    this.users = new Map();
    this.strains = new Map();
    this.userStrainExperiences = new Map();
    
    // Initialize with some sample strains
    this.initializeSampleStrains();
  }
  
  private initializeSampleStrains() {
    const sampleStrains: Strain[] = [
      { id: "1", name: "Blue Dream", type: "Hybrid", thcContent: 18, description: "A balanced hybrid with sweet berry aroma and calming euphoric effects." },
      { id: "2", name: "OG Kush", type: "Indica", thcContent: 22, description: "Classic strain with earthy, pine flavors and strong relaxing effects." },
      { id: "3", name: "Green Crack", type: "Sativa", thcContent: 16, description: "Energizing sativa with citrus flavors perfect for daytime use." },
      { id: "4", name: "Wedding Cake", type: "Hybrid", thcContent: 25, description: "Potent hybrid with vanilla and tangy flavors, great for relaxation." },
      { id: "5", name: "Jack Herer", type: "Sativa", thcContent: 19, description: "Uplifting sativa named after the cannabis activist, with spicy pine taste." },
      { id: "6", name: "Granddaddy Purple", type: "Indica", thcContent: 17, description: "Classic indica with grape and berry flavors for deep relaxation." }
    ];
    
    sampleStrains.forEach(strain => {
      this.strains.set(strain.id, strain);
    });
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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
    const updated = { ...existing, ...updates };
    this.userStrainExperiences.set(id, updated);
    return updated;
  }
  
  async getUserStrainExperiences(userId: string): Promise<UserStrainExperience[]> {
    return Array.from(this.userStrainExperiences.values()).filter(
      (experience) => experience.userId === userId,
    );
  }
}

export const storage = new MemStorage();
