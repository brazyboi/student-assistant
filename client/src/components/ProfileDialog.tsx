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

// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
// import TextField from "@mui/material/TextField";
// import Box from "@mui/material/Box";

import { createProfile, loginProfile } from "../api/profiles";
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log("I'm here");
    event.preventDefault();
    let response = null;

    if (dialogType == 'create') {
      response = createProfile(email, password);
    } else if (dialogType == 'login') {
      response = loginProfile(email, password);
    }

    response?.then((data) => {
      console.log("ProfileDialog response data:", data);
      onLoginSuccess(data as Profile);
    });
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
