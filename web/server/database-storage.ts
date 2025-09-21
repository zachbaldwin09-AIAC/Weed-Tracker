import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and } from "drizzle-orm";
import { users, strains, userStrainExperiences } from "@shared/schema";
import type { User, InsertUser, Strain, InsertStrain, UserStrainExperience, InsertUserStrainExperience } from "@shared/schema";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  private db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    const sql = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUserProfile(id: string, updates: { displayName?: string | null; homeState?: string | null }): Promise<User> {
    const result = await this.db.update(users).set(updates).where(eq(users.id, id)).returning();
    if (result.length === 0) {
      throw new Error('User not found');
    }
    return result[0];
  }

  // Strain methods
  async getStrain(id: string): Promise<Strain | undefined> {
    const result = await this.db.select().from(strains).where(eq(strains.id, id));
    return result[0];
  }

  async getStrainByName(name: string): Promise<Strain | undefined> {
    const result = await this.db.select().from(strains).where(eq(strains.name, name));
    return result[0];
  }

  async createStrain(insertStrain: InsertStrain): Promise<Strain> {
    const result = await this.db.insert(strains).values(insertStrain).returning();
    return result[0];
  }

  async getAllStrains(): Promise<Strain[]> {
    return await this.db.select().from(strains);
  }

  async deleteStrain(id: string): Promise<boolean> {
    // First delete all user experiences for this strain
    await this.deleteAllUserStrainExperiencesForStrain(id);
    
    const result = await this.db.delete(strains).where(eq(strains.id, id));
    return result.rowCount > 0;
  }

  // User strain experience methods
  async getUserStrainExperience(userId: string, strainId: string): Promise<UserStrainExperience | undefined> {
    const result = await this.db.select().from(userStrainExperiences)
      .where(and(eq(userStrainExperiences.userId, userId), eq(userStrainExperiences.strainId, strainId)));
    return result[0];
  }

  async createUserStrainExperience(experience: InsertUserStrainExperience): Promise<UserStrainExperience> {
    const result = await this.db.insert(userStrainExperiences).values(experience).returning();
    return result[0];
  }

  async updateUserStrainExperience(id: string, updates: Partial<InsertUserStrainExperience>): Promise<UserStrainExperience> {
    const result = await this.db.update(userStrainExperiences).set(updates).where(eq(userStrainExperiences.id, id)).returning();
    if (result.length === 0) {
      throw new Error('Experience not found');
    }
    return result[0];
  }

  async getUserStrainExperiences(userId: string): Promise<UserStrainExperience[]> {
    return await this.db.select().from(userStrainExperiences).where(eq(userStrainExperiences.userId, userId));
  }

  async deleteUserStrainExperience(userId: string, strainId: string): Promise<boolean> {
    const result = await this.db.delete(userStrainExperiences)
      .where(and(eq(userStrainExperiences.userId, userId), eq(userStrainExperiences.strainId, strainId)));
    return result.rowCount > 0;
  }

  async deleteAllUserStrainExperiencesForStrain(strainId: string): Promise<void> {
    await this.db.delete(userStrainExperiences).where(eq(userStrainExperiences.strainId, strainId));
  }

  // Initialize default user for MVP
  async initializeDefaultUser(): Promise<void> {
    const existingUser = await this.getUser("user-1");
    if (!existingUser) {
      // Create the default user with a fixed ID for MVP
      await this.db.insert(users).values({
        id: "user-1",
        username: "default_user",
        password: "placeholder", // Not used in MVP
        displayName: null,
        homeState: null
      });
    }
  }
}