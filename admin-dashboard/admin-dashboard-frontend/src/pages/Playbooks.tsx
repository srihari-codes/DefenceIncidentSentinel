import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockPlaybooks } from "@/data/mockData";

export default function Playbooks() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">AI Playbooks</h2>
        <BookOpen className="h-8 w-8 text-primary" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Playbooks</CardTitle>
          <p className="text-sm text-muted-foreground">
            AI-generated guides for case resolution
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Playbook ID</TableHead>
                <TableHead>Case ID</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPlaybooks.map((pb) => (
                <TableRow key={pb.id}>
                  <TableCell className="font-medium">{pb.id}</TableCell>
                  <TableCell>{pb.caseId}</TableCell>
                  <TableCell className="max-w-md truncate">{pb.summary}</TableCell>
                  <TableCell>
                    <Badge variant={pb.status === 'Approved' ? 'default' : 'secondary'}>
                      {pb.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => navigate(`/playbooks/${pb.id}`)}
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

