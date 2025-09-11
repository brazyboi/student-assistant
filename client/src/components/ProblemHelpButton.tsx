type ProblemHelpButtonProps = {
    type: 'hint' | 'solution';
    onClick: () => void;
}

export default function ProblemHelpButton({type, onClick}: ProblemHelpButtonProps) {
    return (
        <button onClick={onClick} className="px-4 py-2 bg-green-700 text-white rounded-3xl hover:bg-green-700">
            {type === 'hint' ? 'Get Hint' : 'Reveal Solution'} 
        </button>
    );
}