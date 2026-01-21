import { Button } from "@/components/ui/button";

export default function GetStartedButton() {
    return (
        <Button
            onClick={() => window.location.href = "/login"}
            className="bg-primary hover:bg-accent hover:cursor-pointer text-2xl text-primary-foreground font-semibold px-6 py-2 rounded-lg transition"
            size="lg"
            variant="default"
        >
            Get Started
        </Button>
    );
}
