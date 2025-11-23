import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, MessageSquare, Users, Clock, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Analytics() {
  const { data: analyticsData } = useQuery<{
    messageVolume: { date: string; count: number }[];
    channelDistribution: { channel: string; count: number; percentage: number }[];
    languageDistribution: { language: string; count: number; percentage: number }[];
    responseMetrics: { avgResponseTime: string; responseRate: number };
    topContacts: { name: string; messageCount: number; type: string }[];
  }>({
    queryKey: ["/api/analytics"],
  });

  const kpiCards = [
    {
      title: "Total Messages",
      value: "1,234",
      change: "+12.5%",
      trend: "up",
      icon: MessageSquare,
      color: "text-blue-500",
    },
    {
      title: "Active Contacts",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "text-green-500",
    },
    {
      title: "Response Rate",
      value: "94.3%",
      change: "+2.1%",
      trend: "up",
      icon: CheckCircle,
      color: "text-purple-500",
    },
    {
      title: "Avg Response Time",
      value: "2.4h",
      change: "-18min",
      trend: "up",
      icon: Clock,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Communication insights and performance metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((kpi) => (
            <Card key={kpi.title} data-testid={`card-kpi-${kpi.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{kpi.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-xs ${kpi.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                    {kpi.change}
                  </span>
                  <span className="text-xs text-muted-foreground">vs last week</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Message Volume</CardTitle>
              <CardDescription>Daily message count over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {[45, 62, 58, 73, 81, 69, 87].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-primary rounded-t transition-all hover-elevate"
                      style={{ height: `${height}%` }}
                      data-testid={`bar-message-volume-${i}`}
                    />
                    <span className="text-xs text-muted-foreground font-mono">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Channel Distribution</CardTitle>
              <CardDescription>Messages by communication channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-sm font-medium">WhatsApp</span>
                    </div>
                    <span className="text-sm text-muted-foreground">68%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "68%" }} />
                  </div>
                  <p className="text-xs text-muted-foreground">842 messages</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <span className="text-sm text-muted-foreground">32%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "32%" }} />
                  </div>
                  <p className="text-xs text-muted-foreground">392 messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Language Distribution</CardTitle>
              <CardDescription>Messages by language</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { lang: "English", code: "EN", count: 542, color: "bg-blue-500" },
                  { lang: "Kannada", code: "KN", count: 321, color: "bg-purple-500" },
                  { lang: "Hindi", code: "HI", count: 234, color: "bg-orange-500" },
                  { lang: "Nepali", code: "NE", count: 137, color: "bg-green-500" },
                ].map((item) => (
                  <div key={item.code} className="flex items-center gap-3">
                    <Badge variant="outline" className="w-12 justify-center">
                      {item.code}
                    </Badge>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{item.lang}</span>
                        <span className="text-sm text-muted-foreground">{item.count}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${(item.count / 1234) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Contacts</CardTitle>
              <CardDescription>Most active conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Priya Sharma", messages: 45, type: "employer" },
                  { name: "Lakshmi Devi", messages: 38, type: "maid" },
                  { name: "Rajesh Kumar", messages: 32, type: "employer" },
                  { name: "Anita Rao", messages: 28, type: "maid" },
                  { name: "Suresh Patel", messages: 24, type: "employer" },
                ].map((contact, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border hover-elevate">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {contact.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{contact.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{contact.type}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{contact.messages} msgs</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
