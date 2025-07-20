import { CodeView } from "@/components/code-view";
import { FileBreadcrumb } from "@/components/file-breadcrumb";
import { Hint } from "@/components/hint";
import { TreeView } from "@/components/tree-view";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { convertFilesToTreeItems } from "@/lib/utils";
import { FileCollection } from "@/shared/types";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

function getLanguageFromExtension(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension || "text";
}

interface FileExplorerProps {
  files: FileCollection;
}

export const FileExplorer = ({ files }: FileExplorerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });

  const [copied, setCopied] = useState<boolean>(false);

  const treeData = useMemo(() => {
    return convertFilesToTreeItems(files);
  }, [files]);

  const handleFileSelect = useCallback(
    (filePath: string) => {
      if (files[filePath]) {
        setSelectedFile(filePath);
      }
    },
    [files]
  );

  const handleCopy = useCallback(() => {
    if (selectedFile) {
      navigator.clipboard.writeText(files[selectedFile]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [selectedFile, files]);

  return (
    <ResizablePanelGroup direction='horizontal'>
      <ResizablePanel defaultSize={30} minSize={30} className='bg-sidebar'>
        <TreeView
          data={treeData}
          value={selectedFile}
          onSelect={handleFileSelect}
        />
      </ResizablePanel>
      <ResizableHandle className='hover:bg-primary transition-colors' />
      <ResizablePanel defaultSize={70} minSize={50}>
        {selectedFile && files[selectedFile] ? (
          <div className='h-full w-full flex flex-col'>
            <div className='border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2'>
              <FileBreadcrumb path={selectedFile} />
              <Hint text='Copy to clipboard' side='bottom' align='start'>
                <Button
                  variant='outline'
                  size='icon'
                  className='ml-auto'
                  onClick={handleCopy}
                  disabled={copied}
                >
                  {copied ? <CopyCheckIcon /> : <CopyIcon />}
                </Button>
              </Hint>
            </div>
            <div className='flex-1 overflow-auto'>
              <CodeView
                code={files[selectedFile]}
                lang={getLanguageFromExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className='flex h-full items-center justify-center text-muted-foreground'>
            Select a file to view it&apos;s content
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
