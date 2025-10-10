import { 
  Card  
} from '@/components/ui/card';
import { cn } from "@/lib/utils";
import MarkdownRenderer from "@/lib/Markdown";


type MessageProps = {
    text: string;
    sender: "user" | "ai";
};

// function fixAIMath(text: string) {
//   // Replace single-line [ ... ] with $$ ... $$
//   return text.replace(/\[\s*([^\]]+)\s*\]/g, (_, expr) => `$$${expr}$$`);
// }

// function fixAIMath(text: string) {
//   // 1. Replace AI's custom Block Delimiter [ ... ] with native LaTeX \[ ... \]
//   // Note: We use double backslashes in the replacement string to output a literal backslash in the final string.
//   let fixedText = text.replace(/\[\s*([^\]]+)\s*\]/g, (_, expr) => `\\[${expr}\\]`);

//   // 2. Replace AI's custom Inline Delimiter ( ... ) with native LaTeX \( ... \)
//   // We avoid replacing escaped parentheses like \(. This is the tricky part.
//   // This non-greedy regex looks for ( ... ) that isn't preceded by a backslash.
//   fixedText = fixedText.replace(/(?<!\\)\((.*?)\)(?!\\)/g, (_, expr) => `\\(${expr}\\)`);
  
//   // Note: If you only want to support the simple ( ... ) replacement, use this simpler version:
//   // fixedText = fixedText.replace(/\((.*?)\)/g, (_, expr) => `\\(${expr}\\)`);

//   return fixedText;
// }

function fixAIMath(text: string) {
    // 1. Double-escape all single backslashes in the content (e.g., \int -> \\int)
    // This ensures all LaTeX commands are preserved.
    let escapedContent = text.replace(/\\/g, '\\\\');

    // 2. Convert all parentheses ( ... ) to the correct LaTeX inline delimiter \( ... \)
    // The replacement string uses \\\ to generate a literal \\ in the output string,
    // which is the proper LaTeX inline delimiter when parsed by ReactMarkdown.
    // The content inside the group 1 will already be double-escaped from step 1.
    escapedContent = escapedContent.replace(/\((.*?)\)/g, (match, expr) => 
        `\\\(${expr.trim()}\\\)`
    );

    // 3. (Optional) Convert all single-line [ ... ] to block math \[ ... \]
    // We target the [ ... ] that are now inside the double-escaped content.
    escapedContent = escapedContent.replace(/\\\[\s*([^\]]+)\s*\\\]/g, (_, expr) => 
        `\\\\[${expr}\\\\]` // Note the four backslashes to get the block math delimiter: \\[
    );

    // NOTE: Block math ($$ ... $$) and code blocks (```) should be handled by the markdown parser
    // and usually don't need this regex modification unless they are malformed.

    return escapedContent;
}

export default function ChatMessage({text, sender} : MessageProps) {
    const isUser = sender === "user";
    const formatted = fixAIMath(text);

    return (
      <MarkdownRenderer markdown={formatted} />
      
    // <div
    //   className={`flex ${isUser ? "justify-end" : "justify-start"} my-2 mx-2`}
    // >
    //   <MarkdownRenderer markdown={fixAIMath(text)} />
    //   {/* <Card
    //     className={cn(
    //       "max-w-lg px-4 py-2 rounded-xl border-2 border-secondary",
    //       sender === "user"
    //         ? "bg-secondary/50"
    //         : ""
    //     )}
    //   > 
    //     <MarkdownRenderer markdown={fixAIMath(text)} />
    //   </Card> */}
    // </div>
  );
}; 

