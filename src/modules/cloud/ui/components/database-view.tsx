"use client";

import { useQuery } from "@tanstack/react-query";
import { Database, Table as TableIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DatabaseViewProps {
  projectId: string;
}

export const DatabaseView = ({ projectId }: DatabaseViewProps) => {
  const trpc = useTRPC();
  
  const { data, isLoading } = useQuery(
    trpc.cloud.getDatabaseInfo.queryOptions({ projectId })
  );

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!data?.hasDatabase) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
        <Database className="h-12 w-12 text-muted-foreground" />
        <div>
          <h3 className="font-semibold">No Database Yet</h3>
            <p className="text-sm text-muted-foreground">
              Your app hasn&apos;t created any database tables yet.
            </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Database</h2>
        <p className="text-sm text-muted-foreground">
          Schema: <code className="px-2 py-1 bg-muted rounded text-xs">{data.schema}</code>
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Tables ({data.tables.length})</h3>
        
        {data.tables.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <TableIcon className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No tables created yet
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {data.tables.map((table: string) => (
              <Card key={table} className="cursor-pointer hover:bg-accent transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TableIcon className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">{table}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    Click to view data
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

