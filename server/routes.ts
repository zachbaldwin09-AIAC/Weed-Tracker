import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStrainSchema, insertUserStrainExperienceSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Strain routes
  app.get("/api/strains", async (req, res) => {
    try {
      const strains = await storage.getAllStrains();
      res.json(strains);
    } catch (error) {
      console.error('Error fetching strains:', error);
      res.status(500).json({ error: 'Failed to fetch strains' });
    }
  });

  app.post("/api/strains", async (req, res) => {
    try {
      const validatedData = insertStrainSchema.parse(req.body);
      
      // Check if strain already exists
      const existingStrain = await storage.getStrainByName(validatedData.name);
      if (existingStrain) {
        return res.status(409).json({ error: 'Strain already exists' });
      }
      
      const strain = await storage.createStrain(validatedData);
      res.status(201).json(strain);
    } catch (error) {
      console.error('Error creating strain:', error);
      res.status(400).json({ error: 'Invalid strain data' });
    }
  });


  // User strain experience routes
  app.post("/api/user-strain-experiences", async (req, res) => {
    try {
      const validatedData = insertUserStrainExperienceSchema.parse(req.body);
      
      // Check if experience already exists
      const existing = await storage.getUserStrainExperience(validatedData.userId, validatedData.strainId);
      if (existing) {
        // Update existing experience
        const updated = await storage.updateUserStrainExperience(existing.id, validatedData);
        return res.json(updated);
      }
      
      const experience = await storage.createUserStrainExperience(validatedData);
      res.status(201).json(experience);
    } catch (error) {
      console.error('Error saving user strain experience:', error);
      res.status(400).json({ error: 'Invalid experience data' });
    }
  });

  app.get("/api/user-strain-experiences/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const experiences = await storage.getUserStrainExperiences(userId);
      res.json(experiences);
    } catch (error) {
      console.error('Error fetching user experiences:', error);
      res.status(500).json({ error: 'Failed to fetch experiences' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
