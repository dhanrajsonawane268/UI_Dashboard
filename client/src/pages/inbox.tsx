import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Phone, Mail, Send, Sparkles, Languages } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Conversation, Message, InsertMessage } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { sendMessage, generateAIResponse, invalidateMessages, invalidateConversations } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [aiSuggestion, setAiSuggestion] = useState("");
  
  const { toast } = useToast();

  const { data: conversations, isLoading: loadingConversations } = useQuery<(Conversation & { contact: { name: string; type: string } })[]>({
    queryKey: ["/api/conversations"],
  });

  const { data: messages, isLoading: loadingMessages } = useQuery<Message[]>({
    queryKey: ["/api/conversations", selectedConversation, "messages"],
    enabled: !!selectedConversation,
  });

  const selectedConv = conversations?.find(c => c.id === selectedConversation);

  const sendMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      invalidateMessages(selectedConversation || undefined);
      invalidateConversations();
      setMessageContent("");
      setAiSuggestion("");
      toast({
        title: "Message sent",
        description: "Your message has been delivered",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const aiSuggestMutation = useMutation({
    mutationFn: ({ history, lang }: { history: string[]; lang: string }) => 
      generateAIResponse(history, lang),
    onSuccess: (data) => {
      setAiSuggestion(data.response);
      toast({
        title: "AI Suggestion Ready",
        description: "Click to use the suggested response",
      });
    },
  });

  const handleSend = () => {
    if (!selectedConversation || !selectedConv || !messageContent.trim()) {
      return;
    }

    const messageData: InsertMessage = {
      conversationId: selectedConversation,
      contactId: selectedConv.contactId,
      direction: "outbound",
      channel: selectedConv.channel,
      content: messageContent,
      language: selectedLanguage as any,
      status: "sent",
    };

    sendMutation.mutate(messageData);
  };

  const handleAISuggest = () => {
    if (!messages || messages.length === 0) {
      toast({
        title: "No messages",
        description: "Send some messages first to get AI suggestions",
        variant: "destructive",
      });
      return;
    }

    const messageHistory = messages.slice(-5).map(m => m.content);
    aiSuggestMutation.mutate({ history: messageHistory, lang: selectedLanguage });
  };

  const getChannelIcon = (channel: string) => {
    return channel === "whatsapp" ? Phone : Mail;
  };

  const getChannelColor = (channel: string) => {
    return channel === "whatsapp" ? "text-green-600" : "text-blue-600";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex overflow-hidden">
        <div className="w-96 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                data-testid="input-search-conversations"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConversations ? (
              <div className="space-y-2 p-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !conversations || conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Mail className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">No conversations yet</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {conversations.map((conv) => {
                  const ChannelIcon = getChannelIcon(conv.channel);
                  return (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer hover-elevate ${
                        selectedConversation === conv.id ? "bg-accent" : ""
                      }`}
                      data-testid={`card-conversation-${conv.id}`}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-sm">
                          {conv.contact.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm truncate">{conv.contact.name}</span>
                          <ChannelIcon className={`w-3 h-3 ${getChannelColor(conv.channel)}`} />
                        </div>
                        {conv.subject && (
                          <p className="text-xs text-muted-foreground truncate">{conv.subject}</p>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground font-mono">
                            {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}
                          </span>
                          {conv.unreadCount > 0 && (
                            <Badge variant="default" className="text-xs h-5 px-2">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-sm">CO</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">Contact Name</h3>
                    <p className="text-xs text-muted-foreground">Last seen recently</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">WhatsApp</Badge>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loadingMessages ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                        <div className="max-w-2xl animate-pulse">
                          <div className="h-20 bg-muted rounded-lg w-64" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !messages || messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Mail className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">No messages in this conversation</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.direction === "outbound" ? "justify-end" : "justify-start"}`}
                      data-testid={`message-${message.id}`}
                    >
                      <div className={`max-w-2xl ${message.direction === "outbound" ? "ml-auto" : ""}`}>
                        <Card className={message.direction === "outbound" ? "bg-primary text-primary-foreground" : ""}>
                          <CardContent className="p-3">
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            {message.translatedContent && message.translatedContent !== message.content && (
                              <div className="mt-2 pt-2 border-t border-primary-foreground/20">
                                <p className="text-xs opacity-80 italic">{message.translatedContent}</p>
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs opacity-70 font-mono">
                                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                              </span>
                              {message.language && (
                                <Badge variant="outline" className="text-xs h-4">
                                  {message.language.toUpperCase()}
                                </Badge>
                              )}
                              {message.sentiment && (
                                <Badge variant="secondary" className="text-xs h-4">
                                  {message.sentiment}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-border bg-background/95 backdrop-blur">
                {aiSuggestion && (
                  <Card className="mb-3 bg-accent">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">AI Suggested Response:</p>
                          <p className="text-sm">{aiSuggestion}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setMessageContent(aiSuggestion);
                            setAiSuggestion("");
                          }}
                        >
                          Use
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message..."
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      className="min-h-[80px] resize-none"
                      data-testid="textarea-message-input"
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="w-32" data-testid="select-language">
                          <Languages className="w-4 h-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="kn">Kannada</SelectItem>
                          <SelectItem value="ne">Nepali</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAISuggest}
                        disabled={aiSuggestMutation.isPending}
                        data-testid="button-ai-suggest"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {aiSuggestMutation.isPending ? "Generating..." : "AI Suggest"}
                      </Button>
                    </div>
                  </div>
                  <Button
                    className="mt-auto"
                    onClick={handleSend}
                    disabled={sendMutation.isPending || !messageContent.trim()}
                    data-testid="button-send-message"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {sendMutation.isPending ? "Sending..." : "Send"}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-sm text-muted-foreground">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
