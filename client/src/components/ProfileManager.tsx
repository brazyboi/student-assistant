import { useState, useEffect } from "react";
import type { Profile } from "../types.ts";

interface Props {
  profile?: Profile;
  onSave: (profile: Profile) => void;
}

export default function ProfileManager({ profile, onSave }: Props) {
  const [name, setName] = useState(profile?.name || "");
  const [level, setLevel] = useState<Profile["level"]>(profile?.level || "undergrad");
  const [role, setRole] = useState<Profile["role"]>(profile?.role || "general");

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setLevel(profile.level);
      setRole(profile.role);
    }
  }, [profile]);

  const handleSave = () => {
    onSave({
      id: profile?.id ?? Date.now(),
      name,
      level,
      role,
    });
    setName("");
    setLevel("undergrad");
    setRole("general");
  };

  return (
    <div>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <select value={level} onChange={e => setLevel(e.target.value as Profile["level"])}>
        <option value="highschool">High School</option>
        <option value="undergrad">Undergrad</option>
        <option value="grad">Grad</option>
      </select>
      <select value={role} onChange={e => setRole(e.target.value as Profile["role"])}>
        <option value="general">General</option>
        <option value="python_expert">Python Expert</option>
        <option value="math_tutor">Math Tutor</option>
        <option value="writing_coach">Writing Coach</option>
      </select>
      <button onClick={handleSave}>{profile ? "Update" : "Save"}</button>
    </div>
  );
}
