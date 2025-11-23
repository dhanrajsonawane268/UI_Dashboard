import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mail, Users, TrendingUp, Phone, Clock, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import type { Message, Contact } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { data: recentMessages, isLoading: loadingMessages } = useQuery<Message[]>({
    queryKey: ["/api/messages/recent"],
  });

  const { data: stats } = useQuery<{
    totalMessages: number;
    totalContacts: number;
    responseRate: number;
    avgResponseTime: string;
  }>({
    queryKey: ["/api/stats"],
  });

  const statCards = [
    {
      title: "Total Messages",
      value: stats?.totalMessages || 0,
      icon: MessageSquare,
      trend: "+12% from last week",
      color: "text-blue-500",
    },
    {
      title: "Active Contacts",
      value: stats?.totalContacts || 0,
      icon: Users,
      trend: "+8 new this week",
      color: "text-green-500",
    },
    {
      title: "Response Rate",
      value: `${stats?.responseRate || 0}%`,
      icon: CheckCircle2,
      trend: "+5% improvement",
      color: "text-purple-500",
    },
    {
      title: "Avg Response Time",
      value: stats?.avgResponseTime || "2.5h",
      icon: Clock,
      trend: "15min faster",
      color: "text-orange-500",
    },
  ];

  const getChannelIcon = (channel: string) => {
    return channel === "whatsapp" ? Phone : Mail;
  };

  const getChannelColor = (channel: string) => {
    return channel === "whatsapp" ? "text-green-600" : "text-blue-600";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground" data-testid="text-page-title">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's your communication overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <Card key={stat.title} data-testid={`card-stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold" data-testid={`text-stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}-value`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
            <p className="text-sm text-muted-foreground">Latest communication events across all channels</p>
          </CardHeader>
          <CardContent>
            {loadingMessages ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-lg border animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4" />
                      <div className="h-3 bg-muted rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !recentMessages || recentMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No messages yet</h3>
                <p className="text-sm text-muted-foreground mt-1">Start communicating with your contacts to see activity here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentMessages.map((message) => {
                  const ChannelIcon = getChannelIcon(message.channel);
                  return (
                    <div
                      key={message.id}
                      className="flex items-start gap-4 p-4 rounded-lg border hover-elevate"
                      data-testid={`card-message-${message.id}`}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-sm">
                          {message.contactId?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">Contact</span>
                          <ChannelIcon className={`w-4 h-4 ${getChannelColor(message.channel)}`} />
                          <Badge variant="secondary" className="text-xs">
                            {message.direction}
                          </Badge>
                          {message.sentiment && (
                            <Badge variant={message.sentiment === "urgent" ? "destructive" : "secondary"} className="text-xs">
                              {message.sentiment}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-foreground line-clamp-2">{message.content}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-muted-foreground font-mono">
                            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                          </span>
                          {message.language && (
                            <Badge variant="outline" className="text-xs">
                              {message.language.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
