import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, X, Edit, Play, Terminal, ListChecks } from "lucide-react";
import { mockPlaybooks } from "@/data/mockData";
import { toast } from "sonner";

export default function PlaybookDetail() {
  const { id } = useParams();
  const playbook = mockPlaybooks.find(pb => pb.id === id) || mockPlaybooks[0];

  const handleAction = (action: string) => {
    toast.info(`${action}: Playbook ${playbook.id}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-foreground">Playbook: {playbook.id}</h2>
          <p className="text-muted-foreground">Linked Case: <span className="text-foreground font-medium">{playbook.caseId}</span></p>
        </div>
        <Badge variant={playbook.status === 'Approved' ? 'default' : 'secondary'}>
          Status: {playbook.status}
        </Badge>
      </div>

      {/* AI Steps */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            AI-Generated Resolution Steps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {playbook.steps.map((step, idx) => (
            <div key={step.id} className="flex gap-4">
               <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs shrink-0 font-bold">
                 {idx + 1}
               </div>
               <div className="space-y-1">
                 <p className="text-sm font-semibold">{step.title}</p>
                 <p className="text-sm text-muted-foreground">{step.description}</p>
               </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Suggested Commands */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            Suggested Commands
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {playbook.commands.map((cmd) => (
            <div key={cmd.id} className="p-3 rounded-lg bg-sidebar-background border border-sidebar-border space-y-2">
              <div className="flex items-center justify-between">
                <code className="text-sidebar-primary text-xs font-mono">{cmd.command}</code>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                  navigator.clipboard.writeText(cmd.command);
                  toast.success("Command copied to clipboard");
                }}>
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-[10px] text-sidebar-foreground/70">{cmd.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Playbook Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="default" className="gap-2" onClick={() => handleAction('Accepted')}>
              <CheckCircle className="h-4 w-4" />
              Accept
            </Button>
            <Button variant="destructive" className="gap-2" onClick={() => handleAction('Rejected')}>
              <X className="h-4 w-4" />
              Reject
            </Button>
            <Button variant="secondary" className="gap-2" onClick={() => handleAction('Modify Requested')}>
              <Edit className="h-4 w-4" />
              Modify
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => handleAction('Applied to Case')}>
              <Play className="h-4 w-4" />
              Apply to Case
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

