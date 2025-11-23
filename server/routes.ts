import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { processMessage, generateResponse, translateMessage } from "./ai";
import { insertContactSchema, insertMessageSchema, insertTemplateSchema, insertConversationSchema } from "@shared/schema";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(express.json());

  app.get("/api/contacts", async (_req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      console.error("Error creating contact:", error);
      res.status(400).json({ error: "Invalid contact data" });
    }
  });

  app.get("/api/contacts/:id", async (req, res) => {
    try {
      const contact = await storage.getContact(req.params.id);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      console.error("Error fetching contact:", error);
      res.status(500).json({ error: "Failed to fetch contact" });
    }
  });

  app.put("/api/contacts/:id", async (req, res) => {
    try {
      const contact = await storage.updateContact(req.params.id, req.body);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      console.error("Error updating contact:", error);
      res.status(500).json({ error: "Failed to update contact" });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const success = await storage.deleteContact(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });

  app.get("/api/conversations", async (_req, res) => {
    try {
      const conversations = await storage.getConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.post("/api/conversations", async (req, res) => {
    try {
      const validatedData = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(validatedData);
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(400).json({ error: "Invalid conversation data" });
    }
  });

  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const messages = await storage.getMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      
      let aiResult;
      if (validatedData.direction === "inbound") {
        aiResult = await processMessage(validatedData.content);
        validatedData.language = aiResult.language as any;
        validatedData.sentiment = aiResult.sentiment as any;
        validatedData.intent = aiResult.intent;
        if (aiResult.translatedContent) {
          validatedData.translatedContent = aiResult.translatedContent;
        }
      }
      
      const message = await storage.createMessage(validatedData);
      
      res.status(201).json({
        message,
        aiSuggestion: aiResult?.suggestedResponse,
      });
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  app.get("/api/messages/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const messages = await storage.getRecentMessages(limit);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching recent messages:", error);
      res.status(500).json({ error: "Failed to fetch recent messages" });
    }
  });

  app.post("/api/ai/generate-response", async (req, res) => {
    try {
      const { messageHistory, language } = req.body;
      
      if (!messageHistory || !Array.isArray(messageHistory)) {
        return res.status(400).json({ error: "Invalid message history" });
      }
      
      const response = await generateResponse(messageHistory, language || "en");
      res.json({ response });
    } catch (error) {
      console.error("Error generating response:", error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  app.post("/api/ai/translate", async (req, res) => {
    try {
      const { content, targetLanguage } = req.body;
      
      if (!content || !targetLanguage) {
        return res.status(400).json({ error: "Missing content or target language" });
      }
      
      const translated = await translateMessage(content, targetLanguage);
      res.json({ translatedContent: translated });
    } catch (error) {
      console.error("Error translating:", error);
      res.status(500).json({ error: "Failed to translate message" });
    }
  });

  app.post("/api/ai/process", async (req, res) => {
    try {
      const { content, targetLanguage } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: "Missing content" });
      }
      
      const result = await processMessage(content, targetLanguage);
      res.json(result);
    } catch (error) {
      console.error("Error processing message:", error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });

  app.get("/api/templates", async (_req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const validatedData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(400).json({ error: "Invalid template data" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  app.put("/api/templates/:id", async (req, res) => {
    try {
      const template = await storage.updateTemplate(req.params.id, req.body);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error updating template:", error);
      res.status(500).json({ error: "Failed to update template" });
    }
  });

  app.delete("/api/templates/:id", async (req, res) => {
    try {
      const success = await storage.deleteTemplate(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ error: "Failed to delete template" });
    }
  });

  app.post("/api/templates/:id/use", async (req, res) => {
    try {
      await storage.incrementTemplateUsage(req.params.id);
      const template = await storage.getTemplate(req.params.id);
      res.json(template);
    } catch (error) {
      console.error("Error using template:", error);
      res.status(500).json({ error: "Failed to use template" });
    }
  });

  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/analytics", async (_req, res) => {
    try {
      const stats = await storage.getStats();
      
      res.json({
        messageVolume: [
          { date: "Mon", count: 45 },
          { date: "Tue", count: 62 },
          { date: "Wed", count: 58 },
          { date: "Thu", count: 73 },
          { date: "Fri", count: 81 },
          { date: "Sat", count: 69 },
          { date: "Sun", count: 87 },
        ],
        channelDistribution: [
          { channel: "whatsapp", count: 842, percentage: 68 },
          { channel: "email", count: 392, percentage: 32 },
        ],
        languageDistribution: [
          { language: "en", count: 542, percentage: 44 },
          { language: "kn", count: 321, percentage: 26 },
          { language: "hi", count: 234, percentage: 19 },
          { language: "ne", count: 137, percentage: 11 },
        ],
        responseMetrics: {
          avgResponseTime: stats.avgResponseTime,
          responseRate: stats.responseRate,
        },
        topContacts: [
          { name: "Priya Sharma", messageCount: 45, type: "employer" },
          { name: "Lakshmi Devi", messageCount: 38, type: "maid" },
          { name: "Rajesh Kumar", messageCount: 32, type: "employer" },
          { name: "Anita Rao", messageCount: 28, type: "maid" },
          { name: "Suresh Patel", messageCount: 24, type: "employer" },
        ],
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.post("/api/webhooks/whatsapp", async (req, res) => {
    try {
      const { from, body, messageId } = req.body;
      
      console.log("WhatsApp webhook received:", { from, body, messageId });
      
      let contact = (await storage.getContacts()).find(c => c.phone === from);
      if (!contact) {
        contact = await storage.createContact({
          name: `WhatsApp ${from}`,
          phone: from,
          type: "employer",
          language: "en",
        });
      }
      
      let conversation = (await storage.getConversations()).find(
        c => c.contactId === contact!.id && c.channel === "whatsapp"
      );
      
      if (!conversation) {
        conversation = await storage.createConversation({
          contactId: contact.id,
          channel: "whatsapp",
          subject: "WhatsApp Conversation",
        });
      }
      
      const aiResult = await processMessage(body);
      
      await storage.createMessage({
        conversationId: conversation.id,
        contactId: contact.id,
        direction: "inbound",
        channel: "whatsapp",
        content: body,
        language: aiResult.language as any,
        sentiment: aiResult.sentiment as any,
        intent: aiResult.intent,
        translatedContent: aiResult.translatedContent,
        status: "delivered",
      });
      
      res.status(200).json({ success: true, suggestion: aiResult.suggestedResponse });
    } catch (error) {
      console.error("WhatsApp webhook error:", error);
      res.status(500).json({ error: "Failed to process webhook" });
    }
  });

  app.post("/api/webhooks/email", async (req, res) => {
    try {
      const { from, subject, body, messageId } = req.body;
      
      console.log("Email webhook received:", { from, subject, messageId });
      
      let contact = (await storage.getContacts()).find(c => c.email === from);
      if (!contact) {
        contact = await storage.createContact({
          name: `Email ${from}`,
          email: from,
          type: "employer",
          language: "en",
        });
      }
      
      let conversation = (await storage.getConversations()).find(
        c => c.contactId === contact!.id && c.channel === "email"
      );
      
      if (!conversation) {
        conversation = await storage.createConversation({
          contactId: contact.id,
          channel: "email",
          subject: subject || "Email Conversation",
        });
      }
      
      const aiResult = await processMessage(body);
      
      await storage.createMessage({
        conversationId: conversation.id,
        contactId: contact.id,
        direction: "inbound",
        channel: "email",
        content: body,
        language: aiResult.language as any,
        sentiment: aiResult.sentiment as any,
        intent: aiResult.intent,
        translatedContent: aiResult.translatedContent,
        status: "delivered",
      });
      
      res.status(200).json({ success: true, suggestion: aiResult.suggestedResponse });
    } catch (error) {
      console.error("Email webhook error:", error);
      res.status(500).json({ error: "Failed to process webhook" });
    }
  });

  app.get("/api/workflows", async (_req, res) => {
    try {
      const workflows = await storage.getWorkflows();
      res.json(workflows);
    } catch (error) {
      console.error("Error fetching workflows:", error);
      res.status(500).json({ error: "Failed to fetch workflows" });
    }
  });

  app.get("/api/notifications", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications/:id/read", async (req, res) => {
    try {
      await storage.markNotificationRead(req.params.id);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
