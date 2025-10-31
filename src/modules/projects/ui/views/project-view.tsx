"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Suspense, useState } from "react";
import { EyeIcon, CodeIcon, CrownIcon, CloudIcon } from "lucide-react";

import { Fragment } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { UserControl } from "@/components/user-control";
import { FileExplorer } from "@/components/file-explorer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { FragmentWeb } from "../components/fragment-web";
import { ProjectHeader } from "../components/project-header";
import { MessagesContainer } from "../components/messages-container";
import { CloudSidebar } from "@/modules/cloud/ui/components/cloud-sidebar";
import { DatabaseView } from "@/modules/cloud/ui/components/database-view";
import { EnvironmentVars } from "@/modules/cloud/ui/components/environment-vars";
import { PreviewLoader } from "../components/preview-loader";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  projectId: string;
};

export const ProjectView = ({ projectId }: Props) => {
  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });

  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code" | "cloud">("preview");
  const [cloudView, setCloudView] = useState<"overview" | "database" | "secrets" | "logs">("database");

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <ErrorBoundary fallback={<p>Project header error</p>}>
            <Suspense fallback={<p>Loading project...</p>}>
              <ProjectHeader projectId={projectId} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary fallback={<p>Messages container error</p>}>
            <Suspense fallback={<p>Loading messages...</p>}>
              <MessagesContainer
                projectId={projectId}
                activeFragment={activeFragment}
                setActiveFragment={setActiveFragment}
              />
            </Suspense>
          </ErrorBoundary>
        </ResizablePanel>
        <ResizableHandle className="hover:bg-primary transition-colors" />
        <ResizablePanel
          defaultSize={65}
          minSize={50}
        >
          <Tabs
            className="h-full gap-y-0"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code" | "cloud")}
          >
            <div className="w-full flex items-center p-2 border-b gap-x-2">
              <TabsList className="h-8 p-0 border rounded-md">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon /> <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon /> <span>Code</span>
                </TabsTrigger>
                <TabsTrigger value="cloud" className="rounded-md">
                  <CloudIcon /> <span>Cloud</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                {!hasProAccess && (
                  <Button asChild size="sm" variant="tertiary">
                    <Link href="/pricing">
                      <CrownIcon /> Upgrade
                    </Link>
                  </Button>
                )}
                <UserControl />
              </div>
            </div>
            <TabsContent value="preview">
              {!!activeFragment ? (
                <FragmentWeb data={activeFragment} />
              ) : (
                <PreviewLoader />
              )}
            </TabsContent>
            <TabsContent value="code" className="min-h-0">
              {!!activeFragment?.files && (
                <FileExplorer
                  files={activeFragment.files as { [path: string]: string }}
                />
              )}
            </TabsContent>
            <TabsContent value="cloud" className="min-h-0">
              <div className="flex h-full">
                <CloudSidebar 
                  projectId={projectId}
                  activeView={cloudView}
                  onViewChange={setCloudView}
                />
                <div className="flex-1 overflow-auto">
                  {cloudView === "database" && <DatabaseView projectId={projectId} />}
                  {cloudView === "secrets" && <EnvironmentVars projectId={projectId} />}
                  {cloudView === "overview" && (
                    <div className="p-6">
                      <h2 className="text-2xl font-bold">Overview</h2>
                      <p className="text-muted-foreground">Cloud infrastructure overview coming soon</p>
                    </div>
                  )}
                  {cloudView === "logs" && (
                    <div className="p-6">
                      <h2 className="text-2xl font-bold">Logs</h2>
                      <p className="text-muted-foreground">Application logs coming soon</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
