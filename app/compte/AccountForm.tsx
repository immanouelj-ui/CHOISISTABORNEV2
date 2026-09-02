"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type User = { id: string; name: string | null; email: string; role: string };
type Mode = "login" | "register";

export default function AccountForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "google_auth") {
      setError("La connexion Google n'a pas pu être finalisée. Vérifiez la configuration Google/Supabase.");
    }

    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => undefined);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }

      setUser(data.user);
      setPassword("");
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setMode("login");
  }

  if (user) {
    const isAdmin = user.role === "ADMIN";

    return (
      <div className="w-full max-w-lg rounded-2xl border border-line bg-ink-soft p-8 text-left shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.18em] text-fog">{isAdmin ? "Espace administrateur" : "Espace client"}</p>
            <h2 className="font-display text-3xl text-paper">Bonjour {user.name || ""}</h2>
            <p className="mt-2 text-paper/60">{user.email}</p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${isAdmin ? "border-charge/40 bg-charge/10 text-charge" : "border-line text-paper/60"}`}>
            {isAdmin ? "ADMIN" : "CLIENT"}
          </span>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link href="/panier" className="rounded-xl border border-line px-4 py-3 text-center text-sm text-paper transition hover:bg-paper/5">
            Mon panier
          </Link>
          {isAdmin && (
            <Link href="/admin" className="rounded-xl bg-charge px-4 py-3 text-center text-sm font-semibold text-paper transition hover:opacity-90">
              Tableau de bord admin
            </Link>
          )}
          <button onClick={logout} className="rounded-xl border border-line px-4 py-3 text-sm text-paper transition hover:bg-paper/5 sm:col-span-2">
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg rounded-2xl border border-line bg-ink-soft p-8 shadow-xl">
      <div className="mb-8 flex rounded-full border border-line p-1">
        <button type="button" onClick={() => { setMode("login"); setError(""); }} className={`flex-1 rounded-full px-4 py-2 text-sm transition ${mode === "login" ? "bg-paper text-ink" : "text-paper/60"}`}>
          Se connecter
        </button>
        <button type="button" onClick={() => { setMode("register"); setError(""); }} className={`flex-1 rounded-full px-4 py-2 text-sm transition ${mode === "register" ? "bg-paper text-ink" : "text-paper/60"}`}>
          Créer un compte
        </button>
      </div>

      <a
        href="/api/auth/google"
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-sm font-semibold text-ink transition hover:bg-paper/90"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
          <path fill="#4285F4" d="M21.35 12.27c0-.71-.06-1.39-.18-2.05H12v3.88h5.23a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.92-4.18 2.92-7.19Z" />
          <path fill="#34A853" d="M12 21.6c2.63 0 4.84-.87 6.45-2.35l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.51A9.75 9.75 0 0 0 12 21.6Z" />
          <path fill="#FBBC05" d="M6.53 13.71a5.86 5.86 0 0 1 0-3.42V7.78H3.29a9.73 9.73 0 0 0 0 8.44l3.24-2.51Z" />
          <path fill="#EA4335" d="M12 6.26c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.36 14.63 2.4 12 2.4a9.75 9.75 0 0 0-8.71 5.38l3.24 2.51C7.3 7.98 9.46 6.26 12 6.26Z" />
        </svg>
        Continuer avec Google
      </a>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.15em] text-paper/30">
        <span className="h-px flex-1 bg-line" />
        ou par e-mail
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={submit} className="space-y-5">
        {mode === "register" && (
          <label className="block">
            <span className="mb-2 block text-sm text-paper/70">Nom</span>
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-paper outline-none transition focus:border-charge" placeholder="Votre nom" />
          </label>
        )}
        <label className="block">
          <span className="mb-2 block text-sm text-paper/70">E-mail</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-paper outline-none transition focus:border-charge" placeholder="vous@exemple.fr" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-paper/70">Mot de passe</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "register" ? "new-password" : "current-password"} minLength={mode === "register" ? 8 : 1} required className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-paper outline-none transition focus:border-charge" placeholder={mode === "register" ? "8 caractères minimum" : "Votre mot de passe"} />
        </label>
        {error && <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Veuillez patienter…" : mode === "register" ? "Créer mon compte" : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
