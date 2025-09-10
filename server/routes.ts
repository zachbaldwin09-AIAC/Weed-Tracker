import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer, { type FileFilterCallback } from "multer";
import { storage } from "./storage";
import { analyzeStrainPackaging, convertFileToBase64 } from "./openai";
import { insertStrainSchema, insertUserStrainExperienceSchema } from "@shared/schema";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

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

  // Photo analysis route
  app.post("/api/strains/analyze-photo", upload.single('photo'), async (req: Request & { file?: Express.Multer.File }, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No photo provided' });
      }

      const base64Image = convertFileToBase64(req.file.buffer);
      const extractedData = await analyzeStrainPackaging(base64Image);
      
      res.json(extractedData);
    } catch (error: any) {
      console.error('Error analyzing photo:', error);
      
      // Pass through more specific error messages
      const errorMessage = error.message || 'Failed to analyze photo';
      res.status(500).json({ error: errorMessage });
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
