import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, ExternalLink } from "lucide-react";
import { mockCases, Case } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function SearchPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    caseId: "",
    username: "",
    email: "",
    caseType: ""
  });
  const [results, setResults] = useState<Case[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    const filtered = mockCases.filter(c => {
      return (
        (!formData.caseId || c.id.toLowerCase().includes(formData.caseId.toLowerCase())) &&
        (!formData.username || c.user.name.toLowerCase().includes(formData.username.toLowerCase())) &&
        (!formData.email || c.user.email.toLowerCase().includes(formData.email.toLowerCase())) &&
        (!formData.caseType || c.caseType.toLowerCase().includes(formData.caseType.toLowerCase()))
      );
    });
    setResults(filtered);
    setHasSearched(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Search Cases</h2>
        <Search className="h-8 w-8 text-primary" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Search</CardTitle>
          <p className="text-sm text-muted-foreground">
            Find cases by various criteria
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="caseId">Case ID</Label>
              <Input 
                id="caseId" 
                placeholder="e.g. CASE-001" 
                value={formData.caseId}
                onChange={e => setFormData({...formData, caseId: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="Search by user name..." 
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Search by email..." 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="caseType">Case Type</Label>
              <Input 
                id="caseType" 
                placeholder="e.g. Phishing, Malware" 
                value={formData.caseType}
                onChange={e => setFormData({...formData, caseType: e.target.value})}
              />
            </div>
          </div>

          <Button className="w-full md:w-auto gap-2" onClick={handleSearch}>
            <Search className="h-4 w-4" />
            Perform Search
          </Button>
        </CardContent>
      </Card>

      {/* Search Results */}
      <Card>
        <CardHeader>
          <CardTitle>Search Results {hasSearched && `(${results.length})`}</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasSearched ? (
            <div className="text-muted-foreground text-center py-8 italic">
              Results will appear here after you perform a search
            </div>
          ) : results.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.id}</TableCell>
                    <TableCell>{c.caseType}</TableCell>
                    <TableCell>{c.user.name}</TableCell>
                    <TableCell>
                      <Badge variant={c.status === 'Solved' ? 'default' : 'secondary'}>
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/cases/${c.id}`)}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-destructive text-center py-8">
              No cases found matching those criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

