import React, { useState } from "react";

const TOWNSHIPS = [
  "Kamayut", "Bahan", "Hlaing", "Sanchaung", "Tamwe", "Yankin",
  "Mayangone", "Insein", "Thingangyun", "South Okkalapa", "North Okkalapa",
  "Dagon Myothit (North)", "Dagon Myothit (South)", "Botahtaung",
  "Pazundaung", "Kyauktada", "Lanmadaw", "Ahlone", "Dawbon", "Thaketa",
];

// ── Charming cartoon house drawn with inline SVG ──────────────────────────
function CartoonHouse({ className = "" }) {
  return (
    <svg viewBox="0 0 240 200" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* sun */}
      <circle cx="205" cy="35" r="18" fill="#FDE68A" />
      <g stroke="#FCD34D" strokeWidth="3" strokeLinecap="round">
        <line x1="205" y1="6" x2="205" y2="12" />
        <line x1="232" y1="35" x2="226" y2="35" />
        <line x1="224" y1="16" x2="220" y2="20" />
        <line x1="224" y1="54" x2="220" y2="50" />
      </g>

      {/* trees */}
      <g>
        <rect x="30" y="135" width="8" height="30" rx="3" fill="#92633B" />
        <circle cx="34" cy="128" r="20" fill="#86EFAC" />
        <circle cx="22" cy="135" r="13" fill="#6EE7B7" />
        <circle cx="46" cy="135" r="13" fill="#6EE7B7" />
      </g>

      {/* chimney */}
      <rect x="150" y="48" width="20" height="34" rx="3" fill="#C084FC" />
      <rect x="146" y="44" width="28" height="10" rx="3" fill="#A855F7" />
      {/* smoke */}
      <g fill="#E9D5FF">
        <circle cx="160" cy="34" r="5" />
        <circle cx="166" cy="24" r="6" />
        <circle cx="158" cy="16" r="7" />
      </g>

      {/* roof */}
      <path d="M70 90 L120 50 L170 90 Z" fill="#8B5CF6" />
      <path d="M70 90 L120 50 L170 90 Z" fill="none" stroke="#7C3AED" strokeWidth="3" strokeLinejoin="round" />

      {/* walls */}
      <rect x="80" y="90" width="80" height="75" rx="6" fill="#FBCFE8" />
      <rect x="80" y="90" width="80" height="75" rx="6" fill="none" stroke="#F9A8D4" strokeWidth="3" />

      {/* door */}
      <rect x="108" y="120" width="24" height="45" rx="8" fill="#A855F7" />
      <circle cx="126" cy="143" r="2.5" fill="#FDE68A" />

      {/* windows */}
      <g>
        <rect x="88" y="104" width="20" height="20" rx="4" fill="#BAE6FD" stroke="#7DD3FC" strokeWidth="2" />
        <line x1="98" y1="104" x2="98" y2="124" stroke="#7DD3FC" strokeWidth="2" />
        <line x1="88" y1="114" x2="108" y2="114" stroke="#7DD3FC" strokeWidth="2" />
      </g>
      <g>
        <rect x="132" y="104" width="20" height="20" rx="4" fill="#BAE6FD" stroke="#7DD3FC" strokeWidth="2" />
        <line x1="142" y1="104" x2="142" y2="124" stroke="#7DD3FC" strokeWidth="2" />
        <line x1="132" y1="114" x2="152" y2="114" stroke="#7DD3FC" strokeWidth="2" />
      </g>

      {/* ground */}
      <rect x="0" y="165" width="240" height="10" rx="5" fill="#86EFAC" />
    </svg>
  );
}

// ── Reusable number stepper (no <form>, no <input type=number> spinners) ──
function NumberField({ label, icon, value, onChange, min = 0, max = 30 }) {
  const set = (v) => onChange(Math.max(min, Math.min(max, v)));
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        <span className="mr-1">{icon}</span>{label}
      </label>
      <div className="flex items-center rounded-2xl border-2 border-slate-100 bg-slate-50 overflow-hidden">
        <button
          type="button"
          onClick={() => set(value - 1)}
          className="w-11 h-11 text-xl font-bold text-indigo-500 hover:bg-indigo-50 active:scale-90 transition"
        >−</button>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
            set(Number.isNaN(n) ? 0 : n);
          }}
          className="flex-1 w-full bg-transparent text-center text-lg font-bold text-slate-800 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => set(value + 1)}
          className="w-11 h-11 text-xl font-bold text-indigo-500 hover:bg-indigo-50 active:scale-90 transition"
        >+</button>
      </div>
    </div>
  );
}

