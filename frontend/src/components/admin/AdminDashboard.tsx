import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { UsersIcon, BuildingIcon, TagIcon, ShieldCheckIcon, TrendingUpIcon, ActivityIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';

export function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { label: 'Total Students', value: '1,247', icon: UsersIcon, color: 'from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900', iconBg: 'bg-blue-500', iconColor: 'text-white', change: '+12%' },
    { label: 'Total Vendors', value: '89', icon: BuildingIcon, color: 'from-green-50 to-green-100 dark:from-green-950 dark:to-green-900', iconBg: 'bg-green-500', iconColor: 'text-white', change: '+8%' },
    { label: 'Active Offers', value: '342', icon: TagIcon, color: 'from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900', iconBg: 'bg-purple-500', iconColor: 'text-white', change: '+15%' },
    { label: 'Pending Verifications', value: '23', icon: ShieldCheckIcon, color: 'from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900', iconBg: 'bg-orange-500', iconColor: 'text-white', change: '-5%' },
    { label: 'Redemptions This Month', value: '5,892', icon: TrendingUpIcon, color: 'from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900', iconBg: 'bg-teal-500', iconColor: 'text-white', change: '+25%' },
  ];

  const recentActivity = [
    { id: 1, type: 'vendor', message: 'New Vendor: Pizza Hub registered', time: '5 minutes ago', icon: BuildingIcon, color: 'text-green-600' },
    { id: 2, type: 'verification', message: 'Student ID verification pending: John Doe', time: '12 minutes ago', icon: ShieldCheckIcon, color: 'text-orange-600' },
    { id: 3, type: 'offer', message: 'Offer "STUDENT20" added by TechZone', time: '1 hour ago', icon: TagIcon, color: 'text-blue-600' },
    { id: 4, type: 'student', message: 'New student registered: Sarah Smith', time: '2 hours ago', icon: UsersIcon, color: 'text-purple-600' },
    { id: 5, type: 'verification', message: 'Student ID approved: Mike Johnson', time: '3 hours ago', icon: CheckCircleIcon, color: 'text-green-600' },
  ];

  const pendingActions = [
    { id: 1, title: '23 Verification Requests', description: 'Student IDs waiting for approval', action: 'Review Now', route: '/admin/verifications', urgent: true },
    { id: 2, title: '5 New Vendor Applications', description: 'Vendors pending approval', action: 'Review', route: '/admin/vendors', urgent: false },
    { id: 3, title: '12 Expiring Offers', description: 'Offers expiring within 7 days', action: 'View', route: '/admin/offers', urgent: false },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Welcome back, Admin 👋
        </h1>
        <p className="text-body text-muted-foreground">
          Here's what's happening with your platform today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className={`bg-gradient-to-br ${stat.color} border-0 hover:shadow-xl transition-all hover:-translate-y-1`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium text-gray-700 dark:text-gray-300">{stat.label}</CardTitle>
                <div className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center shadow-lg`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} strokeWidth={2} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Actions */}
      {pendingActions.some(action => action.urgent) && (
        <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircleIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" strokeWidth={2} />
              <div>
                <CardTitle className="text-orange-900 dark:text-orange-100">Action Required</CardTitle>
                <CardDescription className="text-orange-700 dark:text-orange-300">
                  Items that need your immediate attention
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pendingActions.map((action) => (
                <div
                  key={action.id}
                  className={`p-4 rounded-lg border ${
                    action.urgent 
                      ? 'bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-800' 
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <h4 className="font-semibold text-foreground mb-1">{action.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                  <Button
                    onClick={() => navigate(action.route)}
                    size="sm"
                    className={action.urgent ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-primary text-primary-foreground hover:bg-primary/90'}
                  >
                    {action.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-h3 text-card-foreground">Recent Activity</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Latest actions on your platform
                </CardDescription>
              </div>
              <ActivityIcon className="w-6 h-6 text-muted-foreground" strokeWidth={2} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 bg-background border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-muted flex-shrink-0`}>
                    <activity.icon className={`w-5 h-5 ${activity.color}`} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle className="text-h3 text-card-foreground">Quick Actions</CardTitle>
            <CardDescription className="text-muted-foreground">
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={() => navigate('/admin/students')}
                className="w-full justify-start bg-blue-500 text-white hover:bg-blue-600 h-auto py-4"
              >
                <UsersIcon className="w-5 h-5 mr-3" strokeWidth={2} />
                <div className="text-left">
                  <p className="font-semibold">Manage Students</p>
                  <p className="text-xs opacity-90">View and approve student accounts</p>
                </div>
              </Button>

              <Button
                onClick={() => navigate('/admin/vendors')}
                className="w-full justify-start bg-green-500 text-white hover:bg-green-600 h-auto py-4"
              >
                <BuildingIcon className="w-5 h-5 mr-3" strokeWidth={2} />
                <div className="text-left">
                  <p className="font-semibold">Manage Vendors</p>
                  <p className="text-xs opacity-90">Review vendor applications</p>
                </div>
              </Button>

              <Button
                onClick={() => navigate('/admin/offers')}
                className="w-full justify-start bg-purple-500 text-white hover:bg-purple-600 h-auto py-4"
              >
                <TagIcon className="w-5 h-5 mr-3" strokeWidth={2} />
                <div className="text-left">
                  <p className="font-semibold">Manage Offers</p>
                  <p className="text-xs opacity-90">Monitor discount offers</p>
                </div>
              </Button>

              <Button
                onClick={() => navigate('/admin/verifications')}
                className="w-full justify-start bg-orange-500 text-white hover:bg-orange-600 h-auto py-4"
              >
                <ShieldCheckIcon className="w-5 h-5 mr-3" strokeWidth={2} />
                <div className="text-left">
                  <p className="font-semibold">Verification Requests</p>
                  <p className="text-xs opacity-90">Approve student IDs</p>
                </div>
              </Button>

              <Button
                onClick={() => navigate('/admin/analytics')}
                className="w-full justify-start bg-teal-500 text-white hover:bg-teal-600 h-auto py-4"
              >
                <TrendingUpIcon className="w-5 h-5 mr-3" strokeWidth={2} />
                <div className="text-left">
                  <p className="font-semibold">View Analytics</p>
                  <p className="text-xs opacity-90">Platform performance metrics</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Health */}
      <Card className="bg-card text-card-foreground border-border">
        <CardHeader>
          <CardTitle className="text-h3 text-card-foreground">Platform Health</CardTitle>
          <CardDescription className="text-muted-foreground">
            System status and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">User Engagement</span>
                <span className="text-sm font-semibold text-green-600">92%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Verification Rate</span>
                <span className="text-sm font-semibold text-blue-600">87%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Vendor Satisfaction</span>
                <span className="text-sm font-semibold text-purple-600">95%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '95%' }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
