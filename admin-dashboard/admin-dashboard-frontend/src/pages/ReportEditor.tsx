import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Download, Send, FileText, Sparkles } from "lucide-react";
import { mockReports } from "@/data/mockData";
import { toast } from "sonner";
import { useState } from "react";

export default function ReportEditor() {
  const { id } = useParams();
  const report = mockReports.find(r => r.id === id) || mockReports[0];
  const [resolution, setResolution] = useState(report.resolution);

  const handleAction = (action: string) => {
    toast.success(`${action} for ${report.id}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-foreground">Report Editor: {report.id}</h2>
          <p className="text-muted-foreground">Case Reference: <span className="text-foreground font-medium">{report.caseId}</span></p>
        </div>
        <FileText className="h-8 w-8 text-primary" />
      </div>

      {/* AI Suggested Resolution */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            AI Suggested Resolution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm italic leading-relaxed text-muted-foreground p-4 rounded-lg bg-card/50 border border-primary/10">
            {report.aiSuggestedResolution}
          </div>
          <Button variant="ghost" size="sm" className="mt-4 text-primary hover:text-primary/80" onClick={() => setResolution(report.aiSuggestedResolution)}>
            Apply AI Suggestion to Editor
          </Button>
        </CardContent>
      </Card>

      {/* Analyst Final Resolution */}
      <Card>
        <CardHeader>
          <CardTitle>Analyst Final Resolution</CardTitle>
          <p className="text-xs text-muted-foreground">This content will be sent to the end user.</p>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter your final resolution summary here..."
            className="min-h-[250px] bg-background font-serif text-base leading-relaxed"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Report Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button variant="default" className="gap-2" onClick={() => handleAction('Report Saved & Downloaded')}>
              <Download className="h-4 w-4" />
              Save & Download
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => handleAction('Report Sent to User')}>
              <Send className="h-4 w-4" />
              Finalize & Send to User
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

