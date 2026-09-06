"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LEAD_STATUS_LABELS, LEAD_STATUSES } from "@/lib/lead-status";

export default function LeadStatusControl({ leadId, status }: { leadId: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(nextStatus?: string) {
    setSaving(true);
    try {
      await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus ?? value, note: note || undefined }),
      });
      setNote("");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function submitNote(event: FormEvent) {
    event.preventDefault();
    if (!note.trim()) return;
    await save(undefined);
  }

  return (
    <div className="space-y-3">
      <select
        value={value}
        disabled={saving}
        onChange={(e) => {
          setValue(e.target.value);
          save(e.target.value);
        }}
        className="w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-charge"
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
        ))}
      </select>
      <form onSubmit={submitNote} className="flex gap-2">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ajouter une note interne…"
          className="flex-1 rounded-xl border border-line bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-charge"
        />
        <button
          type="submit"
          disabled={saving || !note.trim()}
          className="rounded-xl border border-line px-3 py-2 text-sm text-paper transition hover:bg-paper/5 disabled:opacity-40"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
}
