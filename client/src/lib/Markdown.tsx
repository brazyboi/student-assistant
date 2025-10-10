import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const MarkdownRenderer = ({ markdown }: {markdown: string}) => {
  return (
    <ReactMarkdown
      // Pass an array to the plugin to include configuration options
      remarkPlugins={[[remarkMath, { singleDollarText: false }]]}
      rehypePlugins={[rehypeKatex]}
    >
      {markdown}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;