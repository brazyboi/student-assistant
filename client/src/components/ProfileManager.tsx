import { useState, useEffect } from "react";
import type { Profile } from "../types.ts";

interface Props {
  profile?: Profile;
  onSave: (profile: Profile) => void;
}

export default function ProfileManager({ profile, onSave }: Props) {
  const [name, setName] = useState(profile?.name || "");

  useEffect(() => {
    if (profile) {
      setName(profile.name);
    }
  }, [profile]);

  const handleSave = () => {
    setName("");
  };

  return (
    <div>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <button onClick={handleSave}>{profile ? "Update" : "Save"}</button>
    </div>
  );
}
