"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Key, Plus, Eye, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

interface EnvironmentVarsProps {
  projectId: string;
}

export const EnvironmentVars = ({ projectId }: EnvironmentVarsProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [isSecret, setIsSecret] = useState(false);

  const { data: envVars, isLoading } = useQuery(
    trpc.cloud.getEnvironmentVariables.queryOptions({ projectId })
  );

  const handleToggleVisibility = (key: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!newKey || !newValue) {
      toast.error("Both key and value are required");
      return;
    }

    // TODO: Implement addEnvVar mutation
    toast.success("Environment variable added");
    setIsDialogOpen(false);
    setNewKey("");
    setNewValue("");
    setIsSecret(false);
    
    await queryClient.invalidateQueries(
      trpc.cloud.getEnvironmentVariables.queryOptions({ projectId })
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Environment Variables</h2>
          <p className="text-sm text-muted-foreground">
            Manage secure API keys and configuration
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Variable
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Environment Variable</DialogTitle>
              <DialogDescription>
                Store API keys and sensitive configuration securely
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="key">Key</Label>
                <Input
                  id="key"
                  placeholder="STRIPE_API_KEY"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <div className="relative">
                  <Input
                    id="value"
                    type={visibleKeys.has("new") ? "text" : "password"}
                    placeholder="Enter your API key"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => handleToggleVisibility("new")}
                  >
                    {visibleKeys.has("new") ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="secret"
                  checked={isSecret}
                  onChange={(e) => setIsSecret(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="secret" className="text-sm">
                  Mark as secret (encrypted)
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {envVars && envVars.length > 0 ? (
        <div className="space-y-3">
          {envVars.map((env) => (
            <Card key={env.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">{env.key}</div>
                    {env.isSecret ? (
                      <div className="text-sm text-muted-foreground">
                        ••••••••••••••••
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Click to view
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleVisibility(env.key)}
                  >
                    {visibleKeys.has(env.key) ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <Key className="h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="font-semibold">No Environment Variables</h3>
              <p className="text-sm text-muted-foreground">
                Add API keys and configuration variables for your app
              </p>
            </div>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Variable
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

