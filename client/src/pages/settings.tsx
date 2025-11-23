import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Key, Globe, Database } from "lucide-react";

export default function Settings() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure your Command Centre</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general" data-testid="tab-general">General</TabsTrigger>
            <TabsTrigger value="notifications" data-testid="tab-notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations" data-testid="tab-integrations">Integrations</TabsTrigger>
            <TabsTrigger value="data" data-testid="tab-data">Data</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Language Preferences
                </CardTitle>
                <CardDescription>Set default language for communication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-language">Default Language</Label>
                  <select className="w-full h-10 px-3 rounded-md border bg-background" data-testid="select-default-language">
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="kn">Kannada</option>
                    <option value="ne">Nepali</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-detect language</Label>
                    <p className="text-sm text-muted-foreground">Automatically detect message language</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-auto-detect" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New message alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified for new messages</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-new-message-alerts" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Urgent message alerts</Label>
                    <p className="text-sm text-muted-foreground">Priority notifications for urgent messages</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-urgent-alerts" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email summaries</p>
                  </div>
                  <Switch data-testid="switch-email-notifications" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  API Integrations
                </CardTitle>
                <CardDescription>Configure external service connections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="twilio-sid">Twilio Account SID</Label>
                  <Input
                    id="twilio-sid"
                    type="password"
                    placeholder="Enter your Twilio SID"
                    data-testid="input-twilio-sid"
                  />
                  <p className="text-xs text-muted-foreground">Required for WhatsApp integration</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twilio-token">Twilio Auth Token</Label>
                  <Input
                    id="twilio-token"
                    type="password"
                    placeholder="Enter your Twilio token"
                    data-testid="input-twilio-token"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <Input
                    id="openai-key"
                    type="password"
                    placeholder="sk-..."
                    data-testid="input-openai-key"
                  />
                  <p className="text-xs text-muted-foreground">Required for AI-powered features</p>
                </div>
                <Button data-testid="button-save-integrations">Save Integration Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Management
                </CardTitle>
                <CardDescription>Manage your data and privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Export Data</Label>
                  <p className="text-sm text-muted-foreground mb-2">Download all your data in JSON format</p>
                  <Button variant="outline" data-testid="button-export-data">Export All Data</Button>
                </div>
                <div className="space-y-2 pt-4 border-t">
                  <Label className="text-destructive">Danger Zone</Label>
                  <p className="text-sm text-muted-foreground mb-2">Permanently delete all data</p>
                  <Button variant="destructive" data-testid="button-delete-data">Delete All Data</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
