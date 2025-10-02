import { Button } from "@/components/ui/button"

type ProblemHelpButtonProps = {
    type: 'hint' | 'answer' | 'explanation';
    onClick: () => void;
};

export function ProblemHelpButton({ type, onClick }: ProblemHelpButtonProps) {
    let label = "";
    let buttonColor: "primary" | "secondary" | "success" = "primary";
    if (type === "hint") {
        label = "Get Hint";
        buttonColor = "primary";
    } else if (type === "answer") {
        label = "Reveal Answer";
        buttonColor = "secondary"
    } else if (type === "explanation") {
        label = "Show Explanation";
        buttonColor = "success";
    }

    return (
        <Button
            onClick={onClick}
            color={buttonColor}
            size="sm"
        >
            {label}
        </Button>
    );
}

// Example usage with all three buttons in a row:
export default function ProblemHelpButtonGroup({
    onHint,
    onAnswer,
    onExplanation,
}: {
    onHint: () => void;
    onAnswer: () => void;
    onExplanation: () => void;
}) {
    return (
        <div className="flex flex-row gap-2">
            <ProblemHelpButton type="hint" onClick={onHint} />
            <ProblemHelpButton type="answer" onClick={onAnswer} />
            <ProblemHelpButton type="explanation" onClick={onExplanation} />
        </div>
    );
}