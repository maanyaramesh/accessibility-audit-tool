import { useState, useRef } from "react";

const IMPACT_CONFIG = {
  critical: { color: "#C0392B", bg: "#FDF0EE", border: "#E8C4BF", label: "Critical", dot: "#C0392B", order: 0 },
  serious: { color: "#B7500A", bg: "#FDF4EE", border: "#EDD5B8", label: "Serious", dot: "#E07020", order: 1 },
  moderate: { color: "#7A6200", bg: "#FDFAEE", border: "#E8DEAC", label: "Moderate", dot: "#C9A800", order: 2 },
  minor: { color: "#1A5E8A", bg: "#EEF4FD", border: "#B8D4ED", label: "Minor", dot: "#3A8CC0", order: 3 },
};

function ScoreRing({ score }) {
  const r = 64;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 90 ? "#2D7D46" : score >= 70 ? "#C9A800" : score >= 50 ? "#E07020" : "#C0392B";
  const grade = score >= 90 ? "A" : score >= 70 ? "B" : score >= 50 ? "C" : "F";
  return (
    <svg width="164" height="164" viewBox="0 0 164 164">
      <circle cx="82" cy="82" r={r} fill="none" stroke="#EAE6DF" strokeWidth="10" />
      <circle
        cx="82" cy="82" r={r} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 82 82)"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1), stroke 0.4s" }}
      />
      <text x="82" y="72" textAnchor="middle" fill={color} fontSize="40" fontWeight="700" fontFamily="'Fraunces', serif">{score}</text>
      <text x="82" y="92" textAnchor="middle" fill="#B0AA9E" fontSize="13" fontFamily="'Figtree', sans-serif" letterSpacing="0.06em">SCORE</text>
      <text x="82" y="114" textAnchor="middle" fill={color} fontSize="20" fontWeight="600" fontFamily="'Figtree', sans-serif">{grade}</text>
    </svg>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div style={{
      flex: 1, background: "#FDFCF9", border: "1px solid #EAE6DF",
      borderRadius: 12, padding: "16px 14px", textAlign: "center",
    }}>
      <div style={{ fontSize: 32, fontWeight: 700, color: color || "#2C2A25", fontFamily: "'Fraunces', serif", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#9E9A90", marginTop: 6, letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: "'Figtree', sans-serif" }}>{label}</div>
    </div>
  );
}

