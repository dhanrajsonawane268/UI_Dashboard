import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Copy, Edit, Phone, Mail, Globe, FileText } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Template, InsertTemplate } from "@shared/schema";
import { createTemplate, useTemplate, invalidateTemplates } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Templates() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<InsertTemplate>>({
    name: "",
    category: "onboarding",
    channel: "whatsapp",
    content: { text: "" },
    variables: [],
    language: "en",
  });
  
  const { toast } = useToast();

  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const createMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      invalidateTemplates();
      setIsDialogOpen(false);
      setFormData({
        name: "",
        category: "onboarding",
        channel: "whatsapp",
        content: { text: "" },
        variables: [],
        language: "en",
      });
      toast({
        title: "Template created",
        description: "New template has been added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      });
    },
  });

  const useMutation1 = useMutation({
    mutationFn: useTemplate,
    onSuccess: () => {
      invalidateTemplates();
      toast({
        title: "Template used",
        description: "Template usage count updated",
      });
    },
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.channel) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate(formData as InsertTemplate);
  };

  const getChannelIcon = (channel: string) => {
    return channel === "whatsapp" ? Phone : Mail;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      onboarding: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      reminder: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      notification: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      support: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    };
    return colors[category] || "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
  };

  const renderContent = (content: any) => {
    if (typeof content === "string") return content;
    if (typeof content === "object") {
      return content.text || JSON.stringify(content);
    }
    return "";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">Templates</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage reusable message templates</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-template">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>Design a reusable message template</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name *</Label>
                    <Input
                      id="template-name"
                      placeholder="Enter template name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      data-testid="input-template-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger data-testid="select-template-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="onboarding">Onboarding</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="notification">Notification</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="channel">Channel *</Label>
                    <Select value={formData.channel} onValueChange={(value: any) => setFormData({ ...formData, channel: value })}>
                      <SelectTrigger data-testid="select-template-channel">
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language *</Label>
                    <Select value={formData.language} onValueChange={(value: any) => setFormData({ ...formData, language: value })}>
                      <SelectTrigger data-testid="select-template-language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="kn">Kannada</SelectItem>
                        <SelectItem value="ne">Nepali</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content">Message Content *</Label>
                    <Textarea
                      id="content"
                      placeholder="Enter message content... Use {name}, {date}, etc. for variables"
                      rows={10}
                      value={typeof formData.content === 'object' ? (formData.content as any).text : formData.content}
                      onChange={(e) => setFormData({ ...formData, content: { text: e.target.value } })}
                      data-testid="textarea-template-content"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Available variables:</p>
                    <p>{"{name}"}, {"{phone}"}, {"{date}"}, {"{time}"}</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={createMutation.isPending} data-testid="button-save-template">
                  {createMutation.isPending ? "Saving..." : "Save Template"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !templates || templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No templates yet</h3>
            <p className="text-sm text-muted-foreground mb-6">Create your first template to streamline communication</p>
            <Button data-testid="button-create-first-template">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => {
              const ChannelIcon = getChannelIcon(template.channel);
              return (
                <Card key={template.id} className="hover-elevate" data-testid={`card-template-${template.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold truncate">{template.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge className={getCategoryColor(template.category)}>
                            {template.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <ChannelIcon className="w-3 h-3 mr-1" />
                            {template.channel}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Globe className="w-3 h-3 mr-1" />
                            {template.language.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {renderContent(template.content)}
                    </p>
                    {template.variables && template.variables.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-muted-foreground mb-1">Variables:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.variables.map((variable) => (
                            <code key={variable} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                              {variable}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <span className="text-xs text-muted-foreground">
                        Used {template.usageCount} times
                      </span>
                      {template.isActive ? (
                        <Badge variant="secondary" className="text-xs">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Inactive</Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => useMutation1.mutate(template.id)}
                      disabled={useMutation1.isPending}
                      data-testid={`button-use-template-${template.id}`}
                    >
                      Use Template
                    </Button>
                    <Button variant="ghost" size="icon" data-testid={`button-edit-template-${template.id}`}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" data-testid={`button-copy-template-${template.id}`}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
