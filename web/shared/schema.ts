import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  homeState: text("home_state"), // Optional home state field
});

export const strains = pgTable("strains", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'Indica', 'Sativa', 'Hybrid'
  thcContent: integer("thc_content"), // THC percentage
  description: text("description"),
});

export const userStrainExperiences = pgTable("user_strain_experiences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  strainId: varchar("strain_id").notNull(),
  liked: boolean("liked"), // true for like, false for dislike, null for no rating
  saved: boolean("saved").default(false), // true if user saved/bookmarked this strain
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users, {
  username: z.string().min(1),
  password: z.string().min(1),
  displayName: z.string().optional(),
  homeState: z.string().optional(),
}).pick({
  username: true,
  password: true,
  displayName: true,
  homeState: true,
});

export const updateUserProfileSchema = createInsertSchema(users, {
  displayName: z.string().optional(),
  homeState: z.string().optional(),
}).pick({
  displayName: true,
  homeState: true,
});

export const insertStrainSchema = createInsertSchema(strains, {
  name: z.string().min(1),
  type: z.string().min(1),
  thcContent: z.number().optional(),
  description: z.string().optional(),
}).pick({
  name: true,
  type: true,
  thcContent: true,
  description: true,
});

export const insertUserStrainExperienceSchema = createInsertSchema(userStrainExperiences, {
  userId: z.string().min(1),
  strainId: z.string().min(1),
  liked: z.boolean().optional(),
  saved: z.boolean().optional(),
  notes: z.string().optional(),
}).pick({
  userId: true,
  strainId: true,
  liked: true,
  saved: true,
  notes: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertStrain = z.infer<typeof insertStrainSchema>;
export type Strain = typeof strains.$inferSelect;
export type InsertUserStrainExperience = z.infer<typeof insertUserStrainExperienceSchema>;
export type UserStrainExperience = typeof userStrainExperiences.$inferSelect;
