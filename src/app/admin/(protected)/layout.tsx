import Link from "next/link";
import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import { SignOutButton } from "@/components/admin/SignOutButton";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <div className="border-b border-white/10 bg-surface-base/90 backdrop-blur">
        <Container className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo />
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/80">
                Admin
              </span>
            </div>
            <SignOutButton />
          </div>

          <div className="mt-4 flex gap-2 text-sm">
            <Link
              href="/admin"
              className="rounded-xl px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/tournaments"
              className="rounded-xl px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white"
            >
              Tournaments
            </Link>
            <Link
              href="/admin/matches"
              className="rounded-xl px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white"
            >
              Matches
            </Link>
          </div>
        </Container>
      </div>

      <Container className="py-6">{children}</Container>
    </div>
  );
}

