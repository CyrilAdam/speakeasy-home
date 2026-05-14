// cocktails-app.jsx — Bar App v2 (style joyeux)

// ─── Palettes ─────────────────────────────────────────────────────────────
const PALETTES = {
  "ébène":      { bg1:"#0C0C19", bg2:"#0F0F1E", accent:"#A0C4FF", blobs:["#C0392B","#52B788","#E8A000"] },
  "speakeasy":  { bg1:"#100800", bg2:"#180D00", accent:"#DAA520", blobs:["#8B4513","#D4860B","#C04000"] },
  "botanik":    { bg1:"#050F08", bg2:"#081A0C", accent:"#7BC42A", blobs:["#2D6A2D","#5A9E1A","#1B5E35"] },
  "velvet":     { bg1:"#0D0515", bg2:"#130820", accent:"#C5A3FF", blobs:["#6A1B9A","#AD1457","#4527A0"] },
  "terracotta": { bg1:"#130800", bg2:"#1A0D04", accent:"#FF8A65", blobs:["#BF360C","#E64A19","#FF6F00"] },
};

// ─── Icons ────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 22, color = "currentColor" }) => {
  const icons = {
    cocktail: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 22h8M12 11v11M3 3l9 8 9-8H3z"/></svg>,
    check:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"   strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>,
    bottle:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6l1 4H8L9 3z"/><rect x="7" y="7" width="10" height="14" rx="2"/><path d="M12 10v5M10 12.5h4"/></svg>,
    heart:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    heartFill:<svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    back:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"   strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
    clock:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
    glass:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3l2 18h10l2-18H5z"/><path d="M5 9h14"/></svg>,
    search:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    arrow:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"   strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>,
    lock:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    unlock:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>,
    user:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    eye:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    plus:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  };
  return icons[name] || null;
};

// ─── Difficulty dots ──────────────────────────────────────────────────────
const DifficultyDots = ({ level, color }) => (
  <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
    {[1,2,3].map(i => (
      <div key={i} style={{
        width: 5, height: 5, borderRadius: "50%",
        background: i <= level ? color : "rgba(255,255,255,0.2)",
      }} />
    ))}
  </div>
);

// ─── PIN Modal ────────────────────────────────────────────────────────────
function PinModal({ onSuccess, onClose }) {
  const [digits, setDigits] = React.useState([]);
  const [shake, setShake]   = React.useState(false);
  const CORRECT = "1234";

  const addDigit = d => {
    const next = [...digits, String(d)];
    if (next.length === 4) {
      if (next.join("") === CORRECT) { onSuccess(); }
      else {
        setShake(true);
        setTimeout(() => { setShake(false); setDigits([]); }, 500);
      }
    } else { setDigits(next); }
  };

  const keys = [1,2,3,4,5,6,7,8,9,"",0,"⌫"];

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 200,
      background: "rgba(4,4,12,0.92)", backdropFilter: "blur(16px)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ marginBottom: 10 }}><Icon name="lock" size={28} color="rgba(255,255,255,0.6)" /></div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Mode Gérant</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Entrez votre code PIN</div>
      </div>
      {/* Dots */}
      <div style={{ display: "flex", gap: 18, marginBottom: 36,
        animation: shake ? "shakePIN 0.45s" : "none" }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            width: 14, height: 14, borderRadius: "50%",
            background: i < digits.length ? "#A0C4FF" : "rgba(255,255,255,0.18)",
            border: "1.5px solid rgba(255,255,255,0.25)",
            transition: "background 0.12s",
          }} />
        ))}
      </div>
      {/* Keypad */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 68px)", gap: 10 }}>
        {keys.map((k, i) => (
          <button key={i} onClick={() => {
            if (typeof k === "number") addDigit(k);
            else if (k === "⌫") setDigits(d => d.slice(0,-1));
          }} style={{
            width: 68, height: 68, borderRadius: "50%", fontFamily: "inherit",
            background: typeof k === "number" ? "rgba(255,255,255,0.09)" : "transparent",
            border: typeof k === "number" ? "1px solid rgba(255,255,255,0.12)" : "none",
            color: "#fff", fontSize: k === "⌫" ? 20 : 26, fontWeight: 300,
            cursor: k !== "" ? "pointer" : "default",
          }}>{k}</button>
        ))}
      </div>
      <button onClick={onClose} style={{
        marginTop: 24, color: "rgba(255,255,255,0.35)", fontSize: 13,
        background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
      }}>Annuler</button>
      <style>{`@keyframes shakePIN{0%,100%{transform:translateX(0)}25%{transform:translateX(-10px)}75%{transform:translateX(10px)}}`}</style>
    </div>
  );
}

