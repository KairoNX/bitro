"use client";

import { Database, Zap, TrendingUp, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CloudOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onEnable: () => void;
}

export const CloudOnboarding = ({
  isOpen,
  onClose,
  onEnable,
}: CloudOnboardingProps) => {
  const handleEnable = () => {
    onEnable();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-3xl">Bitro Cloud</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            Complete backend infrastructure out of the box, so you can focus on building your app.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Feature 1 */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Database className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Built-in Database</h3>
              <p className="text-sm text-muted-foreground">
                PostgreSQL database, tables, and schemas—all ready to use. Full CRUD operations with zero configuration.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Zap className="h-6 w-6 text-purple-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Instant Backend</h3>
              <p className="text-sm text-muted-foreground">
                AI creates API routes, connects to databases, and handles server logic—all automatically.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Free to Start</h3>
              <p className="text-sm text-muted-foreground">
                Free database schemas for all projects. Scale as you grow. Track usage in Settings.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleEnable} className="flex-1" size="lg">
            Enable Cloud
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Cloud features are automatically enabled for all projects
        </p>
      </DialogContent>
    </Dialog>
  );
};

