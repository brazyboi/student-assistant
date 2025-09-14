import { Button, Stack } from "@mui/material";

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
            variant="contained"
            color={buttonColor}
            size="small"
            sx={{
                borderRadius: '24px',
                minWidth: 0,
                px: 2,
                py: 0.5,
                fontSize: "0.95rem",
                textTransform: "none"
            }}
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
        <Stack direction="row" spacing={1}>
            <ProblemHelpButton type="hint" onClick={onHint} />
            <ProblemHelpButton type="answer" onClick={onAnswer} />
            <ProblemHelpButton type="explanation" onClick={onExplanation} />
        </Stack>
    );
}