// ─── Cocktail Card (main visual element) ─────────────────────────────────
const CocktailCard = ({ cocktail, onSelect, isManager = false, available = true, onToggleAvailable }) => {
  const { theme } = cocktail;
  const [pressed, setPressed] = React.useState(false);
  const dimmed = !available && !isManager;

  return (
    <div style={{ position: "relative" }}>
    <button
      onClick={() => onSelect(cocktail)}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        display: "flex", alignItems: "center", gap: 0,
        background: `linear-gradient(130deg, ${theme.from} 0%, ${theme.mid} 100%)`,
        border: `1px solid ${theme.accent}40`,
        borderRadius: 22, padding: 0, cursor: "pointer",
        textAlign: "left", width: "100%", position: "relative",
        overflow: "hidden", minHeight: 86,
        opacity: dimmed ? 0.38 : 1,
        filter: dimmed ? "saturate(0.15)" : "none",
        transform: pressed ? "scale(0.97)" : "scale(1)",
        transition: "transform 0.14s cubic-bezier(0.4,0,0.2,1), box-shadow 0.14s, opacity 0.3s, filter 0.3s",
        boxShadow: pressed
          ? `0 2px 12px ${theme.from}88`
          : `0 6px 24px ${theme.from}99, 0 1px 0 rgba(255,255,255,0.06) inset`,
      }}
    >
      {/* Ambient glow blob top-right */}
      <div style={{
        position: "absolute", top: -35, right: -25,
        width: 140, height: 140, borderRadius: "50%",
        background: theme.to, opacity: 0.28, filter: "blur(18px)",
        pointerEvents: "none",
      }} />
      {/* Small secondary circle bottom-left */}
      <div style={{
        position: "absolute", bottom: -12, left: 60,
        width: 60, height: 60, borderRadius: "50%",
        background: theme.accent, opacity: 0.12, filter: "blur(10px)",
        pointerEvents: "none",
      }} />

      {/* Left accent strip */}
      <div style={{
        width: 5, alignSelf: "stretch", flexShrink: 0,
        background: `linear-gradient(180deg, ${theme.accent}, ${theme.to})`,
        borderRadius: "22px 0 0 22px",
        opacity: 0.9,
      }} />

      {/* Content */}
      <div style={{ flex: 1, padding: "15px 14px 14px 15px", position: "relative", zIndex: 1, minWidth: 0 }}>
        {/* Name + badge */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
          <span style={{
            color: "#fff", fontSize: 17, fontWeight: 800,
            letterSpacing: "-0.025em", lineHeight: 1.15,
          }}>
            {cocktail.name}
          </span>
          {cocktail.canMake && (
            <span style={{
              background: `${theme.accent}30`,
              border: `1px solid ${theme.accent}55`,
              color: theme.accent,
              fontSize: 9.5, fontWeight: 800, padding: "3px 8px",
              borderRadius: 20, letterSpacing: "0.06em", flexShrink: 0,
              textTransform: "uppercase",
            }}>✓ Faisable</span>
          )}
        </div>

        {/* Tagline */}
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12.5, marginBottom: 9, letterSpacing: "0.01em" }}>
          {cocktail.tagline}
        </div>

        {/* Meta row */}
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          {cocktail.moods.slice(0,2).map(m => (
            <span key={m} style={{
              background: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.85)",
              fontSize: 10.5, fontWeight: 500, padding: "2px 9px", borderRadius: 20,
              letterSpacing: "0.01em",
            }}>{m}</span>
          ))}
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>·</span>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Icon name="clock" size={11} color="rgba(255,255,255,0.45)" />
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{cocktail.time}</span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>·</span>
          <DifficultyDots level={cocktail.difficulty} color={theme.accent} />
        </div>
      </div>

      {/* Arrow */}
      <div style={{ paddingRight: 14, flexShrink: 0, position: "relative", zIndex: 1 }}>
        <Icon name="arrow" size={18} color="rgba(255,255,255,0.3)" />
      </div>

      {/* Consumer: unavailable overlay */}
      {!available && !isManager && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.18)", borderRadius: 22, zIndex: 5,
        }}>
          <span style={{
            background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.55)",
            fontSize: 10.5, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
            letterSpacing: "0.06em", textTransform: "uppercase", backdropFilter: "blur(4px)",
          }}>Indisponible ce soir</span>
        </div>
      )}
    </button>

    {/* Manager: availability toggle pill */}
    {isManager && (
      <button onClick={e => { e.stopPropagation(); onToggleAvailable && onToggleAvailable(cocktail.id); }}
        style={{
          position: "absolute", top: 10, right: 10, zIndex: 10,
          background: available ? `${cocktail.theme.accent}33` : "rgba(255,255,255,0.08)",
          border: `1.5px solid ${available ? cocktail.theme.accent + "66" : "rgba(255,255,255,0.18)"}`,
          borderRadius: 20, padding: "3px 10px 3px 7px",
          display: "flex", alignItems: "center", gap: 4,
          cursor: "pointer", fontFamily: "inherit",
          transition: "all 0.2s",
        }}>
        <div style={{
          width: 7, height: 7, borderRadius: "50%",
          background: available ? cocktail.theme.accent : "rgba(255,255,255,0.3)",
          boxShadow: available ? `0 0 6px ${cocktail.theme.accent}` : "none",
          transition: "all 0.2s",
        }} />
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
          color: available ? cocktail.theme.accent : "rgba(255,255,255,0.35)",
        }}>{available ? "Dispo" : "Masqué"}</span>
      </button>
    )}
    </div>
  );
};

// ─── Mood chip ────────────────────────────────────────────────────────────
const MoodChip = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: "6px 14px", borderRadius: 20, cursor: "pointer",
    border: active ? "1.5px solid rgba(255,255,255,0.6)" : "1.5px solid rgba(255,255,255,0.12)",
    background: active ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
    color: active ? "#fff" : "rgba(255,255,255,0.45)",
    fontSize: 12, fontWeight: active ? 700 : 400,
    cursor: "pointer", whiteSpace: "nowrap",
    letterSpacing: "0.02em",
    transition: "all 0.18s",
    fontFamily: "inherit",
  }}>
    {label}
  </button>
);

// ─── Ambient header blobs ─────────────────────────────────────────────────
const AmbientHeader = ({ palette }) => {
  const p = palette || PALETTES["\u00e9b\u00e8ne"];
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 200, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -40, left: -30, width: 160, height: 160, borderRadius: "50%", background: p.blobs[0], opacity: 0.07, filter: "blur(50px)" }} />
      <div style={{ position: "absolute", top: -30, right: -20, width: 140, height: 140, borderRadius: "50%", background: p.blobs[1], opacity: 0.07, filter: "blur(50px)" }} />
      <div style={{ position: "absolute", top: 40, left: "40%", width: 120, height: 120, borderRadius: "50%", background: p.blobs[2], opacity: 0.06, filter: "blur(40px)" }} />
    </div>
  );
};

