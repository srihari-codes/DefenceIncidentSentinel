import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Send, Inbox, MessageSquare } from "lucide-react";
import { mockAlerts, mockMessages } from "@/data/mockData";

export default function Alerts() {
  const sentMessages = mockMessages.filter(m => m.type === 'sent');
  const receivedMessages = mockMessages.filter(m => m.type === 'received');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Alerts & Messages</h2>
        <Bell className="h-8 w-8 text-primary" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Communication Center</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage system alerts and analyst-user communications
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="alerts" className="space-y-4">
            <TabsList>
              <TabsTrigger value="alerts" className="gap-2">
                <Bell className="h-4 w-4" />
                Alerts ({mockAlerts.length})
              </TabsTrigger>
              <TabsTrigger value="sent" className="gap-2">
                <Send className="h-4 w-4" />
                Sent ({sentMessages.length})
              </TabsTrigger>
              <TabsTrigger value="received" className="gap-2">
                <Inbox className="h-4 w-4" />
                Received ({receivedMessages.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="alerts" className="space-y-4">
              {mockAlerts.map((alert) => (
                <div key={alert.id} className="flex gap-4 p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors relative overflow-hidden group">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    alert.severity === 'Critical' ? 'bg-destructive' : 
                    alert.severity === 'Warning' ? 'bg-warning' : 'bg-primary'
                  }`} />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{alert.title}</span>
                      <Badge variant={alert.severity === 'Critical' ? 'destructive' : 'outline'} className="text-[10px] px-1.5 h-4 uppercase">
                        {alert.severity}
                      </Badge>
                      {!alert.read && <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-[10px] text-muted-foreground">{alert.timestamp}</p>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="sent" className="space-y-4">
              {sentMessages.map((msg) => (
                <div key={msg.id} className="p-4 rounded-lg border bg-card/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-3 w-3 text-primary" />
                      <span className="text-xs font-medium">To: {msg.recipient}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm border-l-2 border-primary/20 pl-3 py-1 italic">{msg.content}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="received" className="space-y-4">
              {receivedMessages.map((msg) => (
                <div key={msg.id} className="p-4 rounded-lg border bg-card/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-3 w-3 text-accent" />
                      <span className="text-xs font-medium text-accent">From: {msg.sender}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm border-l-2 border-accent/20 pl-3 py-1">{msg.content}</p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

