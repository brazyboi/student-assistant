import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { Icon } from "@iconify/react";

export default function LoginPage() {
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
    <div className="flex flex-col h-screen items-center justify-center">
      <h1>Log In</h1> 
      <div className='mt-2 grid gap-2 grid-cols-1'>
          <Button variant='outline' size='lg' className='cursor-pointer border-2' onClick={handleSignInGoogle}>
            <Icon icon="logos:google-icon"/>
            Google
          </Button>
        </div>
    </div>
  );
}