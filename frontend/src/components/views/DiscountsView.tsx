import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { TagIcon, ClockIcon, CopyIcon, CheckIcon, FilterIcon, SparklesIcon, HeartIcon, CheckCircleIcon } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { DiscountDrawer } from '../DiscountDrawer';
import { useToast } from '../../hooks/use-toast';

export function DiscountsView() {
  const { verificationStatus, discounts } = useAppStore();
  const [selectedDiscount, setSelectedDiscount] = useState<typeof discounts[0] | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popularity');
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredDiscounts = discounts.filter(d => {
    if (categoryFilter === 'all') return true;
    return d.category === categoryFilter;
  });

  const sortedDiscounts = [...filteredDiscounts].sort((a, b) => {
    if (sortBy === 'expiry') {
      return a.expiryDays - b.expiryDays;
    }
    return 0;
  });

  if (verificationStatus !== 'verified') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md bg-card text-card-foreground border-border">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <TagIcon className="w-8 h-8 text-muted-foreground" strokeWidth={2} />
            </div>
            <CardTitle className="text-h2 text-card-foreground">No Active Discounts</CardTitle>
            <CardDescription className="text-muted-foreground">
              Verify your student status to unlock exclusive offers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => window.location.href = '/verification'}
              className="w-full bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
            >
              Verify Student Status
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-h1 font-semibold text-foreground leading-heading tracking-heading mb-4">
          Discounts
        </h1>
        <p className="text-body text-muted-foreground leading-body">
          Browse and activate your exclusive student discounts
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <FilterIcon className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40 bg-background text-foreground border-input">
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
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 bg-background text-foreground border-input">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-popover text-popover-foreground">
              <SelectItem value="popularity" className="text-popover-foreground cursor-pointer">Popularity</SelectItem>
              <SelectItem value="expiry" className="text-popover-foreground cursor-pointer">Expiring Soon</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-small text-muted-foreground">
          {sortedDiscounts.length} offers available
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedDiscounts.map((discount, index) => (
          <Card 
            key={discount.id} 
            className="group bg-white dark:bg-gray-800 border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden rounded-2xl"
            onClick={() => setSelectedDiscount(discount)}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative h-52 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 animate-pulse" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20 animate-pulse delay-500" />
              </div>
              
              {/* Brand icon */}
              <div className="relative z-10 w-28 h-28 bg-white rounded-3xl shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TagIcon className="w-14 h-14 text-purple-600" strokeWidth={2.5} />
              </div>
              
              {/* Category badge */}
              <Badge 
                variant={discount.isExpired ? "destructive" : "default"}
                className={`absolute top-4 right-4 backdrop-blur-sm border-0 shadow-lg px-3 py-1.5 font-semibold ${
                  discount.isExpired 
                    ? "bg-red-500 text-white" 
                    : "bg-white/90 text-purple-700"
                }`}
              >
                {discount.category}
              </Badge>
              
              {/* Favorite button */}
              <button 
                className="absolute top-4 left-4 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <HeartIcon className="w-5 h-5 text-pink-500 group-hover:fill-pink-500 transition-all" strokeWidth={2} />
              </button>
            </div>
            
            <CardHeader className="pb-3 pt-6">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                {discount.brand}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 text-base mt-3 line-clamp-2">
                {discount.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-5 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {discount.discount}
                  </span>
                  <span className="text-base text-gray-500 dark:text-gray-400 font-semibold">OFF</span>
                </div>
                {!discount.isExpired && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                    <ClockIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" strokeWidth={2} />
                    <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                      {discount.expiryDays}d left
                    </span>
                  </div>
                )}
              </div>
              
              <Button 
                className={`w-full py-6 rounded-xl text-base font-bold shadow-lg transition-all duration-300 ${
                  discount.isExpired
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-xl hover:scale-105'
                }`}
                disabled={discount.isExpired}
              >
                {discount.isExpired ? (
                  <span className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5" strokeWidth={2} />
                    Expired
                  </span>
                ) : discount.isUsed ? (
                  <span className="flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5" strokeWidth={2} />
                    View Code
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5" strokeWidth={2} />
                    Get Discount Now
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <DiscountDrawer 
        discount={selectedDiscount}
        isOpen={!!selectedDiscount}
        onClose={() => setSelectedDiscount(null)}
      />
    </div>
  );
}


