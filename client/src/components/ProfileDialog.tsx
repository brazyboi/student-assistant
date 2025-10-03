import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      let data: any = null;
      let error: any = null;

      if (dialogType == 'create') {
        ({ data, error } = await supabase.auth.signUp({ email, password }));
      } else if (dialogType == 'login') {
        ({ data, error } = await supabase.auth.signInWithPassword({ email, password }));
      }

      if (error) {
        console.error("Supabase auth error:", error.message)
        return;
      }
      console.log("Profile signup/signin data", data);

      if (data?.user) {
        onLoginSuccess({ id: data.user.id, email: data.user.email } as Profile);
      }
      
    } catch (err) {
      console.error('Unexpected error');
    }

    

    /*if (dialogType == 'create') {
      response = createProfile(email, password);
    } else if (dialogType == 'login') {
      response = loginProfile(email, password);
    }

    response?.then((data) => {
      console.log("ProfileDialog response data:", data);
      onLoginSuccess(data as Profile);
    });*/
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm' className="whitespace-nowrap px-4 mx-1">{dialogTitleMap[dialogType]}</Button> 
      </DialogTrigger>
      <DialogContent>          
        <DialogHeader>
          <DialogTitle>{dialogTitleMap[dialogType]}</DialogTitle>
          <DialogDescription>Please enter your email and password.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='grid gap-3'>
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
        </form>

      </DialogContent>
    </Dialog>
  );
}
