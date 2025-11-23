import { queryClient, apiRequest } from "@/lib/queryClient";
import type { InsertContact, InsertMessage, InsertTemplate, Contact, Message, Template } from "@shared/schema";

export async function createContact(data: InsertContact): Promise<Contact> {
  return apiRequest("POST", "/api/contacts", data);
}

export async function updateContact(id: string, data: Partial<InsertContact>): Promise<Contact> {
  return apiRequest("PUT", `/api/contacts/${id}`, data);
}

export async function deleteContact(id: string): Promise<void> {
  return apiRequest("DELETE", `/api/contacts/${id}`, {});
}

export async function sendMessage(data: InsertMessage): Promise<{ message: Message; aiSuggestion?: string }> {
  return apiRequest("POST", "/api/messages", data);
}

export async function createTemplate(data: InsertTemplate): Promise<Template> {
  return apiRequest("POST", "/api/templates", data);
}

export async function updateTemplate(id: string, data: Partial<InsertTemplate>): Promise<Template> {
  return apiRequest("PUT", `/api/templates/${id}`, data);
}

export async function deleteTemplate(id: string): Promise<void> {
  return apiRequest("DELETE", `/api/templates/${id}`, {});
}

export async function useTemplate(id: string): Promise<Template> {
  return apiRequest("POST", `/api/templates/${id}/use`, {});
}

export async function generateAIResponse(messageHistory: string[], language: string): Promise<{ response: string }> {
  return apiRequest("POST", "/api/ai/generate-response", { messageHistory, language });
}

export async function translateMessage(content: string, targetLanguage: string): Promise<{ translatedContent: string }> {
  return apiRequest("POST", "/api/ai/translate", { content, targetLanguage });
}

export async function processMessageWithAI(content: string, targetLanguage?: string): Promise<any> {
  return apiRequest("POST", "/api/ai/process", { content, targetLanguage });
}

export function invalidateContacts() {
  queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
}

export function invalidateConversations() {
  queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
}

export function invalidateMessages(conversationId?: string) {
  if (conversationId) {
    queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId, "messages"] });
  }
  queryClient.invalidateQueries({ queryKey: ["/api/messages/recent"] });
}

export function invalidateTemplates() {
  queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
}

export function invalidateStats() {
  queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
}
