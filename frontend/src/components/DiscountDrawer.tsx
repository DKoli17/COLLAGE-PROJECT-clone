import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { XIcon, CopyIcon, CheckIcon, TagIcon, ClockIcon, AlertCircleIcon } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useToast } from '../hooks/use-toast';

interface Discount {
  id: string;
  brand: string;
  discount: string;
  description: string;
  category: string;
  expiryDays: number;
  isExpired: boolean;
  isUsed: boolean;
  code?: string;
}

interface DiscountDrawerProps {
  discount: Discount | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DiscountDrawer({ discount, isOpen, onClose }: DiscountDrawerProps) {
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600);
  const { markDiscountAsUsed } = useAppStore();
  const { toast } = useToast();

  useEffect(() => {
    if (discount?.isUsed && discount.code) {
      setGeneratedCode(discount.code);
    } else {
      setGeneratedCode('');
    }
  }, [discount]);

  useEffect(() => {
    if (generatedCode && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [generatedCode, timeLeft]);

  if (!discount) return null;

  const handleGenerateCode = () => {
    const code = `STUDENT${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setGeneratedCode(code);
    setTimeLeft(3600);
    markDiscountAsUsed(discount.id, code);
    toast({
      title: "Code generated",
      description: "Your discount code is ready to use",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast({
      title: "Code copied",
      description: "Discount code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40"
          onClick={onClose}
        />
      )}
      <div
        className={`
          fixed right-0 top-0 h-full w-full md:w-[480px] bg-card border-l border-border z-50
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="p-8 space-y-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <TagIcon className="w-8 h-8 text-primary" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-h2 font-semibold text-card-foreground leading-heading">{discount.brand}</h2>
                <Badge className="mt-2 bg-tertiary text-tertiary-foreground">{discount.category}</Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="bg-transparent text-card-foreground hover:bg-muted hover:text-foreground"
            >
              <XIcon className="w-6 h-6" strokeWidth={2} />
            </Button>
          </div>

          <Separator />

          <div className="space-y-6">
            <div>
              <h3 className="text-h3 font-semibold text-card-foreground mb-2">Discount Details</h3>
              <p className="text-body text-muted-foreground leading-body">{discount.description}</p>
            </div>

            <div className="p-6 bg-background border border-border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-small text-muted-foreground">Discount Amount</span>
                <span className="text-2xl font-semibold text-primary">{discount.discount}</span>
              </div>
              {!discount.isExpired && (
                <div className="flex items-center gap-2 text-small text-muted-foreground">
                  <ClockIcon className="w-4 h-4" strokeWidth={2} />
                  <span>Expires in {discount.expiryDays} days</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-h3 font-semibold text-card-foreground">Eligibility</h3>
              <ul className="space-y-2 text-body text-muted-foreground leading-body">
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-success mt-0.5 flex-shrink-0" strokeWidth={2} />
                  <span>Valid student ID required</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-success mt-0.5 flex-shrink-0" strokeWidth={2} />
                  <span>One-time use per student</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-success mt-0.5 flex-shrink-0" strokeWidth={2} />
                  <span>Cannot be combined with other offers</span>
                </li>
              </ul>
            </div>

            {generatedCode ? (
              <div className="space-y-4">
                <div className="p-6 bg-success/10 border border-success/20 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-small font-semibold text-success">Your Discount Code</span>
                    <div className="flex items-center gap-2 text-small text-success">
                      <ClockIcon className="w-4 h-4" strokeWidth={2} />
                      <span>{formatTime(timeLeft)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-lg font-mono text-foreground">
                      {generatedCode}
                    </code>
                    <Button
                      onClick={handleCopy}
                      size="icon"
                      className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground flex-shrink-0"
                    >
                      {copied ? <CheckIcon className="w-5 h-5" strokeWidth={2} /> : <CopyIcon className="w-5 h-5" strokeWidth={2} />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/50 border border-border rounded-lg">
                  <AlertCircleIcon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" strokeWidth={2} />
                  <p className="text-small text-muted-foreground">
                    This code expires in 1 hour. CopyIcon it now and use it at checkout.
                  </p>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleGenerateCode}
                disabled={discount.isExpired}
                className="w-full bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
              >
                Generate Discount Code
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

