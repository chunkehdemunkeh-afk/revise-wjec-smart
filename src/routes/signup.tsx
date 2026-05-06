import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — ReviseWJEC" }] }),
  component: SignupPage,
});

function SignupPage() {
  const { signUp } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await signUp(email, password);
      nav({ to: "/" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign-up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm pt-10">
      <h1 className="mb-6 text-2xl font-bold">Create account</h1>
      <Card>
        <CardContent className="p-5">
          <form className="space-y-3" onSubmit={onSubmit}>
            <Input type="email" placeholder="you@school.uk" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password (min 6 chars)" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
            {err && <p className="text-sm text-destructive">{err}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating…" : "Create account"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Link to="/login" className="text-primary underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
