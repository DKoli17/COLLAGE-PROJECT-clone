import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { SettingsIcon, SaveIcon, MailIcon, ShieldIcon, DatabaseIcon, BellIcon, GlobeIcon } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

export function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Student Deals',
    siteDescription: 'Exclusive discounts for verified students',
    contactEmail: 'admin@studentdeals.com',
    supportEmail: 'support@studentdeals.com',

    // Security Settings
    sessionTimeout: 24, // hours
    passwordMinLength: 8,
    twoFactorRequired: false,
    ipWhitelist: '',

    // Email Settings
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    emailFrom: 'noreply@studentdeals.com',

    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    vendorApprovalNotifications: true,
    studentVerificationNotifications: true,

    // Platform Settings
    maintenanceMode: false,
    registrationEnabled: true,
    vendorRegistrationEnabled: true,
    maxOffersPerVendor: 50,
    defaultOfferExpiry: 30, // days

    // API Settings
    apiRateLimit: 1000,
    apiKeyExpiration: 365, // days
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure platform settings and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <GlobeIcon className="w-5 h-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-h3 text-card-foreground">General Settings</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Basic platform configuration
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => updateSetting('siteName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => updateSetting('contactEmail', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => updateSetting('siteDescription', e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => updateSetting('supportEmail', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <ShieldIcon className="w-5 h-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-h3 text-card-foreground">Security Settings</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Platform security and access controls
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => updateSetting('passwordMinLength', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxOffersPerVendor">Max Offers per Vendor</Label>
                <Input
                  id="maxOffersPerVendor"
                  type="number"
                  value={settings.maxOffersPerVendor}
                  onChange={(e) => updateSetting('maxOffersPerVendor', parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication Required</Label>
                <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
              </div>
              <Switch
                checked={settings.twoFactorRequired}
                onCheckedChange={(checked) => updateSetting('twoFactorRequired', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <MailIcon className="w-5 h-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-h3 text-card-foreground">Email Settings</CardTitle>
                <CardDescription className="text-muted-foreground">
                  SMTP configuration for email notifications
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={settings.smtpHost}
                  onChange={(e) => updateSetting('smtpHost', e.target.value)}
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  value={settings.smtpPort}
                  onChange={(e) => updateSetting('smtpPort', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input
                  id="smtpUser"
                  value={settings.smtpUser}
                  onChange={(e) => updateSetting('smtpUser', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailFrom">From Email</Label>
                <Input
                  id="emailFrom"
                  type="email"
                  value={settings.emailFrom}
                  onChange={(e) => updateSetting('emailFrom', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPassword">SMTP Password</Label>
              <Input
                id="smtpPassword"
                type="password"
                value={settings.smtpPassword}
                onChange={(e) => updateSetting('smtpPassword', e.target.value)}
                placeholder="Enter SMTP password"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <BellIcon className="w-5 h-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-h3 text-card-foreground">Notification Settings</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Configure notification preferences
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send email notifications for important events</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Send push notifications to admin devices</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Vendor Approval Notifications</Label>
                <p className="text-sm text-muted-foreground">Notify when vendors submit applications</p>
              </div>
              <Switch
                checked={settings.vendorApprovalNotifications}
                onCheckedChange={(checked) => updateSetting('vendorApprovalNotifications', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Student Verification Notifications</Label>
                <p className="text-sm text-muted-foreground">Notify when students submit verification requests</p>
              </div>
              <Switch
                checked={settings.studentVerificationNotifications}
                onCheckedChange={(checked) => updateSetting('studentVerificationNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Platform Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <DatabaseIcon className="w-5 h-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-h3 text-card-foreground">Platform Settings</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Platform availability and limits
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultOfferExpiry">Default Offer Expiry (days)</Label>
                <Input
                  id="defaultOfferExpiry"
                  type="number"
                  value={settings.defaultOfferExpiry}
                  onChange={(e) => updateSetting('defaultOfferExpiry', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiRateLimit">API Rate Limit (requests/hour)</Label>
                <Input
                  id="apiRateLimit"
                  type="number"
                  value={settings.apiRateLimit}
                  onChange={(e) => updateSetting('apiRateLimit', parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Put the platform in maintenance mode</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Student Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new student registrations</p>
              </div>
              <Switch
                checked={settings.registrationEnabled}
                onCheckedChange={(checked) => updateSetting('registrationEnabled', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Vendor Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new vendor registrations</p>
              </div>
              <Switch
                checked={settings.vendorRegistrationEnabled}
                onCheckedChange={(checked) => updateSetting('vendorRegistrationEnabled', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading} className="min-w-32">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <SaveIcon className="w-4 h-4" />
                Save Settings
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
