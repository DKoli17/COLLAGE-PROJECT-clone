import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ShieldCheckIcon, SearchIcon, FilterIcon, CheckCircleIcon, XCircleIcon, ClockIcon, EyeIcon, FileTextIcon } from 'lucide-react';

interface Verification {
  id: string;
  studentName: string;
  studentEmail: string;
  university: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewer?: string;
  documentUrl?: string;
}

export function AdminVerifications() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockVerifications: Verification[] = [
        {
          id: '1',
          studentName: 'John Doe',
          studentEmail: 'john.doe@university.edu',
          university: 'State University',
          status: 'pending',
          submittedAt: '2024-01-20T10:30:00Z',
          documentUrl: 'https://example.com/student-id-1.pdf'
        },
        {
          id: '2',
          studentName: 'Sarah Smith',
          studentEmail: 'sarah.smith@college.edu',
          university: 'City College',
          status: 'approved',
          submittedAt: '2024-01-18T14:15:00Z',
          reviewedAt: '2024-01-19T09:00:00Z',
          reviewer: 'Admin User',
          documentUrl: 'https://example.com/student-id-2.pdf'
        },
        {
          id: '3',
          studentName: 'Mike Johnson',
          studentEmail: 'mike.johnson@univ.edu',
          university: 'Tech University',
          status: 'rejected',
          submittedAt: '2024-01-15T16:45:00Z',
          reviewedAt: '2024-01-16T11:30:00Z',
          reviewer: 'Admin User',
          documentUrl: 'https://example.com/student-id-3.pdf'
        }
      ];
      setVerifications(mockVerifications);
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (verificationId: string, newStatus: string) => {
    try {
      // Mock API call - replace with actual API
      setVerifications(prev => prev.map(verification =>
        verification.id === verificationId ? {
          ...verification,
          status: newStatus as Verification['status'],
          reviewedAt: new Date().toISOString(),
          reviewer: 'Current Admin'
        } : verification
      ));
    } catch (error) {
      console.error('Error updating verification status:', error);
    }
  };

  const filteredVerifications = verifications.filter(verification => {
    const matchesSearch = verification.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         verification.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         verification.university.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || verification.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 text-white"><CheckCircleIcon className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white"><ClockIcon className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white"><XCircleIcon className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Verification Requests</h1>
        <p className="text-muted-foreground">Review and approve student ID verifications</p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search verifications..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <FilterIcon className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Verifications List */}
      <div className="grid gap-4">
        {filteredVerifications.map((verification) => (
          <Card key={verification.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="" alt={verification.studentName} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {verification.studentName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{verification.studentName}</h3>
                    <p className="text-sm text-muted-foreground">{verification.studentEmail}</p>
                    <p className="text-sm text-muted-foreground">{verification.university}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {getStatusBadge(verification.status)}
                    <p className="text-xs text-muted-foreground mt-1">
                      Submitted {new Date(verification.submittedAt).toLocaleDateString()}
                    </p>
                    {verification.reviewedAt && (
                      <p className="text-xs text-muted-foreground">
                        Reviewed {new Date(verification.reviewedAt).toLocaleDateString()}
                      </p>
                    )}
                    {verification.reviewer && (
                      <p className="text-xs text-muted-foreground">
                        by {verification.reviewer}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {verification.documentUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={verification.documentUrl} target="_blank" rel="noopener noreferrer">
                          <FileTextIcon className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                    {verification.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleStatusChange(verification.id, 'approved')}
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleStatusChange(verification.id, 'rejected')}
                        >
                          <XCircleIcon className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVerifications.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <ShieldCheckIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No verification requests found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No verification requests have been submitted yet.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
