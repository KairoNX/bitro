import Image from "next/image";
import { useState, useEffect } from "react";

const ShimmerMessages = () => {
  const messages = [
    "Thinking...",
    "Analyzing your request...",
    "Setting up backend...",
    "Creating database tables...",
    "Building components...",
    "Connecting API routes...",
    "Adding database schemas...",
    "Implementing features...",
    "Optimizing performance...",
    "Adding final touches...",
    "Almost ready...",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-base text-muted-foreground animate-pulse">
        {messages[currentMessageIndex]}
      </span>
    </div>
  );
};

export const MessageLoading = () => {
  return (
    <div className="flex flex-col group px-2 pb-4">
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src="/logo.svg"
          alt="Vibe"
          width={18}
          height={18}
          className="shrink-0 animate-pulse"
        />
        <span className="text-sm font-medium">Vibe</span>
      </div>
      <div className="pl-8.5 flex flex-col gap-y-4">
        <ShimmerMessages />
        {/* Code generation animation */}
        <div className="space-y-1 mt-2 opacity-60">
          <div className="h-2 bg-primary/20 rounded animate-pulse" style={{ width: '90%' }} />
          <div className="h-2 bg-primary/20 rounded animate-pulse" style={{ width: '75%' }} />
          <div className="h-2 bg-primary/20 rounded animate-pulse" style={{ width: '85%' }} />
        </div>
      </div>
    </div>
  );
};
