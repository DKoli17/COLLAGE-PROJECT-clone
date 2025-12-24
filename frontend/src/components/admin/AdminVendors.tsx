import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BuildingIcon, SearchIcon, FilterIcon, CheckCircleIcon, XCircleIcon, ClockIcon, EyeIcon, BanIcon, StarIcon } from 'lucide-react';

export function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockVendors = [
        {
          id: '1',
          name: 'Pizza Hub',
          email: 'contact@pizzahub.com',
          companyName: 'Pizza Hub Inc.',
          status: 'approved',
          joinDate: '2024-01-10',
          totalOffers: 15,
          rating: 4.5,
          avatar: ''
        },
        {
          id: '2',
          name: 'TechZone',
          email: 'info@techzone.com',
          companyName: 'TechZone Electronics',
          status: 'pending',
          joinDate: '2024-01-18',
          totalOffers: 0,
          rating: 0,
          avatar: ''
        },
        {
          id: '3',
          name: 'BookWorld',
          email: 'support@bookworld.com',
          companyName: 'BookWorld Publishing',
          status: 'rejected',
          joinDate: '2024-01-05',
          totalOffers: 0,
          rating: 0,
          avatar: ''
        }
      ];
      setVendors(mockVendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (vendorId: string, newStatus: string) => {
    try {
      // Mock API call - replace with actual API
      setVendors(prev => prev.map(vendor =>
        vendor.id === vendorId ? { ...vendor, status: newStatus } : vendor
      ));
    } catch (error) {
      console.error('Error updating vendor status:', error);
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || vendor.status === filterStatus;
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Vendor Management</h1>
        <p className="text-muted-foreground">Review and manage vendor applications</p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <FilterIcon className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vendors List */}
      <div className="grid gap-4">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={vendor.avatar} alt={vendor.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {vendor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{vendor.name}</h3>
                    <p className="text-sm text-muted-foreground">{vendor.email}</p>
                    <p className="text-sm text-muted-foreground">{vendor.companyName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {getStatusBadge(vendor.status)}
                    <p className="text-xs text-muted-foreground mt-1">
                      {vendor.totalOffers} offers
                    </p>
                    {vendor.rating > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <StarIcon className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {vendor.rating}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(vendor.joinDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                    {vendor.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleStatusChange(vendor.id, 'approved')}
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleStatusChange(vendor.id, 'rejected')}
                        >
                          <XCircleIcon className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {vendor.status === 'approved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleStatusChange(vendor.id, 'rejected')}
                      >
                        <BanIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BuildingIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No vendors found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No vendors have applied yet.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
