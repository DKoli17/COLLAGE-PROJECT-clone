import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { TagIcon, PlusIcon, SearchIcon, FilterIcon, EyeIcon, UsersIcon, EditIcon, TrashIcon } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function VendorOffers() {
  const navigate = useNavigate();
  const { vendorDiscounts, deleteVendorDiscount } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredOffers = vendorDiscounts.filter(offer => {
    const matchesSearch = offer.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || offer.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && offer.isActive) ||
                         (statusFilter === 'inactive' && !offer.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      deleteVendorDiscount(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Manage Offers
          </h1>
          <p className="text-body text-muted-foreground">
            View, edit, and manage all your student discount offers
          </p>
        </div>
        <Button
          onClick={() => navigate('/vendor/offers/new')}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg flex items-center gap-2"
          size="lg"
        >
          <PlusIcon className="w-5 h-5" strokeWidth={2} />
          Add New Offer
        </Button>
      </div>

      <Card className="bg-card text-card-foreground border-border">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="text-h3 text-card-foreground">All Offers</CardTitle>
              <CardDescription className="text-muted-foreground">
                {filteredOffers.length} offer{filteredOffers.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:w-64">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search offers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-background text-foreground border-input">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  <SelectItem value="all" className="text-popover-foreground cursor-pointer">All Categories</SelectItem>
                  <SelectItem value="Technology" className="text-popover-foreground cursor-pointer">Technology</SelectItem>
                  <SelectItem value="Fashion" className="text-popover-foreground cursor-pointer">Fashion</SelectItem>
                  <SelectItem value="Food" className="text-popover-foreground cursor-pointer">Food</SelectItem>
                  <SelectItem value="Entertainment" className="text-popover-foreground cursor-pointer">Entertainment</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-32 bg-background text-foreground border-input">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  <SelectItem value="all" className="text-popover-foreground cursor-pointer">All Status</SelectItem>
                  <SelectItem value="active" className="text-popover-foreground cursor-pointer">Active</SelectItem>
                  <SelectItem value="inactive" className="text-popover-foreground cursor-pointer">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOffers.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <TagIcon className="w-10 h-10 text-muted-foreground" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' 
                  ? 'No offers found' 
                  : 'No offers yet'}
              </h3>
              <p className="text-body text-muted-foreground mb-8 max-w-md mx-auto">
                {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'Create your first discount offer to start reaching students'}
              </p>
              {!searchQuery && categoryFilter === 'all' && statusFilter === 'all' && (
                <Button
                  onClick={() => navigate('/vendor/offers/new')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                >
                  <PlusIcon className="w-5 h-5 mr-2" strokeWidth={2} />
                  Create Your First Offer
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Offer Details</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Discount</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Category</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-foreground">Views</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-foreground">Redemptions</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-foreground">Expiry</th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-foreground">Status</th>
                    <th className="text-right py-4 px-4 text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOffers.map((offer) => (
                    <tr key={offer.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <TagIcon className="w-6 h-6 text-primary" strokeWidth={2} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">{offer.brand}</p>
                            <p className="text-sm text-muted-foreground truncate">{offer.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-primary text-lg">{offer.discount}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {offer.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <EyeIcon className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                          <span className="text-foreground font-medium">{offer.totalViews}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <UsersIcon className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                          <span className="text-foreground font-medium">{offer.usageCount}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`text-sm font-medium ${offer.expiryDays <= 7 ? 'text-orange-600' : 'text-foreground'}`}>
                          {offer.expiryDays} days
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {offer.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary hover:bg-primary/10"
                          >
                            <EditIcon className="w-4 h-4" strokeWidth={2} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(offer.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <TrashIcon className="w-4 h-4" strokeWidth={2} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

