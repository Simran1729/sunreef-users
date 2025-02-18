import { pgTable, text, serial, integer, boolean} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  projectName: text("project_name").notNull(),
  projectCode: text("project_code").notNull(),
  departmentName: text("department_name").notNull(),
  teamName: text("team_name").notNull(),
  severity: text("severity").notNull(),
  description: text("description").notNull(),
  subject: text("subject").notNull(),
});

// Attachment schema for file uploads
export interface Attachment {
  filename: string;
  mimetype: string;
  data: Buffer;
}

export const insertUserSchema = createInsertSchema(users);
export const insertTicketSchema = createInsertSchema(tickets);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type User = typeof users.$inferSelect;
export type Ticket = typeof tickets.$inferSelect;

export const ticketFormSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  projectCode: z.string().min(1, "Project code is required"),
  departmentName: z.string().min(1, "Department name is required"),
  teamName: z.string().min(1, "Team name is required"),
  severity: z.string().min(1, "Severity is required"),
  description: z.string().min(1, "Description is required"),
  subject: z.string().min(1, "Subject is required"),
});

export type TicketFormData = z.infer<typeof ticketFormSchema>;