import { 
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import MarkdownRenderer from "@/lib/Markdown";

interface StickyProblemProps {
    problem: string;
};

export default function StickyProblem({ problem } : StickyProblemProps) {
    return (
        <div className="sticky top-0 z-10 my-4 overflow-hidden border-b-3 border-secondary">
            <Accordion type="single" collapsible defaultValue='firstMessage'>
                <AccordionItem value="firstMessage">
                    <AccordionTrigger className='text-3xl'>Task</AccordionTrigger>
                    <AccordionContent className='border-t-2 pt-3 border-secondary'>
                        <MarkdownRenderer markdown={problem} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}