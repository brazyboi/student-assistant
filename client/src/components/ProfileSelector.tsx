import type { Profile } from "../types.ts";

interface Props {
  profiles: Profile[];
  activeId: number | null;
  onSelect: (id: number) => void;
  onEdit: (profile: Profile) => void;
  onDelete: (id: number) => void;
}

export default function ProfileSelector({ profiles, activeId, onSelect, onEdit, onDelete }: Props) {
  return (
    <div>
      {profiles.map(p => (
        <div key={p.id}>
          <button onClick={() => onSelect(p.id)}>
            {p.name} ({p.role}) {activeId === p.id ? "(active)" : ""}
          </button>
          <button onClick={() => onEdit(p)}>Edit</button>
          <button onClick={() => onDelete(p.id)}>X</button>
        </div>
      ))}
    </div>
  );
}
