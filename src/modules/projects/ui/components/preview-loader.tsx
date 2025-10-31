import { Code2, Sparkles } from "lucide-react";

export const PreviewLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-background to-muted/50">
      <div className="relative">
        {/* Animated sparkles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="h-16 w-16 text-primary/20 animate-pulse" />
        </div>
        {/* Center icon */}
        <div className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20">
          <Code2 className="h-12 w-12 text-primary animate-pulse" />
        </div>
      </div>
      
      {/* Loading text */}
      <div className="mt-8 space-y-2 text-center">
        <h3 className="text-lg font-semibold animate-pulse">
          Building your app...
        </h3>
        <p className="text-sm text-muted-foreground">
          Setting up backend infrastructure
        </p>
      </div>

      {/* Progress indicators */}
      <div className="mt-8 space-y-2 w-64">
        <div className="flex items-center gap-2 text-sm">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-muted-foreground">Creating database schemas</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="h-2 w-2 rounded-full bg-primary/50 animate-pulse delay-75" />
          <span className="text-muted-foreground">Generating API routes</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="h-2 w-2 rounded-full bg-primary/30 animate-pulse delay-150" />
          <span className="text-muted-foreground">Building components</span>
        </div>
      </div>

      {/* Animated dots */}
      <div className="mt-8 flex gap-2">
        <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
        <div className="h-2 w-2 rounded-full bg-primary animate-bounce delay-75" />
        <div className="h-2 w-2 rounded-full bg-primary animate-bounce delay-150" />
      </div>
    </div>
  );
};

