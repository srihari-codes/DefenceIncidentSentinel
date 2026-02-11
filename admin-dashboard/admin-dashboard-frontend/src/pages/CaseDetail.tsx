import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, Play, FileText, Send, User, Server, Calendar, Info, File } from "lucide-react";
import { mockCases, mockPlaybooks } from "@/data/mockData";
import { toast } from "sonner";

export default function CaseDetail() {
  const { id } = useParams();
  const caseData = mockCases.find(c => c.id === id) || mockCases[0];
  const playbook = mockPlaybooks.find(pb => pb.caseId === caseData.id);

  const handleAction = (action: string) => {
    toast.success(`Action: ${action} triggered for ${caseData.id}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-foreground">Case Detail: {caseData.id}</h2>
          <p className="text-muted-foreground">{caseData.caseType}</p>
        </div>
        <Badge variant={caseData.status === 'Solved' ? 'default' : 'secondary'}>
          Status: {caseData.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Case Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Case Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase">Server ID</p>
                <div className="flex items-center gap-2">
                  <Server className="h-3 w-3" />
                  <span className="text-sm font-medium">{caseData.serverId}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase">Priority</p>
                <Badge variant={caseData.priority === 'Critical' ? 'destructive' : 'outline'}>
                  {caseData.priority}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase">Deadline</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span className="text-sm font-medium">{caseData.deadline}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase">Assigned To</p>
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  <span className="text-sm font-medium">{caseData.assignedAnalyst}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm font-medium">{caseData.user.name} ({caseData.user.id})</div>
            <div className="text-sm text-muted-foreground">{caseData.user.email}</div>
            <div className="text-xs text-muted-foreground italic">{caseData.user.role}</div>
          </CardContent>
        </Card>
      </div>

      {/* Problem Description */}
      <Card>
        <CardHeader>
          <CardTitle>Problem Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{caseData.description}</p>
        </CardContent>
      </Card>

      {/* Uploaded Evidence */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Evidence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {caseData.evidence.map((file, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-md border bg-card/50">
                <File className="h-8 w-8 text-primary/40" />
                <div className="space-y-1">
                  <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-[10px] text-muted-foreground">{file.type} • {file.size}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Playbook */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            AI Playbook Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm italic">{playbook?.summary || "No automated playbook available for this case type yet."}</p>
          {playbook && (
             <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Key Steps:</p>
                <div className="space-y-1">
                  {playbook.steps.slice(0, 2).map((step) => (
                    <div key={step.id} className="text-sm flex gap-2">
                      <span className="text-primary font-bold">•</span> {step.title}
                    </div>
                  ))}
                </div>
             </div>
          )}
        </CardContent>
      </Card>

      {/* Analyst Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Analyst Investigative Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea placeholder="Document your findings, commands run, and thoughts here..." className="min-h-[150px] bg-background" />
        </CardContent>
      </Card>

      {/* Case Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Case Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {caseData.timeline.map((event, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="text-xs text-muted-foreground w-32 shrink-0">{event.timestamp}</div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{event.event}</p>
                  <p className="text-[10px] text-muted-foreground">By {event.user}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Case Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="default" className="gap-2" onClick={() => handleAction('Mark Solved')}>
              <CheckCircle className="h-4 w-4" />
              Mark Solved
            </Button>
            <Button variant="secondary" className="gap-2" onClick={() => handleAction('Mark Pending')}>
              <Clock className="h-4 w-4" />
              Mark Pending
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => handleAction('Start Analysis')}>
              <Play className="h-4 w-4" />
              Start Analysis
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => handleAction('Generate Report')}>
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => handleAction('Send Message')}>
              <Send className="h-4 w-4" />
              Send Message to User
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