function ViolationCard({ v, index }) {
  const [open, setOpen] = useState(false);
  const cfg = IMPACT_CONFIG[v.impact] || IMPACT_CONFIG.minor;
  return (
    <div style={{
      background: "#FDFCF9",
      border: `1px solid ${open ? cfg.border : "#EAE6DF"}`,
      borderRadius: 12,
      marginBottom: 10,
      overflow: "hidden",
      transition: "border-color 0.2s, box-shadow 0.2s",
      boxShadow: open ? `0 2px 16px ${cfg.color}14` : "none",
      animation: `fadeUp 0.25s ease both`,
      animationDelay: `${index * 0.04}s`,
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 12,
        padding: "16px 18px", background: "none", border: "none",
        cursor: "pointer", textAlign: "left",
      }}>
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
        <span style={{
          fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
          color: cfg.color, background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          padding: "3px 9px", borderRadius: 5, flexShrink: 0,
          fontFamily: "'Figtree', sans-serif",
        }}>{cfg.label.toUpperCase()}</span>
        <span style={{ fontSize: 15, color: "#3A3730", fontFamily: "'Figtree', sans-serif", flex: 1, fontWeight: 500 }}>{v.id}</span>
        <span style={{ fontSize: 13, color: "#B0AA9E", marginRight: 6, fontFamily: "'Figtree', sans-serif" }}>
          {v.nodes.length} {v.nodes.length === 1 ? "node" : "nodes"}
        </span>
        <svg width="16" height="16" viewBox="0 0 14 14" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
          <path d="M3 5l4 4 4-4" stroke="#C0B9AD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${cfg.border}50` }}>
          <p style={{ color: "#6E6A60", fontSize: 15, margin: "14px 0 14px", lineHeight: 1.7, fontFamily: "'Figtree', sans-serif" }}>{v.description}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {v.nodes.map((node, i) => (
              <div key={i} style={{ background: "#F7F4EF", border: "1px solid #EAE6DF", borderRadius: 10, padding: "12px 14px" }}>
                <pre style={{
                  fontSize: 13, color: "#4A6741", margin: "0 0 8px",
                  overflowX: "auto", fontFamily: "'Fira Code', monospace",
                  lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-all",
                }}>{node.html}</pre>
                <p style={{ color: "#8A8278", fontSize: 13, margin: 0, lineHeight: 1.55, fontFamily: "'Figtree', sans-serif" }}>{node.failureSummary}</p>
              </div>
            ))}
          </div>
          <a href={v.helpUrl} target="_blank" rel="noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: cfg.color, fontSize: 13, textDecoration: "none",
            marginTop: 12, fontFamily: "'Figtree', sans-serif", fontWeight: 500,
          }}>
            View fix guide
            <svg width="12" height="12" viewBox="0 0 11 11" fill="none">
              <path d="M2 9L9 2M9 2H4M9 2v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const runAudit = async () => {
    if (!url.startsWith("http")) {
      setError("Enter a full URL starting with http:// or https://");
      return;
    }

    setError(null);
    setLoading(true);
    setResults(null);
    setFilter("all");

    try {
      const API = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API}/audit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      setResults(data);
    } catch (err) {
      setError(
        err.message.includes("fetch")
          ? "Cannot reach server — check backend URL"
          : err.message
      );
    }

    setLoading(false);
  };

  const counts = results
    ? Object.keys(IMPACT_CONFIG).reduce((acc, k) => {
      acc[k] = results.violations.filter(v => v.impact === k).length;
      return acc;
    }, {})
    : {};

  const score = results
    ? Math.max(0, Math.round(100 - (counts.critical || 0) * 15 - (counts.serious || 0) * 8 - (counts.moderate || 0) * 4 - (counts.minor || 0) * 1))
    : null;

  const filtered = results
    ? (filter === "all" ? results.violations : results.violations.filter(v => v.impact === filter))
      .slice().sort((a, b) => (IMPACT_CONFIG[a.impact]?.order ?? 9) - (IMPACT_CONFIG[b.impact]?.order ?? 9))
    : [];

  const totalV = results?.violations.length ?? 0;

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", background: "#F5F1EA", fontFamily: "'Figtree', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Figtree:wght@400;500;600&family=Fira+Code:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { overflow: hidden; height: 100%; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%,100%{opacity:.35} 50%{opacity:.85} }
        .url-input { background: #FDFCF9; border: 1.5px solid #DDD9D0; border-radius: 10px; padding: 13px 16px; font-size: 15px; font-family: 'Figtree', sans-serif; color: #2C2A25; width: 100%; transition: border-color 0.2s, box-shadow 0.2s; outline: none; }
        .url-input:focus { border-color: #A09880; box-shadow: 0 0 0 3px #A0988018; }
        .url-input::placeholder { color: #C0B9AD; }
        .run-btn { width: 100%; padding: 14px; background: #2C2A25; color: #F5F1EA; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; font-family: 'Figtree', sans-serif; cursor: pointer; transition: background 0.2s, transform 0.1s; letter-spacing: 0.02em; }
        .run-btn:hover:not(:disabled) { background: #3E3B34; }
        .run-btn:active:not(:disabled) { transform: scale(0.99); }
        .run-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .filter-chip { border: 1.5px solid #DDD9D0; border-radius: 20px; padding: 6px 16px; font-size: 13px; font-family: 'Figtree', sans-serif; font-weight: 500; background: #FDFCF9; color: #7A7568; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
        .filter-chip:hover { border-color: #A09880; color: #3A3730; }
        .filter-chip.active { background: #2C2A25; color: #F5F1EA; border-color: #2C2A25; }
        .violations-scroll { overflow-y: auto; flex: 1; padding: 0 28px 28px; }
        .violations-scroll::-webkit-scrollbar { width: 5px; }
        .violations-scroll::-webkit-scrollbar-track { background: transparent; }
        .violations-scroll::-webkit-scrollbar-thumb { background: #DDD9D0; border-radius: 3px; }
        .sidebar-scroll { overflow-y: auto; flex: 1; }
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: #DDD9D0; border-radius: 3px; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: 320, flexShrink: 0,
        background: "#EDEAE0",
        borderRight: "1px solid #DDD9D0",
        display: "flex", flexDirection: "column",
        height: "100vh",
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 22px 20px", borderBottom: "1px solid #DDD9D0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 36, height: 36, background: "#2C2A25", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="6.5" stroke="#F5F1EA" strokeWidth="1.7" />
                <path d="M9 5.5v3.8l2.6 1.9" stroke="#F5F1EA" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#2C2A25", letterSpacing: "-0.02em", fontFamily: "'Fraunces', serif" }}>A11yScan</div>
          </div>
        </div>

        {/* URL input */}
        <div style={{ padding: "20px 20px 0", flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#9E9A90", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Target URL</div>
          <input
            ref={inputRef}
            className="url-input"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !loading && runAudit()}
            placeholder="https://your-site.com"
          />
          {error && <p style={{ color: "#C0392B", fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>{error}</p>}
          <button className="run-btn" onClick={runAudit} disabled={loading || !url} style={{ marginTop: 10 }}>
            {loading
              ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
                <span style={{ width: 15, height: 15, border: "2px solid #5A5750", borderTopColor: "#F5F1EA", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                Auditing…
              </span>
              : "Run Audit"}
          </button>
        </div>

        {/* Score + stats */}
        <div className="sidebar-scroll" style={{ flex: 1 }}>
          {results && !loading && (
            <div style={{ animation: "fadeUp 0.4s ease both" }}>
              <div style={{ padding: "24px 20px 18px", display: "flex", flexDirection: "column", alignItems: "center", borderBottom: "1px solid #DDD9D0" }}>
                <ScoreRing score={score} />
                <div style={{ marginTop: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 14, color: "#7A7568", lineHeight: 1.5, fontWeight: 500 }}>
                    {totalV === 0 ? "No violations found 🎉" : `${totalV} violation${totalV !== 1 ? "s" : ""} detected`}
                  </div>
                  <div style={{ fontSize: 12, color: "#B0AA9E", marginTop: 4, wordBreak: "break-all" }}>
                    {results.url.replace(/^https?:\/\//, "")}
                  </div>
                </div>
              </div>
              <div style={{ padding: "16px 20px 0" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                  <StatBox label="Passing" value={results.passes} color="#2D7D46" />
                  <StatBox label="Incomplete" value={results.incomplete} color="#7A6200" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {Object.entries(IMPACT_CONFIG).map(([k, cfg]) => (
                    <StatBox key={k} label={cfg.label} value={counts[k] ?? 0} color={counts[k] ? cfg.color : "#C0B9AD"} />
                  ))}
                </div>
                <div style={{ fontSize: 12, color: "#B0AA9E", padding: "14px 0 18px" }}>
                  Audited {new Date(results.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          )}

          {!results && !loading && (
            <div style={{ padding: "32px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#B0AA9E", lineHeight: 1.8 }}>
                Enter a URL above and click Run Audit to see your accessibility score and violations.
              </div>
            </div>
          )}

          {loading && (
            <div style={{ padding: "32px 20px", textAlign: "center" }}>
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 14 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#C0B9AD", animation: `shimmer 1.2s ease ${i * 0.2}s infinite` }} />
                ))}
              </div>
              <div style={{ fontSize: 13, color: "#B0AA9E", lineHeight: 1.8 }}>
                Launching browser<br />Injecting axe-core<br />Running checks…
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MAIN PANEL ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", minWidth: 0 }}>

        {/* Top bar */}
        <div style={{
          padding: "0 28px", height: 64, flexShrink: 0,
          borderBottom: "1px solid #DDD9D0",
          background: "#F5F1EA",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 17, fontWeight: 600, color: "#2C2A25", fontFamily: "'Fraunces', serif", letterSpacing: "-0.02em" }}>
              {results ? "Audit Results" : "Accessibility Checker"}
            </span>
            {results && (
              <span style={{ fontSize: 12, color: "#9E9A90", background: "#EAE6DF", padding: "3px 10px", borderRadius: 10 }}>
                {totalV} issue{totalV !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          {results && (
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
              <button className={`filter-chip ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All</button>
              {Object.entries(IMPACT_CONFIG).map(([k, cfg]) => counts[k] > 0 && (
                <button key={k} className={`filter-chip ${filter === k ? "active" : ""}`} onClick={() => setFilter(k)}>
                  {cfg.label} · {counts[k]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        {results && !loading ? (
          filtered.length === 0 ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 40, color: "#2D7D46" }}>✓</div>
              <div style={{ fontSize: 16, color: "#9E9A90" }}>No violations in this category</div>
            </div>
          ) : (
            <div className="violations-scroll">
              <div style={{ paddingTop: 22 }}>
                {filtered.map((v, i) => <ViolationCard key={v.id} v={v} index={i} />)}
              </div>
              <div style={{ textAlign: "center", padding: "18px 0 6px", fontSize: 12, color: "#C0B9AD" }}>
                axe-core · WCAG 2.2 · Combine with manual testing for best results
              </div>
            </div>
          )
        ) : !loading ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", maxWidth: 440 }}>
              <div style={{ width: 72, height: 72, background: "#EAE6DF", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px" }}>
                <svg width="32" height="32" viewBox="0 0 26 26" fill="none">
                  <circle cx="13" cy="13" r="10" stroke="#A09880" strokeWidth="1.8" />
                  <path d="M13 8.5v4.8l2.8 2.8" stroke="#A09880" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 600, color: "#2C2A25", fontFamily: "'Fraunces', serif", letterSpacing: "-0.02em", marginBottom: 12 }}>
                Ready to audit
              </h2>
              <p style={{ fontSize: 15, color: "#9E9A90", lineHeight: 1.8 }}>
                Enter any live URL in the sidebar and click Run Audit. axe-core will scan the page and return WCAG 2.2 violations with guidance on how to fix each one.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 22, marginTop: 28 }}>
                {Object.entries(IMPACT_CONFIG).map(([k, cfg]) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.dot }} />
                    <span style={{ fontSize: 13, color: "#9E9A90" }}>{cfg.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", gap: 7, justifyContent: "center", marginBottom: 16 }}>
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#C0B9AD", animation: `shimmer 1.4s ease ${i * 0.14}s infinite` }} />
                ))}
              </div>
              <div style={{ fontSize: 15, color: "#B0AA9E" }}>Running accessibility audit…</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}