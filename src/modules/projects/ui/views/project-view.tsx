"use client";

import { FileExplorer } from "@/components/file-explorer";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Fragment } from "@/generated/prisma";
import { FragmentWeb } from "@/modules/projects/ui/components/fragment-web";
import { MessagesContainer } from "@/modules/projects/ui/components/messages-container";
import { ProjectHeader } from "@/modules/projects/ui/components/project-header";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { FileCollection } from "@/shared/types";

interface Props {
  projectId: string;
}

export enum TabState {
  PREVIEW = "preview",
  CODE = "code",
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<TabState>(TabState.PREVIEW);

  return (
    <div className='h-screen'>
      <ResizablePanelGroup direction='horizontal'>
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className='flex flex-col min-h-0'
        >
          <Suspense fallback={<div>Loading project...</div>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>
          <Suspense fallback={<div>Loading message...</div>}>
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            className='h-full gap-y-0'
            defaultValue={TabState.PREVIEW}
            value={tabState}
            onValueChange={(value) => setTabState(value as TabState)}
          >
            <div className='w-full flex items-center p-2 border-b gap-x-2'>
              <TabsList className='h-8 p-0 border rounded-md'>
                <TabsTrigger value={TabState.PREVIEW}>
                  <EyeIcon /> <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value={TabState.CODE}>
                  <CodeIcon /> <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className='ml-auto flex items-center gap-x-2'>
                <Button variant='tertiary' size='sm' asChild>
                  <Link href='pricing'>
                    <CrownIcon /> Upgrade
                  </Link>
                </Button>
              </div>
            </div>
            <TabsContent value={TabState.PREVIEW}>
              {activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>
            <TabsContent value={TabState.CODE} className='min-h-0'>
              {activeFragment?.files && (
                <FileExplorer files={activeFragment.files as FileCollection} />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
