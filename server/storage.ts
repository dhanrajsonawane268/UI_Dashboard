import {
  users,
  contacts,
  conversations,
  messages,
  templates,
  workflows,
  workflowInstances,
  notifications,
  type User,
  type InsertUser,
  type Contact,
  type InsertContact,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type Template,
  type InsertTemplate,
  type Workflow,
  type InsertWorkflow,
  type WorkflowInstance,
  type InsertWorkflowInstance,
  type Notification,
  type InsertNotification,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getContacts(): Promise<Contact[]>;
  getContact(id: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: string, contact: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: string): Promise<boolean>;
  
  getConversations(): Promise<(Conversation & { contact: Contact })[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, data: Partial<Conversation>): Promise<Conversation | undefined>;
  
  getMessages(conversationId: string): Promise<Message[]>;
  getMessage(id: string): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  getRecentMessages(limit?: number): Promise<Message[]>;
  
  getTemplates(): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: string, template: Partial<InsertTemplate>): Promise<Template | undefined>;
  deleteTemplate(id: string): Promise<boolean>;
  incrementTemplateUsage(id: string): Promise<void>;
  
  getWorkflows(): Promise<Workflow[]>;
  getWorkflow(id: string): Promise<Workflow | undefined>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: string, workflow: Partial<InsertWorkflow>): Promise<Workflow | undefined>;
  
  getWorkflowInstances(workflowId?: string): Promise<WorkflowInstance[]>;
  createWorkflowInstance(instance: InsertWorkflowInstance): Promise<WorkflowInstance>;
  updateWorkflowInstance(id: string, data: Partial<WorkflowInstance>): Promise<WorkflowInstance | undefined>;
  
  getNotifications(userId?: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: string): Promise<void>;
  
  getStats(): Promise<{
    totalMessages: number;
    totalContacts: number;
    responseRate: number;
    avgResponseTime: string;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async getContact(id: string): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact || undefined;
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db
      .insert(contacts)
      .values(contact)
      .returning();
    return newContact;
  }

  async updateContact(id: string, contact: Partial<InsertContact>): Promise<Contact | undefined> {
    const [updated] = await db
      .update(contacts)
      .set({ ...contact, updatedAt: new Date() })
      .where(eq(contacts.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteContact(id: string): Promise<boolean> {
    const result = await db.delete(contacts).where(eq(contacts.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getConversations(): Promise<(Conversation & { contact: Contact })[]> {
    const results = await db
      .select({
        conversation: conversations,
        contact: contacts,
      })
      .from(conversations)
      .leftJoin(contacts, eq(conversations.contactId, contacts.id))
      .orderBy(desc(conversations.lastMessageAt));

    return results.map((r) => ({
      ...r.conversation,
      contact: r.contact!,
    }));
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation || undefined;
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const [newConversation] = await db
      .insert(conversations)
      .values(conversation)
      .returning();
    return newConversation;
  }

  async updateConversation(id: string, data: Partial<Conversation>): Promise<Conversation | undefined> {
    const [updated] = await db
      .update(conversations)
      .set(data)
      .where(eq(conversations.id, id))
      .returning();
    return updated || undefined;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
  }

  async getMessage(id: string): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message || undefined;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    
    await db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, message.conversationId));
    
    if (message.direction === "inbound") {
      await db
        .update(conversations)
        .set({ unreadCount: sql`${conversations.unreadCount} + 1` })
        .where(eq(conversations.id, message.conversationId));
    }
    
    return newMessage;
  }

  async getRecentMessages(limit: number = 10): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .orderBy(desc(messages.createdAt))
      .limit(limit);
  }

  async getTemplates(): Promise<Template[]> {
    return await db
      .select()
      .from(templates)
      .where(eq(templates.isActive, true))
      .orderBy(desc(templates.createdAt));
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template || undefined;
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const [newTemplate] = await db
      .insert(templates)
      .values(template)
      .returning();
    return newTemplate;
  }

  async updateTemplate(id: string, template: Partial<InsertTemplate>): Promise<Template | undefined> {
    const [updated] = await db
      .update(templates)
      .set({ ...template, updatedAt: new Date() })
      .where(eq(templates.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const [updated] = await db
      .update(templates)
      .set({ isActive: false })
      .where(eq(templates.id, id))
      .returning();
    return !!updated;
  }

  async incrementTemplateUsage(id: string): Promise<void> {
    await db
      .update(templates)
      .set({ usageCount: sql`${templates.usageCount} + 1` })
      .where(eq(templates.id, id));
  }

  async getWorkflows(): Promise<Workflow[]> {
    return await db
      .select()
      .from(workflows)
      .where(eq(workflows.isActive, true))
      .orderBy(desc(workflows.createdAt));
  }

  async getWorkflow(id: string): Promise<Workflow | undefined> {
    const [workflow] = await db.select().from(workflows).where(eq(workflows.id, id));
    return workflow || undefined;
  }

  async createWorkflow(workflow: InsertWorkflow): Promise<Workflow> {
    const [newWorkflow] = await db
      .insert(workflows)
      .values(workflow)
      .returning();
    return newWorkflow;
  }

  async updateWorkflow(id: string, workflow: Partial<InsertWorkflow>): Promise<Workflow | undefined> {
    const [updated] = await db
      .update(workflows)
      .set({ ...workflow, updatedAt: new Date() })
      .where(eq(workflows.id, id))
      .returning();
    return updated || undefined;
  }

  async getWorkflowInstances(workflowId?: string): Promise<WorkflowInstance[]> {
    if (workflowId) {
      return await db
        .select()
        .from(workflowInstances)
        .where(eq(workflowInstances.workflowId, workflowId))
        .orderBy(desc(workflowInstances.startedAt));
    }
    return await db
      .select()
      .from(workflowInstances)
      .orderBy(desc(workflowInstances.startedAt));
  }

  async createWorkflowInstance(instance: InsertWorkflowInstance): Promise<WorkflowInstance> {
    const [newInstance] = await db
      .insert(workflowInstances)
      .values(instance)
      .returning();
    return newInstance;
  }

  async updateWorkflowInstance(id: string, data: Partial<WorkflowInstance>): Promise<WorkflowInstance | undefined> {
    const [updated] = await db
      .update(workflowInstances)
      .set(data)
      .where(eq(workflowInstances.id, id))
      .returning();
    return updated || undefined;
  }

  async getNotifications(userId?: string): Promise<Notification[]> {
    if (userId) {
      return await db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt));
    }
    return await db
      .select()
      .from(notifications)
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async markNotificationRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  async getStats(): Promise<{
    totalMessages: number;
    totalContacts: number;
    responseRate: number;
    avgResponseTime: string;
  }> {
    const [messageCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(messages);
    
    const [contactCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(contacts);
    
    const [outboundCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(messages)
      .where(eq(messages.direction, "outbound"));
    
    const totalMessages = messageCount?.count || 0;
    const totalContacts = contactCount?.count || 0;
    const outbound = outboundCount?.count || 0;
    const responseRate = totalMessages > 0 ? Math.round((outbound / totalMessages) * 100) : 0;
    
    return {
      totalMessages,
      totalContacts,
      responseRate,
      avgResponseTime: "2.5h",
    };
  }
}

export const storage = new DatabaseStorage();
