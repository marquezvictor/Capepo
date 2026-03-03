"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export function SignOutButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={async () => {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
        router.replace("/");
        router.refresh();
      }}
    >
      Sign out
    </Button>
  );
}

