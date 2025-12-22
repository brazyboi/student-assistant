import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm'; 
import 'katex/dist/katex.min.css';

const MarkdownRenderer = ({ markdown }: { markdown: string }) => {
  const processedMarkdown = markdown
    .replace(/\\\[/g, '$$$')  // Replace \[ with $$
    .replace(/\\\]/g, '$$$'); // Replace \] with $$

  return (
    <div className="markdown-content text-left">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
            h3: ({node, ...props}) => <h3 className="mt-4 mb-2 font-bold text-2xl" {...props} />
        }}
      >
        {processedMarkdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;