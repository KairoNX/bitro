import { useState } from "react";
import { ExternalLinkIcon, RefreshCcwIcon, RocketIcon } from "lucide-react";

import { Hint } from "@/components/hint";
import { Fragment } from "@/generated/prisma";
import { Button } from "@/components/ui/button";

interface Props {
  data: Fragment;
};

export function FragmentWeb({ data }: Props) {
  const [copied, setCopied] = useState(false);
  const [fragmentKey, setFragmentKey] = useState(0);

  const onRefresh = () => {
    setFragmentKey((prev) => prev + 1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const urlToDisplay = data.productionUrl || data.sandboxUrl;

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text="Refresh" side="bottom" align="start">
          <Button size="sm" variant="outline" onClick={onRefresh}>
            <RefreshCcwIcon />
          </Button>
        </Hint>
        <Hint text={data.productionUrl ? "Production URL" : "Sandbox URL (30 min)"} side="bottom">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleCopy}
            disabled={!urlToDisplay || copied}
            className="flex-1 justify-start text-start font-normal"
          >
            <span className="truncate">
              {urlToDisplay}
            </span>
          </Button>
        </Hint>
        {!data.productionUrl && (
          <Hint text="Deploy to production" side="bottom">
            <Button
              size="sm"
              variant="default"
              className="bg-primary"
            >
              <RocketIcon className="h-4 w-4" />
            </Button>
          </Hint>
        )}
        <Hint text="Open in a new tab" side="bottom" align="start">
          <Button
            size="sm"
            disabled={!urlToDisplay}
            variant="outline"
            onClick={() => {
              if (!urlToDisplay) return;
              window.open(urlToDisplay, "_blank");
            }}
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>
      <iframe
        key={fragmentKey}
        className="h-full w-full"
        sandbox="allow-forms allow-scripts allow-same-origin"
        loading="lazy"
        src={data.sandboxUrl}
      />
    </div>
  )
};