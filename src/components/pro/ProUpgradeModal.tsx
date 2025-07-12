
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface ProUpgradeModalProps {
  open: boolean;
  onClose: () => void;
  feature?: string;
}

const ProUpgradeModal = ({ open, onClose, feature }: ProUpgradeModalProps) => {
  const { createCheckout } = useSubscription();

  const handleUpgrade = async () => {
    await createCheckout();
    onClose();
  };

  const proFeatures = [
    "Unlimited forms",
    "Multi-step forms",
    "Form analytics & insights",
    "Export submissions as PDF",
    "Priority support",
    "Advanced form customization"
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2 mb-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            <DialogTitle className="text-2xl">Upgrade to Pro</DialogTitle>
          </div>
          <DialogDescription>
            {feature ? `${feature} is a Pro feature. ` : ''}
            Unlock all premium features and take your forms to the next level.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">Pro Plan</h3>
              <Badge variant="default" className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Zap className="w-3 h-3 mr-1" />
                Popular
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-1">$9.99<span className="text-sm font-normal">/month</span></div>
            <p className="text-sm text-gray-600">Everything you need for professional forms</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">What you'll get:</h4>
            {proFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Maybe Later
            </Button>
            <Button onClick={handleUpgrade} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProUpgradeModal;
