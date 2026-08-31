"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Search } from "lucide-react";

type Option = { name: string; slug: string };

export default function Filters({ brands, categories }: { brands: Option[]; categories: Option[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = useRef<HTMLDivElement>(null);

  const [q, setQ] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    gsap.fromTo(ref.current, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
  }, []);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/produits?${params.toString()}`);
  };

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("q", q || null);
  };

  return (
    <div ref={ref} className="mb-12 flex flex-col gap-4 border-b border-line pb-8 md:flex-row md:items-center md:justify-between">
      <form onSubmit={onSubmitSearch} className="flex w-full max-w-sm items-center gap-2 rounded-full border border-line px-4 py-2.5">
        <Search size={16} className="text-fog" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher une borne"
          className="w-full bg-transparent text-sm text-paper placeholder:text-fog focus:outline-none"
        />
      </form>

      <div className="flex flex-wrap gap-3">
        <select
          defaultValue={searchParams.get("category") ?? ""}
          onChange={(e) => updateParam("category", e.target.value || null)}
          className="rounded-full border border-line bg-transparent px-4 py-2.5 text-sm text-paper/85"
        >
          <option value="" className="bg-ink">Catégorie</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug} className="bg-ink">{c.name}</option>
          ))}
        </select>

        <select
          defaultValue={searchParams.get("brand") ?? ""}
          onChange={(e) => updateParam("brand", e.target.value || null)}
          className="rounded-full border border-line bg-transparent px-4 py-2.5 text-sm text-paper/85"
        >
          <option value="" className="bg-ink">Marque</option>
          {brands.map((b) => (
            <option key={b.slug} value={b.slug} className="bg-ink">{b.name}</option>
          ))}
        </select>

        <select
          defaultValue={searchParams.get("minPower") ?? ""}
          onChange={(e) => updateParam("minPower", e.target.value || null)}
          className="rounded-full border border-line bg-transparent px-4 py-2.5 text-sm text-paper/85"
        >
          <option value="" className="bg-ink">Puissance min.</option>
          <option value="7.4" className="bg-ink">7,4 kW+</option>
          <option value="11" className="bg-ink">11 kW+</option>
          <option value="22" className="bg-ink">22 kW+</option>
        </select>

        <select
          defaultValue={searchParams.get("connectivity") ?? ""}
          onChange={(e) => updateParam("connectivity", e.target.value || null)}
          className="rounded-full border border-line bg-transparent px-4 py-2.5 text-sm text-paper/85"
        >
          <option value="" className="bg-ink">Connectivité</option>
          <option value="wifi" className="bg-ink">Wi-Fi</option>
          <option value="wifi_bluetooth" className="bg-ink">Wi-Fi + Bluetooth</option>
          <option value="wifi_4g" className="bg-ink">Wi-Fi + 4G</option>
          <option value="none" className="bg-ink">Sans connectivité</option>
        </select>

        <select
          defaultValue={searchParams.get("sort") ?? ""}
          onChange={(e) => updateParam("sort", e.target.value || null)}
          className="rounded-full border border-line bg-transparent px-4 py-2.5 text-sm text-paper/85"
        >
          <option value="" className="bg-ink">Tri</option>
          <option value="price-asc" className="bg-ink">Prix croissant</option>
          <option value="price-desc" className="bg-ink">Prix décroissant</option>
          <option value="power-desc" className="bg-ink">Puissance</option>
        </select>
      </div>
    </div>
  );
}
