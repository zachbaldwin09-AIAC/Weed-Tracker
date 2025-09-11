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

  app.delete("/api/strains/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Prevent deletion of sample strains (IDs 1-6 are sample strains)
      if (['1', '2', '3', '4', '5', '6'].includes(id)) {
        return res.status(403).json({ error: 'Cannot delete sample strains' });
      }
      
      const deleted = await storage.deleteStrain(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Strain not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting strain:', error);
      res.status(500).json({ error: 'Failed to delete strain' });
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

  app.delete("/api/user-strain-experiences/:userId/:strainId", async (req, res) => {
    try {
      const { userId, strainId } = req.params;
      
      const deleted = await storage.deleteUserStrainExperience(userId, strainId);
      if (!deleted) {
        return res.status(404).json({ error: 'Experience not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting user experience:', error);
      res.status(500).json({ error: 'Failed to delete experience' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
