"use client";

import { useEffect } from "react";
import { Container } from "@/components/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <Container className="pt-10">
      <Card>
        <div className="text-sm font-medium">Something went wrong</div>
        <div className="mt-2 text-sm text-white/70">{error.message}</div>
        <div className="mt-4">
          <Button onClick={reset} className="w-full">
            Try again
          </Button>
        </div>
      </Card>
    </Container>
  );
}

