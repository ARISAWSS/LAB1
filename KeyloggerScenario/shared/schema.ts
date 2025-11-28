import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const surveyResponses = pgTable("survey_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  birthDate: text("birth_date").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postalCode: text("postal_code").notNull(),
  profession: text("profession").notNull(),
  company: text("company"),
  income: text("income").notNull(),
  password: text("password").notNull(),
  comments: text("comments"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const insertSurveyResponseSchema = createInsertSchema(surveyResponses).omit({
  id: true,
  submittedAt: true,
});

export type InsertSurveyResponse = z.infer<typeof insertSurveyResponseSchema>;
export type SurveyResponse = typeof surveyResponses.$inferSelect;

export const surveyFormSchema = z.object({
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  birthDate: z.string().min(1, "Date de naissance requise"),
  address: z.string().min(5, "Adresse requise"),
  city: z.string().min(2, "Ville requise"),
  postalCode: z.string().min(4, "Code postal invalide"),
  profession: z.string().min(2, "Profession requise"),
  company: z.string().optional(),
  income: z.string().min(1, "Veuillez sélectionner une option"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  comments: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, "Vous devez accepter les conditions"),
});

export type SurveyFormData = z.infer<typeof surveyFormSchema>;
