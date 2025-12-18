import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm'; 
import 'katex/dist/katex.min.css';

const MarkdownRenderer = ({ markdown }: { markdown: string }) => {
  const processedMarkdown = markdown
    .replace(/\n{3,}/g, '\n\n');
    
    return (
    <div className="
      prose prose-slate dark:prose-invert 
      max-w-none break-words
      
      prose-h1:text-3xl
      prose-h2:text-2xl
      prose-h3:text-xl 
      
      prose-p:leading-relaxed 
      prose-pre:p-0
      prose-headings:mt-4 prose-headings:mb-2
      prose-p:my-2
      prose-ul:my-2 prose-li:my-0
    ">
      <ReactMarkdown
        remarkPlugins={[[remarkMath, { singleDollarText: false }], remarkGfm]}
        rehypePlugins={[rehypeKatex]}
      >
        {processedMarkdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;