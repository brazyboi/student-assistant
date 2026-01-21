import { Button } from '@/components/ui/button';
import { Lightbulb, AlertCircle } from 'lucide-react';
import type { HintLevel } from '@/lib/types';

interface HintButtonsProps {
  onGetHint: () => void;
  onImStuck: () => void;
  currentHintLevel: HintLevel;
  studentHasAttempted: boolean;
  loading: boolean;
}

export default function HintButtons({
  onGetHint,
  onImStuck,
  currentHintLevel,
  studentHasAttempted,
  loading
}: HintButtonsProps) {
  const canGetHint = studentHasAttempted && currentHintLevel !== "solution";
  const canImStuck = studentHasAttempted;

  return (
    <div className="flex gap-2 mt-4">
      <Button
        onClick={onGetHint}
        disabled={!canGetHint || loading}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Lightbulb className="w-4 h-4" />
        Get Hint
        {currentHintLevel !== "none" && currentHintLevel !== "solution" && (
          <span className="text-xs text-muted-foreground ml-1">
            ({currentHintLevel})
          </span>
        )}
      </Button>

      <Button
        onClick={onImStuck}
        disabled={!canImStuck || loading || currentHintLevel === "solution"}
        variant="default"
        className="flex items-center gap-2"
      >
        <AlertCircle className="w-4 h-4" />
        I'm Stuck
      </Button>

      {!studentHasAttempted && (
        <p className="text-xs text-muted-foreground self-center ml-2">
          Write an attempt first to unlock hints
        </p>
      )}
    </div>
  );
}
