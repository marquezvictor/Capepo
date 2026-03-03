import { Container } from "@/components/Container";
import { Card } from "@/components/ui/Card";

export default function Loading() {
  return (
    <Container className="pt-10">
      <Card>
        <div className="text-sm text-white/70">Loading…</div>
      </Card>
    </Container>
  );
}

