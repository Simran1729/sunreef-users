import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTicketSchema, type Attachment } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";
import multer from "multer";
import path from "path";

// Configure multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Accept images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/users", async (_req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch users",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.post("/api/tickets", upload.array('attachments', 5), async (req, res) => {
    try {
      // Parse the ticket data from the form
      const ticketData = JSON.parse(req.body.data);
      const data = insertTicketSchema.parse(ticketData);

      const user = await storage.getUserByUsername(ticketData.username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get uploaded files
      const files = req.files as Express.Multer.File[] | undefined;
      const attachments: Attachment[] = (files || []).map(file => ({
        filename: file.originalname,
        mimetype: file.mimetype,
        data: file.buffer,
      }));

      const ticket = await storage.createTicket({
        ...data,
        userId: user.id,
        attachments,
      });

      res.json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid ticket data",
          error: fromZodError(error).message
        });
      }

      if (error instanceof multer.MulterError) {
        return res.status(400).json({
          message: "File upload error",
          error: error.message
        });
      }

      res.status(500).json({ 
        message: "Failed to create ticket",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}