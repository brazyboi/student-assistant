import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback} from "@/components/ui/avatar"
import { 
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent
} from "@/components/ui/dropdown-menu";
import { User } from 'lucide-react'; 

// State
import { useActiveUser } from '@/lib/state';

// Backend
import { getSessions } from "@/api/chat";
import ProfileDialog from "./ProfileDialog";
import { supabase } from "@/lib/supabaseClient";

import type { Profile } from "../../lib/types"

export default function ProfileManager() {
  const activeUser = useActiveUser((s) => s.activeUser);
  const setActiveUser = useActiveUser((s) => s.setActiveUser);

  const handleLoginSuccess = async (profile: Profile) => {
    // const userSessions = await getSessions(); 
    // TODO: set user sessions...
    setActiveUser(profile);
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Supabase signout error: ", error)
    } else {
      console.log("User signed out.");
    }
    useActiveUser((state) => state.setActiveUser(null));
  };

  return (
    <>
      { activeUser === null ? (
        <div className="fixed top-4 right-4">
          <div className="flex">
            <ProfileDialog dialogType="login" onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              aria-label="open profile"
              className="fixed top-4 right-4 px-2 cursor-pointer"
            >
              <Avatar>
                <AvatarFallback className='bg-transparent'>
                  <User className="w-5 h-5"></User>
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className='mt-1'>
            {/* <DropdownMenuItem className="cursor-pointer">
              Settings
            </DropdownMenuItem> */}
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
