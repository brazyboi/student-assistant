import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from '@iconify/react';

// import { Github, Google } from "lucide-react";

import { 
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';


// import { createProfile, loginProfile } from "../api/profiles";
import { supabase } from "../api/supabaseClient";
import type { Profile } from "../types";

interface ProfileDialogProps {
  dialogType: 'create' | 'login';
  onLoginSuccess: (profile: Profile) => void;
};

const dialogTitleMap = {
  'create': 'Create Account',
  'login': 'Log In',
}

export default function ProfileDialog( {dialogType, onLoginSuccess}: ProfileDialogProps ) {
  // const [email, setEmail] = React.useState("");
  // const [password, setPassword] = React.useState("");

  const handleSignInGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin, // after login, redirect here
        },
      });

      if (error) {
        console.error('Google sign-in error...');
      }  
    } catch (err) {
      console.log("Google OAuth error...");
    }
  };

  React.useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        onLoginSuccess({
          id: data.user.id,
          email: data.user.email,
        } as Profile);
      } else if (error) {
        console.log('No user found:', error.message);
      }
    };

    checkSession();
  }, []);

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   try {
  //     let data: any = null;
  //     let error: any = null;

  //     if (dialogType == 'create') {
  //       ({ data, error } = await supabase.auth.signUp({ email, password }));
  //     } else if (dialogType == 'login') {
  //       ({ data, error } = await supabase.auth.signInWithPassword({ email, password }));
  //     }

  //     if (error) {
  //       console.error("Supabase auth error:", error.message)
  //       return;
  //     }
  //     console.log("Profile signup/signin data", data);

  //     if (data?.user) {
  //       onLoginSuccess({ id: data.user.id, email: data.user.email } as Profile);
  //     }
      
  //   } catch (err) {
  //     console.error('Unexpected error');
  //   }

  // };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm' className="whitespace-nowrap mx-1 cursor-pointer">
          {dialogTitleMap[dialogType]}
        </Button> 
      </DialogTrigger>
      <DialogContent className='w-1/3'>          
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>Continue using one of the options below.</DialogDescription>
        </DialogHeader>

        <div className='grid gap-2 grid-cols-1'>
          <Button variant='outline' size='lg' className='cursor-pointer border-2' onClick={handleSignInGoogle}>
            <Icon icon="logos:google-icon"/>
            Google
          </Button>
          <Button variant='outline' size='lg' className='cursor-pointer border-2'>
            <Icon icon="mdi:github"/>
            GitHub
          </Button>
        </div>

        {/* <form onSubmit={handleSubmit} className='grid gap-3'>
          <Label htmlFor="email">Email</Label>
          <Input type="email" placeholder="m@example.com" onChange={(e) => setEmail(e.target.value)} required />
          <Label htmlFor="password">Password</Label>
          <Input type="password" onChange={(e) => setPassword(e.target.value)} required />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={(e) => console.log("Clicked submit")}>Submit</Button>
          </DialogFooter> 
        </form> */}

      </DialogContent>
    </Dialog>
  );
}
