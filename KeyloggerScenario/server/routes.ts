import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSurveyResponseSchema } from "@shared/schema";
import { z } from "zod";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Servir le script d'installation
  app.get("/install.sh", (req, res) => {
    try {
      // Obtenir le répertoire actuel (compatible ES modules)
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      
      // Chemin vers install.sh (même dossier que routes.ts)
      const installScriptPath = join(__dirname, "install.sh");
      const installScript = readFileSync(installScriptPath, "utf-8");
      
      // Le script contient déjà les valeurs fixes, pas besoin de remplacement
      res.setHeader("Content-Type", "text/x-sh");
      res.setHeader("Content-Disposition", "attachment; filename=install.sh");
      res.send(installScript);
    } catch (error) {
      console.error("Erreur lors de la lecture du script:", error);
      res.status(500).send(`Erreur: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
  
  app.post("/api/survey", async (req, res) => {
    try {
      const { acceptTerms, ...surveyData } = req.body;
      
      const validatedData = insertSurveyResponseSchema.parse(surveyData);
      
      const response = await storage.createSurveyResponse(validatedData);
      
      res.status(201).json({ 
        success: true, 
        message: "Reponse enregistree avec succes",
        id: response.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Donnees invalides", 
          errors: error.errors 
        });
      } else {
        console.error("Erreur lors de l'enregistrement:", error);
        res.status(500).json({ 
          success: false, 
          message: "Erreur interne du serveur" 
        });
      }
    }
  });

  app.get("/api/survey/responses", async (req, res) => {
    try {
      const responses = await storage.getAllSurveyResponses();
      res.json({ success: true, data: responses });
    } catch (error) {
      console.error("Erreur lors de la recuperation:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erreur interne du serveur" 
      });
    }
  });

  return httpServer;
}
