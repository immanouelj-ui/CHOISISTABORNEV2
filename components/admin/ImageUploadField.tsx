"use client";

import { useRef, useState } from "react";

export default function ImageUploadField({
  name,
  label,
  initialUrl = "",
}: {
  name: string;
  label: string;
  initialUrl?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file?: File) {
    if (!file) return;
    setError("");
    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const response = await fetch("/api/admin/images/upload", {
        method: "POST",
        body: form,
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Upload impossible");
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload impossible");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="mb-2 block text-sm text-paper/60">{label}</span>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          type="url"
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://... ou utilise Ajouter une image"
          className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-paper outline-none focus:border-charge"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-xl border border-charge px-4 py-3 font-medium text-charge transition hover:bg-charge hover:text-ink disabled:cursor-wait disabled:opacity-60"
        >
          {uploading ? "Envoi…" : "Ajouter une image"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      {url && (
        <div className="mt-3 flex items-center gap-3">
          <img src={url} alt="Aperçu" className="h-20 w-20 rounded-lg border border-line object-cover" />
          <button
            type="button"
            onClick={() => { setUrl(""); if (inputRef.current) inputRef.current.value = ""; }}
            className="text-sm text-paper/50 hover:text-red-400"
          >
            Retirer l'image
          </button>
        </div>
      )}
    </div>
  );
}
