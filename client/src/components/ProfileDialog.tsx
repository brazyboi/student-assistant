import * as React from "react";
import { Button } from "@/components/ui/button";
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


import { supabase } from "../api/supabaseClient";
import type { Profile } from "../lib/types";

interface ProfileDialogProps {
  dialogType: 'create' | 'login';
  onLoginSuccess: (profile: Profile) => void;
};

const dialogTitleMap = {
  'create': 'Create Account',
  'login': 'Log In',
}

export default function ProfileDialog( {dialogType, onLoginSuccess}: ProfileDialogProps ) {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm' className="whitespace-nowrap mx-1 cursor-pointer">
          {dialogTitleMap[dialogType]}
        </Button> 
      </DialogTrigger>
      <DialogContent className='max-w-sm w-full'>          
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
      </DialogContent>
    </Dialog>
  );
}
