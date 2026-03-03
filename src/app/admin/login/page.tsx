"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = useMemo(() => searchParams.get("next") ?? "/admin", [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Container className="pt-10">
      <Logo />

      <div className="mt-8">
        <Card>
          <div className="text-base font-semibold">Admin login</div>
          <div className="mt-1 text-sm text-white/70">
            Sign in to manage tournaments and scores.
          </div>

          <form
            className="mt-6 space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError(null);
              const supabase = createSupabaseBrowserClient();
              const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
              });
              if (error) {
                setError(error.message);
                setLoading(false);
                return;
              }
              router.replace(nextUrl);
              router.refresh();
            }}
          >
            <div className="space-y-2">
              <label className="text-xs text-white/70">Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-white/70">Password</label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  );
}

