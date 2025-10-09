import React from "react";
import type { QueryMode } from "../lib/types";

interface PromptSuggestionsProps {
  prompts: string[];
  onSelect: (mode: QueryMode, hintIndex: number) => void;
}

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ prompts, onSelect }) => {
  return (
    <div className="flex flex-wrap mt-auto gap-2 p-4 justify-end bottom-0">
      <button
        key={0}
        className="px-3 py-2 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-600"
        onClick={() => onSelect({ mode: 'hint' }, 1)}
      >
        Hint
      </button>
      <button
        key={1}
        className="px-3 py-2 rounded-lg bg-gray-700 text-white text-sm hover:bg-gray-600"
        onClick={() => onSelect({ mode: 'answer' }, 1)}
      >
        Solution
      </button>
    </div>
  );
};

export default PromptSuggestions;
