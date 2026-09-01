"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type User = { id: string; name: string | null; email: string; role: string };

type Mode = "login" | "register";

export default function AccountForm() {
  const [mode, setMode] = useState<Mode>("register");
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
    return (
      <div className="w-full max-w-lg rounded-2xl border border-line bg-ink-soft p-8 text-left shadow-xl">
        <p className="mb-2 text-sm uppercase tracking-[0.18em] text-fog">Espace client</p>
        <h2 className="font-display text-3xl text-paper">Bonjour {user.name || ""}</h2>
        <p className="mt-2 text-paper/60">{user.email}</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link href="/panier" className="rounded-xl border border-line px-4 py-3 text-center text-sm text-paper transition hover:bg-paper/5">
            Mon panier
          </Link>
          <button onClick={logout} className="rounded-xl border border-line px-4 py-3 text-sm text-paper transition hover:bg-paper/5">
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg rounded-2xl border border-line bg-ink-soft p-8 shadow-xl">
      <div className="mb-8 flex rounded-full border border-line p-1">
        <button
          type="button"
          onClick={() => { setMode("register"); setError(""); }}
          className={`flex-1 rounded-full px-4 py-2 text-sm transition ${mode === "register" ? "bg-paper text-ink" : "text-paper/60"}`}
        >
          Créer un compte
        </button>
        <button
          type="button"
          onClick={() => { setMode("login"); setError(""); }}
          className={`flex-1 rounded-full px-4 py-2 text-sm transition ${mode === "login" ? "bg-paper text-ink" : "text-paper/60"}`}
        >
          Se connecter
        </button>
      </div>

      <form onSubmit={submit} className="space-y-5">
        {mode === "register" && (
          <label className="block">
            <span className="mb-2 block text-sm text-paper/70">Nom</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-paper outline-none transition focus:border-charge"
              placeholder="Votre nom"
            />
          </label>
        )}

        <label className="block">
          <span className="mb-2 block text-sm text-paper/70">E-mail</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-paper outline-none transition focus:border-charge"
            placeholder="vous@exemple.fr"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-paper/70">Mot de passe</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            minLength={mode === "register" ? 8 : 1}
            required
            className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-paper outline-none transition focus:border-charge"
            placeholder={mode === "register" ? "8 caractères minimum" : "Votre mot de passe"}
          />
        </label>

        {error && <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Veuillez patienter…" : mode === "register" ? "Créer mon compte" : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
