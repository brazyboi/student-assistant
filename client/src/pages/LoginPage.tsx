import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
      <h2>Student Assistant</h2>
      <Card className="mt-2 w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Only sign-in with Google is allowed at this time.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant='outline' size='lg' className='w-full cursor-pointer border-2' onClick={handleSignInGoogle}>
            <Icon icon="logos:google-icon"/>
            Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}