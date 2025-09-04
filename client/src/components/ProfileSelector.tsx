import { useState, useRef, useEffect } from "react";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="absolute top-4 right-4" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full bg-gray-100 hover:bg-gray-200 p-1 shadow"
      >
        <img
          src="../assets/react.svg"
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
      </button>

      {/* Dropdown Overlay */}
      {open && (
        <div className="absolute right-0 mt-2 w-32 rounded-xl p-2 bg-gray-900 shadow-lg z-50">
          <ul className="flex flex-col text-sm">
            <li>
              <button className="w-full rounded-xl text-left px-4 py-2 hover:bg-gray-500">
                Profile
              </button>
            </li>
            <li>
              <button className="w-full rounded-xl text-left px-4 py-2 hover:bg-gray-500">
                Settings
              </button>
            </li>
            <li>
              <button className="w-full rounded-xl text-left px-4 py-2 text-red-500 hover:bg-gray-500">
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
