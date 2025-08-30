import React from "react";

interface PromptSuggestionsProps {
  prompts: string[];
  onSelect: (prompt: string) => void;
}

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ prompts, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 p-4 justify-end bottom-0">
      {prompts.map((prompt, idx) => (
        <button
          key={idx}
          className="px-3 py-2 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-600"
          onClick={() => onSelect(prompt)}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};

export default PromptSuggestions;
