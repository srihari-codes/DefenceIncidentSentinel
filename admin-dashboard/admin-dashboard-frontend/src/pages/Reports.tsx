import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Download, Send, Edit } from "lucide-react";
import { mockReports } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Reports() {
  const navigate = useNavigate();

  const handleAction = (action: string, id: string) => {
    toast.success(`${action} for ${id}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Reports</h2>
        <FileText className="h-8 w-8 text-primary" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
          <p className="text-sm text-muted-foreground">
            Resolution reports for solved cases
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Case ID</TableHead>
                <TableHead>User Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent to User</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.caseId}</TableCell>
                  <TableCell>{report.userDetails}</TableCell>
                  <TableCell>
                    <Badge variant={report.status === 'Final' ? 'default' : 'secondary'}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={report.sentToUser ? 'outline' : 'secondary'}>
                      {report.sentToUser ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                       <Button variant="outline" size="sm" onClick={() => navigate(`/reports/${report.id}`)}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                       </Button>
                       <Button variant="ghost" size="sm" onClick={() => handleAction('Download', report.id)}>
                          <Download className="h-3 w-3" />
                       </Button>
                       <Button variant="ghost" size="sm" onClick={() => handleAction('Send', report.id)}>
                          <Send className="h-3 w-3" />
                       </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {mockReports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No reports found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

