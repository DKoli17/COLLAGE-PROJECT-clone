import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Mock data for analytics
const overviewData = [
  { name: 'Total Users', value: 1250, change: '+12%', trend: 'up' },
  { name: 'Active Discounts', value: 89, change: '+5%', trend: 'up' },
  { name: 'Total Views', value: 15420, change: '+18%', trend: 'up' },
  { name: 'Revenue', value: 12500, change: '+8%', trend: 'up' },
];

const growthData = [
  { month: 'Jan', users: 400, discounts: 24, revenue: 2400 },
  { month: 'Feb', users: 450, discounts: 28, revenue: 2800 },
  { month: 'Mar', users: 520, discounts: 32, revenue: 3200 },
  { month: 'Apr', users: 600, discounts: 38, revenue: 3800 },
  { month: 'May', users: 680, discounts: 45, revenue: 4500 },
  { month: 'Jun', users: 750, discounts: 52, revenue: 5200 },
];

const categoryData = [
  { name: 'Electronics', value: 35, color: '#8884d8' },
  { name: 'Fashion', value: 25, color: '#82ca9d' },
  { name: 'Food', value: 20, color: '#ffc658' },
  { name: 'Education', value: 12, color: '#ff7c7c' },
  { name: 'Other', value: 8, color: '#8dd1e1' },
];

const monthlyTrends = [
  { month: 'Jan', students: 320, vendors: 45, verifications: 28 },
  { month: 'Feb', students: 380, vendors: 52, verifications: 35 },
  { month: 'Mar', students: 420, vendors: 58, verifications: 42 },
  { month: 'Apr', students: 480, vendors: 65, verifications: 48 },
  { month: 'May', students: 550, vendors: 72, verifications: 55 },
  { month: 'Jun', students: 620, vendors: 78, verifications: 62 },
];

const AdminAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6months');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor your platform's performance and growth</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewData.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
              <Badge variant={item.trend === 'up' ? 'default' : 'secondary'}>
                {item.change}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="growth" className="space-y-4">
        <TabsList>
          <TabsTrigger value="growth">Growth Trends</TabsTrigger>
          <TabsTrigger value="categories">Top Categories</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Over Time</CardTitle>
              <CardDescription>Platform growth metrics over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="discounts" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="revenue" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Discount Categories</CardTitle>
                <CardDescription>Distribution of discounts by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Usage statistics by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={category.value} className="w-20" />
                      <span className="text-sm text-muted-foreground">{category.value}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly User Trends</CardTitle>
              <CardDescription>User registration and verification trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" fill="#8884d8" />
                  <Bar dataKey="vendors" fill="#82ca9d" />
                  <Bar dataKey="verifications" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { AdminAnalytics };