// ─── SCREEN: Catalogue ────────────────────────────────────────────────────
const CatalogueScreen = ({ cocktails, onSelect, search, setSearch, isManager, availability, onToggleAvailable, onSwitchToConsumer, onRequestManagerMode, onAddCocktail, palette }) => {
  const [mood, setMood] = React.useState("tous");
  const allMoods = ["tous", ...new Set(cocktails.flatMap(c => c.moods))];
  const makeableCount = cocktails.filter(c => c.canMake).length;

  const filtered = cocktails.filter(c => {
    const matchMood = mood === "tous" || c.moods.includes(mood);
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.tagline.toLowerCase().includes(search.toLowerCase());
    return matchMood && matchSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <AmbientHeader palette={palette} />

      {/* Header */}
      <div style={{ padding: "18px 20px 10px", flexShrink: 0, position: "relative", zIndex: 1 }}>
        {/* Mode row */}
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
            {isManager ? "Gérant 🍸" : "Menu du soir 🍸"}
          </div>
          {/* Mode switch button */}
          {isManager ? (
            <button onClick={onSwitchToConsumer} style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 20, padding: "4px 10px 4px 8px", cursor: "pointer",
              color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600, fontFamily: "inherit",
              letterSpacing: "0.02em",
            }}>
              <Icon name="user" size={13} color="rgba(255,255,255,0.5)" />
              Vue client
            </button>
          ) : (
            <button onClick={onRequestManagerMode} style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "rgba(160,196,255,0.08)", border: "1px solid rgba(160,196,255,0.2)",
              borderRadius: 20, padding: "4px 10px 4px 8px", cursor: "pointer",
              color: "#A0C4FF", fontSize: 11, fontWeight: 600, fontFamily: "inherit",
              letterSpacing: "0.02em",
            }}>
              <Icon name="lock" size={13} color="#A0C4FF" />
              Gérant
            </button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
            {isManager ? "Que boit-on ?" : "La carte"}
          </div>
          {isManager && (
            <button onClick={onAddCocktail} style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "linear-gradient(130deg,#8B5CF688,#A0C4FF88)",
              border: "1px solid rgba(160,196,255,0.3)", borderRadius: 20,
              padding: "6px 13px 6px 9px", cursor: "pointer", fontFamily: "inherit",
              color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: "0.01em",
            }}>
              <Icon name="plus" size={14} color="#fff" />
              Cocktail
            </button>
          )}
        </div>

        {/* Stat bubbles */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <div style={{
            background: "rgba(160,196,255,0.1)", border: "1px solid rgba(160,196,255,0.2)",
            borderRadius: 12, padding: "5px 12px", fontSize: 12, color: "#A0C4FF", fontWeight: 500,
          }}>
            {cocktails.length} recettes
          </div>
          {isManager && makeableCount > 0 && (
            <div style={{
              background: "rgba(116,198,157,0.12)", border: "1px solid rgba(116,198,157,0.25)",
              borderRadius: 12, padding: "5px 12px", fontSize: 12, color: "#74C69D", fontWeight: 600,
            }}>
              ✓ {makeableCount} faisable{makeableCount > 1 ? "s" : ""} ce soir
            </div>
          )}
          {!isManager && (
            <div style={{
              background: "rgba(116,198,157,0.12)", border: "1px solid rgba(116,198,157,0.25)",
              borderRadius: 12, padding: "5px 12px", fontSize: 12, color: "#74C69D", fontWeight: 600,
            }}>
              {cocktails.filter(c => availability[c.id] !== false).length} disponibles
            </div>
          )}
        </div>

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.07)", borderRadius: 14,
          padding: "9px 13px", marginBottom: 12,
          border: "1px solid rgba(255,255,255,0.1)",
        }}>
          <Icon name="search" size={15} color="rgba(255,255,255,0.3)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher…"
            style={{
              background: "none", border: "none", outline: "none",
              color: "#fff", fontSize: 13.5, flex: 1, fontFamily: "inherit",
            }}
          />
        </div>

        {/* Mood filters */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6, marginRight: -20, paddingRight: 20 }}>
          {allMoods.map(m => (
            <MoodChip key={m} label={m} active={mood === m} onClick={() => setMood(m)} />
          ))}
        </div>
      </div>

      {/* Cards list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "2px 20px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", paddingTop: 50, color: "rgba(255,255,255,0.25)", fontSize: 14 }}>
            Aucun cocktail trouvé
          </div>
        )}
        {filtered.map(c => (
          <CocktailCard key={c.id} cocktail={c} onSelect={onSelect}
            isManager={isManager}
            available={availability[c.id] !== false}
            onToggleAvailable={onToggleAvailable} />
        ))}
      </div>
    </div>
  );
};

// ─── SCREEN: Consumer "Ce soir" ───────────────────────────────────────────
const ConsumerCeSoirScreen = ({ cocktails, onSelect, availability }) => {
  const available = cocktails.filter(c => availability[c.id] !== false);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <AmbientHeader />
      <div style={{ padding: "18px 20px 4px", flexShrink: 0, position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 5 }}>
          Ce soir
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 4 }}>
          Au programme…
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>
          {available.length} cocktail{available.length !== 1 ? "s" : ""} disponible{available.length !== 1 ? "s" : ""} ce soir
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        {available.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🌙</div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Le bar prépare sa carte…</div>
          </div>
        ) : available.map(c => <CocktailCard key={c.id} cocktail={c} onSelect={onSelect} available={true} />)}
      </div>
    </div>
  );
};
const FaisablesScreen = ({ cocktails, onSelect }) => {
  const canMake   = cocktails.filter(c => c.canMake);
  const almostMake = cocktails.filter(c => !c.canMake && c.missingCount === 1);

  const SectionTitle = ({ label, count, color }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "16px 0 10px" }}>
      <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{label}</span>
      <span style={{ background: `${color}22`, color, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>
        {count}
      </span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <AmbientHeader />
      <div style={{ padding: "18px 20px 4px", flexShrink: 0, position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 5 }}>
          Mon inventaire
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
          Ce soir je fais…
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
        {canMake.length === 0 && almostMake.length === 0 && (
          <div style={{ textAlign: "center", paddingTop: 70 }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>🍾</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, lineHeight: 1.6 }}>
              Cochez vos bouteilles dans<br/>"Mon Bar" pour voir ce que<br/>vous pouvez préparer
            </div>
          </div>
        )}
        {canMake.length > 0 && (
          <>
            <SectionTitle label="Prêt à mixer" count={canMake.length} color="#74C69D" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {canMake.map(c => <CocktailCard key={c.id} cocktail={c} onSelect={onSelect} />)}
            </div>
          </>
        )}
        {almostMake.length > 0 && (
          <>
            <SectionTitle label="Il manque 1 ingrédient" count={almostMake.length} color="#FFB830" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {almostMake.map(c => (
                <div key={c.id} style={{ position: "relative" }}>
                  <CocktailCard cocktail={c} onSelect={onSelect} />
                  <div style={{
                    position: "absolute", bottom: 10, right: 36,
                    background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
                    borderRadius: 8, padding: "3px 9px", fontSize: 11,
                    color: "rgba(255,255,255,0.7)", pointerEvents: "none",
                  }}>
                    Manque : {c.missingIngredients[0]}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── SCREEN: Mon Bar ──────────────────────────────────────────────────────

const BOTTLE_CATEGORIES = [
  { label: "Tequila",    color: "#D4A017" }, { label: "Vodka",     color: "#90CAF9" },
  { label: "Rhum",       color: "#F5DEB3" }, { label: "Gin",       color: "#B2EBF2" },
  { label: "Whiskey",    color: "#C8963C" }, { label: "Cognac",    color: "#8B4513" },
  { label: "Liqueur",    color: "#FF7043" }, { label: "Vermouth",  color: "#8B1C1C" },
  { label: "Amer",       color: "#C4180A" }, { label: "Bitters",   color: "#7B3F00" },
  { label: "Pétillant",  color: "#F5DEB3" }, { label: "Vin",       color: "#722F37" },
  { label: "Jus",        color: "#FFF176" }, { label: "Soda",      color: "#E3F2FD" },
  { label: "Sirop",      color: "#FFE0B2" }, { label: "Autre",     color: "#9E9E9E" },
];

function AddBottleModal({ onAdd, onClose, allCategories }) {
  const [name, setName]       = React.useState("");
  const [category, setCategory] = React.useState(null);
  const [pantry, setPantry]   = React.useState(false);

  // Merge preset categories with any custom ones passed in
  const presetLabels = BOTTLE_CATEGORIES.map(c => c.label);
  const extraCategories = allCategories ? allCategories.filter(c => !presetLabels.includes(c)) : [];
  const allCats = [
    ...BOTTLE_CATEGORIES,
    ...extraCategories.map(c => ({ label: c, color: "#9E9E9E" })),
  ];
  const selectedCat = BOTTLE_CATEGORIES.find(c => c.label === category);
  const canSubmit = name.trim() && category;

  const handleAdd = () => {
    if (!canSubmit) return;
    onAdd({ id: `custom-${Date.now()}`, name: name.trim(), category, color: selectedCat?.color || "#9E9E9E", owned: true, pantry });
    onClose();
  };

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 150,
      background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)",
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#13131F", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "24px 24px 0 0", paddingBottom: 32,
        animation: "slideUpModal 0.28s cubic-bezier(0.4,0,0.2,1)",
      }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.18)" }} />
        </div>
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px 14px" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Nouvelle bouteille</div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 20, padding: "5px 12px", color: "rgba(255,255,255,0.45)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Annuler</button>
        </div>
        {/* Name */}
        <div style={{ padding: "0 20px 14px" }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 7 }}>Nom</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex : Hendrick's Gin…" autoFocus
            style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "12px 14px", color: "#fff", fontSize: 16, fontFamily: "inherit", outline: "none" }}
          />
        </div>
        {/* Category */}
        <div style={{ padding: "0 20px 14px" }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 7 }}>Catégorie</div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {allCats.map(cat => (
              <button key={cat.label} onClick={() => setCategory(cat.label)} style={{
                padding: "5px 12px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit",
                background: category === cat.label ? `${cat.color}28` : "rgba(255,255,255,0.05)",
                border: category === cat.label ? `1.5px solid ${cat.color}70` : "1.5px solid rgba(255,255,255,0.09)",
                color: category === cat.label ? cat.color : "rgba(255,255,255,0.45)",
                fontSize: 12, fontWeight: category === cat.label ? 700 : 400, transition: "all 0.14s",
                display: "flex", alignItems: "center", gap: 4,
              }}>
                {category === cat.label && <div style={{ width: 5, height: 5, borderRadius: "50%", background: cat.color }} />}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        {/* Pantry toggle */}
        <div style={{ padding: "0 20px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>Toujours disponible</div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>Ingrédient de base (jus, sirop…)</div>
          </div>
          <button onClick={() => setPantry(p => !p)} style={{
            width: 44, height: 26, borderRadius: 13, cursor: "pointer", border: "none",
            background: pantry ? "#74C69D" : "rgba(255,255,255,0.1)", position: "relative", transition: "background 0.2s",
          }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: pantry ? 21 : 3, transition: "left 0.2s" }} />
          </button>
        </div>
        {/* Submit */}
        <div style={{ padding: "0 20px" }}>
          <button onClick={handleAdd} disabled={!canSubmit} style={{
            width: "100%", padding: 15, border: "none", borderRadius: 16,
            background: canSubmit ? "linear-gradient(130deg, #52B788, #A0C4FF)" : "rgba(255,255,255,0.07)",
            color: canSubmit ? "#fff" : "rgba(255,255,255,0.25)",
            fontSize: 15, fontWeight: 800, fontFamily: "inherit", cursor: canSubmit ? "pointer" : "default",
            transition: "all 0.2s",
          }}>Ajouter au bar</button>
        </div>
      </div>
      <style>{`@keyframes slideUpModal{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </div>
  );
}

const BarScreen = ({ bottles, ownedBottles, toggleBottle, onAddBottle, isManager, allCategories, onEditBottle, onManageCategories }) => {
  const [showAdd, setShowAdd] = React.useState(false);
  const displayCategories = allCategories || [...new Set(bottles.map(b => b.category))];
  const ownedCount = bottles.filter(b => ownedBottles.has(b.id)).length;
  const pct = Math.round((ownedCount / bottles.length) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      {showAdd && <AddBottleModal
        allCategories={displayCategories}
        onAdd={bottle => { onAddBottle(bottle); setShowAdd(false); }}
        onClose={() => setShowAdd(false)} />}
      <AmbientHeader />
      <div style={{ padding: "18px 20px 14px", flexShrink: 0, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
            Inventaire
          </div>
          {isManager && (
            <button onClick={onManageCategories} style={{ display:"flex",alignItems:"center",gap:4,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"4px 10px",cursor:"pointer",color:"rgba(255,255,255,0.5)",fontSize:11,fontWeight:600,fontFamily:"inherit" }}>
              Catégories
            </button>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>Mon Bar</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", paddingBottom: 2 }}>
            {ownedCount} / {bottles.length}
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 4, height: 5 }}>
          <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #74C69D, #A0C4FF)", transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
        {displayCategories.filter(cat => bottles.some(b => b.category === cat)).map(cat => {
          const catBottles = bottles.filter(b => b.category === cat);
          return (
            <div key={cat} style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 8 }}>
                {cat}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {catBottles.map(b => {
                  const isOwned = ownedBottles.has(b.id);
                  return (
                    <div key={b.id} style={{ display:"flex",alignItems:"center",gap:0,background:isOwned?`${b.color}18`:"rgba(255,255,255,0.04)",border:isOwned?`1px solid ${b.color}44`:"1px solid rgba(255,255,255,0.07)",borderRadius:14,overflow:"hidden",transition:"all 0.2s" }}>
                      {/* Toggle owned area */}
                      <button onClick={() => !b.pantry && toggleBottle(b.id)} style={{ display:"flex",alignItems:"center",gap:10,flex:1,padding:"11px 14px",background:"transparent",border:"none",cursor:b.pantry?"default":"pointer",textAlign:"left" }}>
                        <div style={{ width:10,height:10,borderRadius:"50%",flexShrink:0,background:isOwned?b.color:"rgba(255,255,255,0.12)",boxShadow:isOwned?`0 0 10px ${b.color}99`:"none",transition:"all 0.2s" }}/>
                        <span style={{ flex:1,fontSize:13.5,fontWeight:500,color:isOwned?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.3)" }}>{b.name}</span>
                        {b.pantry ? (
                          <span style={{ fontSize:10,color:"rgba(255,255,255,0.2)",fontStyle:"italic" }}>toujours dispo</span>
                        ) : isOwned ? (
                          <Icon name="check" size={14} color={b.color} />
                        ) : null}
                      </button>
                      {/* Edit button (manager only) */}
                      {isManager && (
                        <button onClick={e=>{e.stopPropagation();onEditBottle(b);}} style={{ background:"transparent",border:"none",borderLeft:"1px solid rgba(255,255,255,0.07)",padding:"11px 12px",cursor:"pointer",color:"rgba(255,255,255,0.28)",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                          ✏️
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {/* FAB — add bottle */}
      <button onClick={() => setShowAdd(true)} style={{
        position: "absolute", bottom: 18, right: 18, zIndex: 5,
        width: 52, height: 52, borderRadius: "50%",
        background: "linear-gradient(135deg, #A0C4FF, #74C69D)",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 6px 24px rgba(160,196,255,0.4)",
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
      onPointerDown={e => e.currentTarget.style.transform = "scale(0.92)"}
      onPointerUp={e => e.currentTarget.style.transform = "scale(1)"}
      onPointerLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        <Icon name="plus" size={24} color="#0A0A18" />
      </button>
    </div>
  );
};
const FavorisScreen = ({ cocktails, favorites, onSelect }) => {
  const favs = cocktails.filter(c => favorites.has(c.id));
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <AmbientHeader />
      <div style={{ padding: "18px 20px 10px", flexShrink: 0, position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 5 }}>
          Sauvegardés
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
          Favoris
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px 20px" }}>
        {favs.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 70 }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>🤍</div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, lineHeight: 1.6 }}>
              Appuyez sur le ❤️ dans<br />une recette pour la sauvegarder
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {favs.map(c => <CocktailCard key={c.id} cocktail={c} onSelect={onSelect} />)}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── SCREEN: Cocktail Detail ──────────────────────────────────────────────
const DetailScreen = ({ cocktail, onBack, isFav, toggleFav, ownedBottles, isManager, onEditCocktail }) => {
  const [tab, setTab] = React.useState("recette");
  const { theme } = cocktail;
  const isOwned = id => ownedBottles.has(id);

  const SceneComponent = !cocktail.sceneUrl && window.COCKTAIL_SCENES && window.COCKTAIL_SCENES[cocktail.id];
  const GlassComponent = !cocktail.glassUrl && window.COCKTAIL_GLASSES && window.COCKTAIL_GLASSES[cocktail.id];

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 10,
      background: `${theme.bg}`,
      display: "flex", flexDirection: "column",
      animation: "slideUp 0.32s cubic-bezier(0.4, 0, 0.2, 1) forwards",
      overflow: "hidden",
    }}>

      {/* ── Illustrated hero background ─────────────────────────── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 220,
        overflow: "hidden", zIndex: 0,
      }}>
        {SceneComponent ? <SceneComponent /> : cocktail.sceneUrl ? (
          <img src={cocktail.sceneUrl} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
        ) : null}
        {/* Gradient fade into dark body */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.0) 30%, ${theme.bg} 100%)`,
        }} />
      </div>

      {/* ── Top bar (floats over scene) ─────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 18px 0", flexShrink: 0, position: "relative", zIndex: 2,
      }}>
        <button onClick={onBack} style={{
          background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.18)",
          backdropFilter: "blur(8px)",
          borderRadius: 12, padding: "8px 14px 8px 10px",
          cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
          color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "inherit",
        }}>
          <Icon name="back" size={17} color="#fff" />
          Retour
        </button>
        <button onClick={toggleFav} style={{
          background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.18)",
          backdropFilter: "blur(8px)",
          borderRadius: 12, padding: "9px 11px", cursor: "pointer",
          display: "flex", alignItems: "center",
        }}>
          <Icon name={isFav ? "heartFill" : "heart"} size={20} color={isFav ? "#FF6B8A" : "#fff"} />
        </button>
        {isManager && (
          <button onClick={onEditCocktail} style={{
            background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
            borderRadius: 12, padding: "9px 11px", cursor: "pointer",
            display: "flex", alignItems: "center", fontSize: 16,
          }}>✏️</button>
        )}
      </div>

      {/* ── Hero text (overlaid on scene) ──────────────────────── */}
      <div style={{
        padding: "120px 22px 14px", flexShrink: 0,
        position: "relative", zIndex: 2,
      }}>
        {/* Color strip */}
        <div style={{
          height: 4, width: "38%", borderRadius: 2, marginBottom: 10,
          background: `linear-gradient(90deg, ${theme.accent}, ${theme.to})`,
        }} />
        <div style={{
          fontSize: 36, fontWeight: 900, color: "#fff",
          letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 4,
          textShadow: "0 2px 12px rgba(0,0,0,0.5)",
        }}>
          {cocktail.name}
        </div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13.5, marginBottom: 10, textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
          {cocktail.tagline}
        </div>
        {/* Meta row */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)", borderRadius: 10, padding: "4px 9px" }}>
            <Icon name="clock" size={12} color="rgba(255,255,255,0.6)" />
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11.5 }}>{cocktail.time}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)", borderRadius: 10, padding: "4px 9px" }}>
            <Icon name="glass" size={12} color="rgba(255,255,255,0.6)" />
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11.5 }}>{cocktail.glass}</span>
          </div>
          {cocktail.moods.map(m => (
            <span key={m} style={{
              background: `${theme.accent}30`, color: theme.accent,
              border: `1px solid ${theme.accent}45`,
              backdropFilter: "blur(4px)",
              fontSize: 10.5, fontWeight: 600, padding: "3px 9px", borderRadius: 20,
            }}>{m}</span>
          ))}
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────── */}
      <div style={{
        display: "flex", padding: "0 22px",
        borderBottom: "1px solid rgba(255,255,255,0.1)", flexShrink: 0,
        background: `${theme.bg}`, position: "relative", zIndex: 2,
      }}>
        {[["recette","Recette"], ["ingrédients","Ingrédients"], ["illustration","Illustration"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, padding: "10px 0",
            background: "none", border: "none", cursor: "pointer",
            color: tab === key ? "#fff" : "rgba(255,255,255,0.32)",
            fontSize: 12.5, fontWeight: tab === key ? 700 : 400,
            borderBottom: tab === key ? `2.5px solid ${theme.accent}` : "2.5px solid transparent",
            fontFamily: "inherit", transition: "all 0.18s",
          }}>{label}</button>
        ))}
      </div>

      {/* ── Tab content ─────────────────────────────────────────── */}
      <div style={{
        flex: 1, position: "relative", zIndex: 2,
        overflowY: tab === "illustration" ? "hidden" : "auto",
        background: `${theme.bg}`,
      }}>

        {/* RECETTE */}
        {tab === "recette" && (
          <div style={{ padding: "14px 22px 24px", display: "flex", flexDirection: "column", gap: 9 }}>
            {cocktail.steps.map((step, i) => (
              <div key={i} style={{
                display: "flex", gap: 13, alignItems: "flex-start",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14, padding: "13px 14px",
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                  background: `${theme.accent}25`, border: `1.5px solid ${theme.accent}55`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ color: theme.accent, fontSize: 12, fontWeight: 800 }}>{i + 1}</span>
                </div>
                <span style={{ color: "rgba(255,255,255,0.82)", fontSize: 13.5, lineHeight: 1.55, paddingTop: 3 }}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* INGRÉDIENTS */}
        {tab === "ingrédients" && (
          <div style={{ padding: "14px 22px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
            {cocktail.ingredients.map((ing, i) => {
              const bottle = APP_DATA.bottleMap[ing.id];
              const owned = isOwned(ing.id);
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: owned ? `${theme.accent}18` : "rgba(255,255,255,0.05)",
                  border: owned ? `1px solid ${theme.accent}35` : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14, padding: "12px 15px",
                }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
                    background: owned ? theme.accent : "rgba(255,255,255,0.15)",
                    boxShadow: owned ? `0 0 10px ${theme.accent}aa` : "none",
                  }} />
                  <span style={{
                    flex: 1, fontSize: 14, fontWeight: 500,
                    color: owned ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
                  }}>
                    {bottle?.name || ing.customName || ing.id}
                  </span>
                  <span style={{ color: owned ? theme.accent : "rgba(255,255,255,0.2)", fontSize: 13, fontWeight: 700 }}>
                    {ing.amount}
                  </span>
                  {owned && <Icon name="check" size={14} color={theme.accent} />}
                </div>
              );
            })}
            <div style={{ marginTop: 4, padding: "11px 15px", borderRadius: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)", marginBottom: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>Garniture</div>
              <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.65)" }}>{cocktail.garnish}</div>
            </div>
          </div>
        )}

        {/* ILLUSTRATION */}
        {tab === "illustration" && (
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            {/* Full scene as background */}
            {SceneComponent && (
              <div style={{ position: "absolute", inset: 0 }}>
                <SceneComponent />
              </div>
            )}
            {/* Darkening overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(180deg, rgba(0,0,0,0.25) 0%, ${theme.bg}CC 55%, ${theme.bg}EE 100%)`,
            }} />
            {/* Glass illustration centered */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 14, paddingBottom: 30,
            }}>
              {GlassComponent ? (
                <div style={{ filter:`drop-shadow(0 0 28px ${theme.accent}88) drop-shadow(0 8px 20px rgba(0,0,0,0.6))`, animation:"floatGlass 3.5s ease-in-out infinite" }}>
                  <GlassComponent />
                </div>
              ) : cocktail.glassUrl ? (
                <div style={{ filter:`drop-shadow(0 0 40px ${theme.accent}99) drop-shadow(0 8px 24px rgba(0,0,0,0.7))`, animation:"floatGlass 3.5s ease-in-out infinite" }}>
                  <img src={cocktail.glassUrl} alt={cocktail.name} style={{ height:200, maxWidth:160, objectFit:"contain", display:"block", borderRadius:12 }} />
                </div>
              ) : null}
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontSize: 24, fontWeight: 900, color: "#fff",
                  letterSpacing: "-0.03em", textShadow: `0 0 20px ${theme.accent}88`,
                }}>
                  {cocktail.name}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>
                  {cocktail.tagline}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Float glass animation */}
      <style>{`
        @keyframes floatGlass {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

// ─── Bottom Nav ───────────────────────────────────────────────────────────
const BottomNav = ({ activeTab, setActiveTab, counts, isManager, accent }) => {
  const navAccent = accent || "#A0C4FF";
  const managerTabs = [
    { id: 0, label: "Cocktails", icon: "cocktail" },
    { id: 1, label: "Faisables",  icon: "check"   },
    { id: 2, label: "Mon Bar",    icon: "bottle"  },
    { id: 3, label: "Favoris",    icon: "heart"   },
  ];
  const consumerTabs = [
    { id: 0, label: "Menu",      icon: "cocktail" },
    { id: 1, label: "Ce soir",   icon: "eye"      },
    { id: 2, label: "Favoris",   icon: "heart"    },
  ];
  const tabs = isManager ? managerTabs : consumerTabs;
  return (
    <div style={{
      display: "flex",
      background: "rgba(10, 10, 18, 0.96)",
      backdropFilter: "blur(24px)",
      borderTop: "1px solid rgba(255,255,255,0.07)",
      paddingBottom: 22, flexShrink: 0,
    }}>
      {tabs.map(t => {
        const isActive = activeTab === t.id;
        return (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            gap: 3, padding: "11px 0 4px",
            background: "none", border: "none", cursor: "pointer",
            transition: "color 0.2s", fontFamily: "inherit",
          }}>
            {/* Active glow dot */}
            {isActive && (
              <div style={{
                position: "absolute",
                width: 4, height: 4, borderRadius: "50%",
                background: navAccent,
                marginTop: -6,
                boxShadow: `0 0 8px ${navAccent}`,
              }} />
            )}
            <div style={{ position: "relative" }}>
              <Icon name={t.icon} size={22} color={isActive ? navAccent : "rgba(255,255,255,0.28)"} />
              {counts && counts[t.id] > 0 && (
                <div style={{
                  position: "absolute", top: -5, right: -7,
                  minWidth: 16, height: 16, borderRadius: 8, padding: "0 4px",
                  background: navAccent,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: "#0A0A18" }}>{counts[t.id]}</span>
                </div>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 400, color: isActive ? navAccent : "rgba(255,255,255,0.28)" }}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────
function CocktailApp({ tweaks }) {
  const { cocktails, bottles } = APP_DATA;

  const [activeTab, setActiveTab]               = React.useState(0);
  const [selectedCocktail, setSelectedCocktail] = React.useState(null);
  const [favorites, setFavorites]               = React.useState(new Set());
  const [ownedBottles, setOwnedBottles]         = React.useState(new Set());
  const [search, setSearch]                     = React.useState("");
  const [currentTheme, setCurrentTheme]         = React.useState(null);
  const [isManager, setIsManager]               = React.useState(true);
  const [availability, setAvailability]         = React.useState({});
  const [showPin, setShowPin]                   = React.useState(false);
  const [customBottles, setCustomBottles]       = React.useState([]);

  // ── Unified editable state ─────────────────────────────────────────────
  const [allBottles, setAllBottles]             = React.useState(() => [...APP_DATA.bottles]);
  const [allCocktailsList, setAllCocktailsList] = React.useState(() => [...APP_DATA.cocktails]);
  const [categories, setCategories]             = React.useState(() => [...new Set(APP_DATA.bottles.map(b => b.category))]);

  const [customCocktails, setCustomCocktails]     = React.useState([]);
  const [showAddCocktail, setShowAddCocktail]       = React.useState(false);
  const [editingBottle, setEditingBottle]           = React.useState(null);
  const [editingCocktail, setEditingCocktail]       = React.useState(null);
  const [showCategories, setShowCategories]         = React.useState(false);

  // ── CRUD handlers ──────────────────────────────────────────────────────
  const addBottle = React.useCallback(bottle => {
    setAllBottles(prev => [...prev, bottle]);
    setOwnedBottles(prev => { const n = new Set(prev); n.add(bottle.id); return n; });
    if (!categories.includes(bottle.category)) setCategories(prev => [...prev, bottle.category]);
  }, [categories]);

  const updateBottle = React.useCallback((id, updates) => {
    setAllBottles(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  }, []);

  const deleteBottle = React.useCallback(id => {
    setAllBottles(prev => prev.filter(b => b.id !== id));
    setOwnedBottles(prev => { const n = new Set(prev); n.delete(id); return n; });
    setEditingBottle(null);
  }, []);

  const addCocktail = React.useCallback(c => {
    setAllCocktailsList(prev => [...prev, c]);
  }, []);

  const updateCocktail = React.useCallback((id, updates) => {
    setAllCocktailsList(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    setEditingCocktail(null);
    setSelectedCocktail(prev => prev?.id === id ? { ...prev, ...updates } : prev);
  }, []);

  const deleteCocktail = React.useCallback(id => {
    setAllCocktailsList(prev => prev.filter(c => c.id !== id));
    setEditingCocktail(null);
    setSelectedCocktail(null);
    setCurrentTheme(null);
  }, []);

  const addCategory    = React.useCallback(name => setCategories(prev => [...prev, name]), []);
  const renameCategory = React.useCallback((old, next) => {
    setCategories(prev => prev.map(c => c === old ? next : c));
    setAllBottles(prev => prev.map(b => b.category === old ? { ...b, category: next } : b));
  }, []);
  const deleteCategory = React.useCallback(name => setCategories(prev => prev.filter(c => c !== name)), []);

  const allCocktails = React.useMemo(() => allCocktailsList, [allCocktailsList]);
  const allBottleMap = React.useMemo(() => Object.fromEntries(allBottles.map(b => [b.id, b])), [allBottles]);

  React.useEffect(() => {
    const init = new Set(bottles.filter(b => b.owned).map(b => b.id));
    setOwnedBottles(init);
  }, []);

  const enrichedCocktails = React.useMemo(() => allCocktails.map(c => {
    const missing = c.ingredients.filter(ing => !ownedBottles.has(ing.id));
    return { ...c, canMake: missing.length === 0, missingCount: missing.length,
      missingIngredients: missing.map(ing => allBottleMap[ing.id]?.name || ing.id) };
  }), [ownedBottles, allBottleMap]);

  const enrichedBottles = React.useMemo(() =>
    allBottles.map(b => ({ ...b, owned: ownedBottles.has(b.id) })), [allBottles, ownedBottles]);

  const handleSelect = React.useCallback(c => {
    setSelectedCocktail(c); setCurrentTheme(c.theme);
  }, []);

  const handleBack = React.useCallback(() => {
    setSelectedCocktail(null); setCurrentTheme(null);
  }, []);

  const toggleFav = React.useCallback(() => {
    if (!selectedCocktail) return;
    setFavorites(f => { const n = new Set(f); n.has(selectedCocktail.id) ? n.delete(selectedCocktail.id) : n.add(selectedCocktail.id); return n; });
  }, [selectedCocktail]);

  const toggleBottle = React.useCallback(id => {
    setOwnedBottles(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const toggleAvailability = React.useCallback(id => {
    setAvailability(prev => ({ ...prev, [id]: prev[id] === false ? true : false }));
  }, []);

  const handleTab = React.useCallback(tab => {
    setActiveTab(tab); setSelectedCocktail(null); setCurrentTheme(null); setSearch("");
  }, []);

  const switchToConsumer = React.useCallback(() => {
    setIsManager(false); setActiveTab(0); setSelectedCocktail(null); setCurrentTheme(null);
  }, []);

  const switchToManager = React.useCallback(() => {
    setIsManager(true); setShowPin(false); setActiveTab(0); setSelectedCocktail(null); setCurrentTheme(null);
  }, []);

  // Map consumer tab indices to manager-equivalent for shared screens
  const favTabIndex = isManager ? 3 : 2;

  const activePalette = PALETTES[tweaks?.palette || "\u00e9b\u00e8ne"] || PALETTES["\u00e9b\u00e8ne"];

  const appBg = currentTheme
    ? `linear-gradient(160deg, ${currentTheme.bg} 0%, ${currentTheme.from}99 60%, ${currentTheme.bg} 100%)`
    : `linear-gradient(160deg, ${activePalette.bg1} 0%, ${activePalette.bg2} 100%)`;

  return (
    <div style={{
      width: "100%", height: "100%", background: appBg,
      transition: "background 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
      display: "flex", flexDirection: "column",
      fontFamily: "'DM Sans', 'Inter', sans-serif",
      overflow: "hidden", position: "relative",
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.5,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      }} />

      {/* Add Cocktail Modal */}
      {showAddCocktail && <AddCocktailModal onAdd={addCocktail} onClose={() => setShowAddCocktail(false)} />}

      {/* Edit Cocktail Modal */}
      {editingCocktail && (
        <AddCocktailModal
          initialData={editingCocktail}
          onAdd={updated => updateCocktail(editingCocktail.id, updated)}
          onDelete={() => deleteCocktail(editingCocktail.id)}
          onClose={() => setEditingCocktail(null)} />
      )}

      {/* Edit Bottle Modal */}
      {editingBottle && (
        <EditBottleModal
          bottle={editingBottle}
          allCategories={categories}
          onSave={updates => { updateBottle(editingBottle.id, updates); setEditingBottle(null); }}
          onDelete={() => deleteBottle(editingBottle.id)}
          onClose={() => setEditingBottle(null)} />
      )}

      {/* Manage Categories Modal */}
      {showCategories && (
        <ManageCategoriesModal
          categories={categories}
          bottlesByCategory={Object.fromEntries(categories.map(cat => [cat, allBottles.filter(b => b.category === cat)]))}
          onAdd={addCategory}
          onRename={renameCategory}
          onDelete={deleteCategory}
          onClose={() => setShowCategories(false)} />
      )}
      {showPin && <PinModal onSuccess={switchToManager} onClose={() => setShowPin(false)} />}

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative", zIndex: 1 }}>
        {!selectedCocktail && activeTab === 0 && (
          <CatalogueScreen cocktails={enrichedCocktails} onSelect={handleSelect}
            search={search} setSearch={setSearch}
            isManager={isManager} availability={availability}
            onToggleAvailable={toggleAvailability}
            onSwitchToConsumer={switchToConsumer}
            onRequestManagerMode={() => setShowPin(true)}
            onAddCocktail={() => setShowAddCocktail(true)}
            palette={activePalette} />
        )}
        {/* Manager tabs */}
        {isManager && !selectedCocktail && activeTab === 1 && (
          <FaisablesScreen cocktails={enrichedCocktails} onSelect={handleSelect} />
        )}
        {isManager && !selectedCocktail && activeTab === 2 && (
          <BarScreen bottles={enrichedBottles} ownedBottles={ownedBottles} toggleBottle={toggleBottle}
            onAddBottle={addBottle} isManager={isManager}
            allCategories={categories}
            onEditBottle={setEditingBottle}
            onManageCategories={() => setShowCategories(true)} />
        )}
        {/* Consumer tab 1: Ce soir */}
        {!isManager && !selectedCocktail && activeTab === 1 && (
          <ConsumerCeSoirScreen cocktails={enrichedCocktails} onSelect={handleSelect} availability={availability} />
        )}
        {/* Favoris (tab 3 manager / tab 2 consumer) */}
        {!selectedCocktail && activeTab === favTabIndex && (
          <FavorisScreen cocktails={enrichedCocktails} favorites={favorites} onSelect={handleSelect} />
        )}
        {selectedCocktail && (
          <DetailScreen cocktail={selectedCocktail} onBack={handleBack}
            isFav={favorites.has(selectedCocktail.id)} toggleFav={toggleFav}
            ownedBottles={ownedBottles}
            isManager={isManager}
            onEditCocktail={() => setEditingCocktail(selectedCocktail)} />
        )}
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <BottomNav
          activeTab={activeTab} setActiveTab={handleTab} isManager={isManager}
          accent={activePalette.accent}
          counts={isManager
            ? { 1: enrichedCocktails.filter(c => c.canMake).length, 3: favorites.size }
            : { 2: favorites.size }}
        />
      </div>
    </div>
  );
}

Object.assign(window, { CocktailApp });
