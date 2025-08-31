import { useState, useEffect } from "react";
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";
import type { Message } from "./components/ChatWindow";
import PromptSuggestions from "./components/PromptSuggestions";
import { sendMessage } from "./api/chat";

import ProfileSelector from "./components/ProfileSelector";
import ProfileManager from "./components/ProfileManager";
import type { Profile } from "./types";

export default function App() {
  const prompts = [
    "Create a study plan for me",
    "Summarize this text",
    "Explain this concept simply",
  ];

  const [messages, setMessages] = useState<Message[]>([]);

  // Profile state
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<number | null>(null);
  const [editing, setEditing] = useState<Profile | null>(null);

  // Load/save profiles from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("profiles");
    if (saved) setProfiles(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("profiles", JSON.stringify(profiles));
  }, [profiles]);

  // Profile CRUD helpers
  const addProfile = (profile: Profile) => setProfiles([...profiles, profile]);
  const updateProfile = (id: number, updated: Profile) =>
    setProfiles(profiles.map(p => (p.id === id ? updated : p)));
  const deleteProfile = (id: number) =>
    setProfiles(profiles.filter(p => p.id !== id));

  async function handleSend(userText: string) {
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);

    const reply = await sendMessage(userText);
    setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 p-4 border-r border-gray-300 flex flex-col space-y-4">
        <h3 className="font-bold">Profiles</h3>
        <ProfileSelector
          profiles={profiles}
          activeId={activeProfile}
          onSelect={setActiveProfile}
          onEdit={setEditing}
          onDelete={deleteProfile}
        />

        <h3 className="font-bold">{editing ? "Edit Profile" : "New Profile"}</h3>
        <ProfileManager
          profile={editing || undefined}
          onSave={(p) => {
            if (editing) updateProfile(p.id, p);
            else addProfile(p);
            setEditing(null);
          }}
        />
      </aside>
      <main className="flex flex-col h-full w-full">
        <ChatWindow messages={messages} />
        <PromptSuggestions prompts={prompts} onSelect={handleSend} />
        <ChatInput onSend={handleSend} />
      </main>
    </div>
  );
}