import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Profile } from '@/lib/types';
import { useActiveUser } from '@/lib/state';

export function useAuthSession() {
  const setActiveUser = useActiveUser((s) => s.setActiveUser);
  const setIsLoading = useActiveUser((s) => s.setIsLoading);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setActiveUser({ id: data.session.user.id, email: data.session.user.email } as Profile);
      }

      setIsLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        setActiveUser({ id: session.user.id, email: session.user.email } as Profile);
      } else {
        setActiveUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setActiveUser, setIsLoading]);
}