export default function YangonHousePriceEstimator() {
  const [open, setOpen] = useState(false);
  const [township, setTownship] = useState("Kamayut");
  const [bedroom, setBedroom] = useState(2);
  const [bathroom, setBathroom] = useState(1);
  const [aircon, setAircon] = useState(1);
  const [floor, setFloor] = useState(1);
  const [tank, setTank] = useState(true);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { mmk, usd, explanation }
  const [error, setError] = useState("");

  const openModal = () => {
    setResult(null);
    setError("");
    setOpen(true);
  };
  const closeModal = () => setOpen(false);

  async function estimate() {
    setLoading(true);
    setError("");
    setResult(null);

    const prompt = `You are a Yangon, Myanmar real-estate pricing expert. Estimate a realistic current market price for this property.

Property details:
- Township: ${township}
- Bedrooms: ${bedroom}
- Bathrooms: ${bathroom}
- Air conditioners: ${aircon}
- Floor level: ${floor}
- Overhead water tank: ${tank ? "Yes" : "No"}

Consider that townships like Bahan, Kamayut, and Sanchaung are more expensive, while outer townships are cheaper. Give a single realistic point estimate (not a wide range).

Respond ONLY with a valid JSON object, no markdown, in exactly this shape:
{"mmk": <number in Myanmar Kyat>, "usd": <number in US Dollars>, "explanation": "<one or two friendly sentences explaining the estimate>"}`;

    try {
      const raw = await window.claude.complete(prompt);
      const jsonText = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
      const data = JSON.parse(jsonText);
      setResult({
        mmk: Number(data.mmk),
        usd: Number(data.usd),
        explanation: String(data.explanation || ""),
      });
    } catch (e) {
      setError("Sorry, the estimate couldn't be generated. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const fmt = (n) => (Number.isFinite(n) ? n.toLocaleString() : "—");

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans"
         style={{ background: "linear-gradient(160deg,#EDE9FE 0%,#FCE7F3 45%,#FFF7ED 100%)" }}>

      {/* ── Landing screen ───────────────────────────────────────────── */}
      <div className="text-center max-w-md w-full">
        <div className="mx-auto w-64 sm:w-72 drop-shadow-sm animate-[bounce_3s_ease-in-out_infinite]">
          <CartoonHouse className="w-full h-auto" />
        </div>

        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-indigo-900 tracking-tight">
          Yangon House Price Estimator
        </h1>
        <p className="mt-3 text-slate-500 text-sm sm:text-base">
          Curious what your home is worth? Tap below for a friendly AI estimate. 🏡✨
        </p>

        <button
          type="button"
          onClick={openModal}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-base sm:text-lg font-bold text-white shadow-xl shadow-indigo-500/30 transition hover:scale-105 hover:shadow-indigo-500/50 active:scale-95"
        >
          🏠 Check My House Price
        </button>
      </div>

      {/* ── Modal ────────────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_.2s_ease-out]"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-7 shadow-2xl animate-[slideUp_.3s_cubic-bezier(.2,.8,.2,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* close */}
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 w-9 h-9 rounded-full bg-slate-100 text-slate-500 text-lg font-bold hover:bg-rose-100 hover:text-rose-500 transition flex items-center justify-center"
              aria-label="Close"
            >✕</button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 shrink-0">
                <CartoonHouse className="w-full h-full" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-indigo-900 leading-tight">Estimate Your Price</h2>
                <p className="text-xs text-slate-400">Fill in your home's details below</p>
              </div>
            </div>

            {/* Township */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">📍 Township</label>
              <div className="relative">
                <select
                  value={township}
                  onChange={(e) => setTownship(e.target.value)}
                  className="w-full appearance-none rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-indigo-400 focus:outline-none"
                >
                  {TOWNSHIPS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
              </div>
            </div>

            {/* Numbers */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <NumberField label="Bedrooms" icon="🛏️" value={bedroom} onChange={setBedroom} />
              <NumberField label="Bathrooms" icon="🚿" value={bathroom} onChange={setBathroom} />
              <NumberField label="Air Cons" icon="❄️" value={aircon} onChange={setAircon} />
              <NumberField label="Floor Level" icon="🏢" value={floor} onChange={setFloor} max={50} />
            </div>

            {/* Toggle */}
            <div className="mb-5 flex items-center justify-between rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 py-3">
              <span className="text-sm font-semibold text-slate-700">💧 Overhead Water Tank</span>
              <button
                type="button"
                onClick={() => setTank((v) => !v)}
                className={`relative w-12 h-7 rounded-full transition-colors ${tank ? "bg-indigo-600" : "bg-slate-300"}`}
              >
                <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${tank ? "translate-x-5" : ""}`} />
              </button>
            </div>

            {/* Estimate button */}
            <button
              type="button"
              onClick={estimate}
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? "Estimating… 🤔" : "✨ Estimate Price"}
            </button>

            {/* Result */}
            {error && (
              <div className="mt-4 rounded-2xl bg-rose-50 border-2 border-rose-100 p-4 text-center text-sm font-semibold text-rose-600">
                {error}
              </div>
            )}

            {result && (
              <div className="mt-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100 p-5 text-center animate-[slideUp_.3s_ease-out]">
                <p className="text-xs uppercase tracking-widest font-bold text-indigo-400">Estimated Value</p>
                <p className="mt-1 text-3xl font-extrabold text-indigo-900">
                  {fmt(result.mmk)} <span className="text-lg text-indigo-500">MMK</span>
                </p>
                <p className="mt-0.5 text-sm font-semibold text-purple-500">≈ ${fmt(result.usd)} USD</p>
                {result.explanation && (
                  <p className="mt-3 text-xs text-slate-500 leading-relaxed">{result.explanation}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* keyframes (Tailwind arbitrary animations reference these) */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) scale(.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  );
}
