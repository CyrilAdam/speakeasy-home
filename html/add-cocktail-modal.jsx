// add-cocktail-modal.jsx
// Formulaire d'ajout de cocktail avec génération IA via Pollinations.ai + Claude

const MOOD_OPTIONS = ["festif","été","classique","amer","frais","élégant","fort","pétillant","herbacé","moderne","apéro","coloré","shot","léger","maison"];
const GLASS_OPTIONS = ["Verre à Margarita","Old Fashioned","Verre Highball","Verre à martini","Coupe","Verre à vin","Verre à shot","Mug en cuivre","Autre"];
const DIFF_LABELS   = { 1:"Facile", 2:"Moyen", 3:"Expert" };

const ALabel = ({ children }) => (
  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 7 }}>
    {children}
  </div>
);
const aInputStyle = {
  width: "100%", boxSizing: "border-box",
  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12, padding: "11px 14px", color: "#fff", fontSize: 14,
  fontFamily: "inherit", outline: "none",
};

// Simple hash → fallback theme
function hashTheme(name) {
  const h = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const palettes = [
    { bg:"#071A0F", from:"#1B5E35", mid:"#2D9E5A", to:"#52B788", accent:"#74C69D", text:"#D8F3DC" },
    { bg:"#190505", from:"#7B1D1D", mid:"#C0392B", to:"#E74C3C", accent:"#FF6B6B", text:"#FDEDEC" },
    { bg:"#180900", from:"#7B3F00", mid:"#A0522D", to:"#D2691E", accent:"#E8A87C", text:"#FFF3E0" },
    { bg:"#150010", from:"#880035", mid:"#C2185B", to:"#E91E8C", accent:"#F48FB1", text:"#FCE4EC" },
    { bg:"#081200", from:"#2D5016", mid:"#5A8000", to:"#84A000", accent:"#A8D500", text:"#F0FFC0" },
    { bg:"#150900", from:"#6B3000", mid:"#B87800", to:"#E8A000", accent:"#FFB830", text:"#FFF8E0" },
  ];
  return palettes[h % palettes.length];
}

function AddCocktailModal({ onAdd, onDelete, onClose, initialData }) {
  const editMode = !!initialData;
  const [name, setName]         = React.useState(initialData?.name || "");
  const [tagline, setTagline]   = React.useState(initialData?.tagline || "");
  const [glass, setGlass]       = React.useState(initialData?.glass || "Verre à cocktail");
  const [moods, setMoods]       = React.useState(initialData?.moods || []);
  const [difficulty, setDiff]   = React.useState(initialData?.difficulty || 1);
  const [ingredients, setIngs]  = React.useState(
    initialData?.ingredients?.map(i=>({name:i.customName||i.name||APP_DATA.bottleMap[i.id]?.name||"",amount:i.amount||""})) || [{name:"",amount:""}]);
  const [steps, setSteps]       = React.useState(initialData?.steps || [""]);
  const [generating, setGen]    = React.useState(false);
  const [genStatus, setStatus]  = React.useState("");
  const [sceneUrl, setScene]    = React.useState(initialData?.sceneUrl || null);
  const [glassUrl, setGlass_]   = React.useState(initialData?.glassUrl || null);
  const [theme, setTheme]       = React.useState(initialData?.theme || null);
  const [confirm, setConfirm]   = React.useState(false);

  const toggleMood = m => setMoods(ms => ms.includes(m) ? ms.filter(x => x !== m) : [...ms, m]);
  const updIng  = (i, f, v) => setIngs(arr => arr.map((it, j) => j === i ? { ...it, [f]: v } : it));
  const addIng  = () => setIngs(a => [...a, { name: "", amount: "" }]);
  const rmIng   = i  => setIngs(a => a.filter((_, j) => j !== i));
  const updStep = (i, v) => setSteps(a => a.map((s, j) => j === i ? v : s));
  const addStep = () => setSteps(a => [...a, ""]);
  const rmStep  = i  => setSteps(a => a.filter((_, j) => j !== i));

  const generate = async () => {
    if (!name.trim()) return;
    setGen(true);

    const ingList = ingredients.filter(x => x.name).map(x => x.name).join(", ");
    const seed1 = Math.floor(Math.random() * 9999);
    const seed2 = seed1 + 500;

    // Scene image via Pollinations.ai
    setStatus("Scène en cours…");
    const sp = encodeURIComponent(`${name} cocktail bar atmosphere moody cinematic dark lighting beautiful photorealistic no text no watermark`);
    setScene(`https://image.pollinations.ai/prompt/${sp}?width=390&height=260&nologo=true&model=flux-schnell&seed=${seed1}`);

    // Glass image
    setStatus("Illustration du verre…");
    const gp = encodeURIComponent(`${name} cocktail glass professional photography black background studio lighting beautiful garnish bokeh`);
    setGlass_(`https://image.pollinations.ai/prompt/${gp}?width=300&height=420&nologo=true&model=flux-schnell&seed=${seed2}`);

    // Color palette via Claude
    setStatus("Palette de couleurs…");
    try {
      const res = await window.claude.complete({
        messages: [{
          role: "user",
          content: `Cocktail "${name}" (ingrédients: ${ingList || "variés"}). Génère un thème de couleurs sombre et riche. Réponds UNIQUEMENT en JSON valide sans markdown ni explication: {"bg":"#hex","from":"#hex","mid":"#hex","to":"#hex","accent":"#hex","text":"#hex"}. bg très sombre (#0x0x0x), from/mid sombres mais colorés, to et accent vibrants, text clair lisible.`,
        }],
      });
      const m = res.match(/\{[^}]+\}/);
      setTheme(m ? JSON.parse(m[0]) : hashTheme(name));
    } catch (_) {
      setTheme(hashTheme(name));
    }

    setGen(false);
    setStatus("done");
  };

  const canGenerate = name.trim().length >= 2;
  const canSubmit   = canGenerate && !!theme;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const t = theme || hashTheme(name);
    onAdd({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      tagline: tagline.trim() || "Mon cocktail maison",
      moods: moods.length ? moods : ["maison"],
      difficulty,
      time: "? min",
      glass,
      garnish: "À votre goût",
      theme: t,
      ingredients: ingredients.filter(x => x.name).map((x, i) => ({ id: `ci-${Date.now()}-${i}`, customName: x.name, amount: x.amount })),
      steps: steps.filter(s => s.trim()),
      sceneUrl: sceneUrl || null,
      glassUrl: glassUrl || null,
      custom: true,
    });
    onClose();
  };

  const Row = ({ children }) => (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 7 }}>{children}</div>
  );

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 155, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#13131F", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "24px 24px 0 0", maxHeight: "90%", display: "flex", flexDirection: "column",
        animation: "slideUpModal 0.28s cubic-bezier(0.4,0,0.2,1)",
      }}>

        {/* Handle + title */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 2px" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.18)" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px 12px" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{editMode ? "Modifier le cocktail" : "Nouveau cocktail"}</div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 20, padding: "5px 12px", color: "rgba(255,255,255,0.45)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Annuler</button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 20px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Nom + tagline */}
          <div>
            <ALabel>Nom *</ALabel>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex : Jungle Bird…" autoFocus style={aInputStyle} />
            <div style={{ marginTop: 7 }}>
              <input value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Tagline (optionnel)" style={{ ...aInputStyle, fontSize: 13 }} />
            </div>
          </div>

          {/* Ingrédients */}
          <div>
            <ALabel>Ingrédients</ALabel>
            {ingredients.map((ing, i) => (
              <Row key={i}>
                <input value={ing.name} onChange={e => updIng(i, "name", e.target.value)} placeholder="Campari, rhum…" style={{ ...aInputStyle, flex: 2, padding: "9px 12px", fontSize: 13 }} />
                <input value={ing.amount} onChange={e => updIng(i, "amount", e.target.value)} placeholder="3 cl" style={{ ...aInputStyle, flex: 1, padding: "9px 10px", fontSize: 13 }} />
                {ingredients.length > 1 && (
                  <button onClick={() => rmIng(i)} style={{ background: "rgba(255,60,60,0.1)", border: "1px solid rgba(255,60,60,0.2)", borderRadius: 8, width: 30, height: 30, cursor: "pointer", color: "rgba(255,100,100,0.7)", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "inherit" }}>×</button>
                )}
              </Row>
            ))}
            <button onClick={addIng} style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.18)", borderRadius: 12, padding: "7px 14px", color: "rgba(255,255,255,0.35)", fontSize: 12, cursor: "pointer", fontFamily: "inherit", width: "100%" }}>+ ingrédient</button>
          </div>

          {/* Étapes */}
          <div>
            <ALabel>Étapes</ALabel>
            {steps.map((st, i) => (
              <Row key={i} style={{ alignItems: "flex-start" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(160,196,255,0.12)", border: "1px solid rgba(160,196,255,0.28)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 9 }}>
                  <span style={{ color: "#A0C4FF", fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                </div>
                <input value={st} onChange={e => updStep(i, e.target.value)} placeholder={`Étape ${i + 1}…`} style={{ ...aInputStyle, flex: 1, padding: "9px 12px", fontSize: 13 }} />
                {steps.length > 1 && (
                  <button onClick={() => rmStep(i)} style={{ background: "rgba(255,60,60,0.1)", border: "1px solid rgba(255,60,60,0.2)", borderRadius: 8, width: 30, height: 30, cursor: "pointer", color: "rgba(255,100,100,0.7)", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 4, fontFamily: "inherit" }}>×</button>
                )}
              </Row>
            ))}
            <button onClick={addStep} style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.18)", borderRadius: 12, padding: "7px 14px", color: "rgba(255,255,255,0.35)", fontSize: 12, cursor: "pointer", fontFamily: "inherit", width: "100%" }}>+ étape</button>
          </div>

          {/* Verre */}
          <div>
            <ALabel>Verre</ALabel>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {GLASS_OPTIONS.map(g => (
                <button key={g} onClick={() => setGlass(g)} style={{ padding: "5px 11px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit", fontSize: 11.5, background: glass === g ? "rgba(160,196,255,0.14)" : "rgba(255,255,255,0.04)", border: glass === g ? "1.5px solid rgba(160,196,255,0.5)" : "1.5px solid rgba(255,255,255,0.09)", color: glass === g ? "#A0C4FF" : "rgba(255,255,255,0.4)", fontWeight: glass === g ? 700 : 400 }}>{g}</button>
              ))}
            </div>
          </div>

          {/* Humeurs */}
          <div>
            <ALabel>Tags / humeurs</ALabel>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {MOOD_OPTIONS.map(m => (
                <button key={m} onClick={() => toggleMood(m)} style={{ padding: "5px 11px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit", fontSize: 11.5, background: moods.includes(m) ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.04)", border: moods.includes(m) ? "1.5px solid rgba(255,255,255,0.45)" : "1.5px solid rgba(255,255,255,0.09)", color: moods.includes(m) ? "#fff" : "rgba(255,255,255,0.38)", fontWeight: moods.includes(m) ? 700 : 400 }}>{m}</button>
              ))}
            </div>
          </div>

          {/* Difficulté */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <ALabel>Difficulté</ALabel>
            <div style={{ display: "flex", gap: 6, marginBottom: 7 }}>
              {[1,2,3].map(d => (
                <button key={d} onClick={() => setDiff(d)} style={{ padding: "5px 13px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit", fontSize: 12, background: difficulty === d ? "rgba(160,196,255,0.14)" : "rgba(255,255,255,0.04)", border: difficulty === d ? "1.5px solid rgba(160,196,255,0.5)" : "1.5px solid rgba(255,255,255,0.09)", color: difficulty === d ? "#A0C4FF" : "rgba(255,255,255,0.4)", fontWeight: difficulty === d ? 700 : 400 }}>{DIFF_LABELS[d]}</button>
              ))}
            </div>
          </div>

          {/* IA Generation */}
          <div style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 18, padding: 14, marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: sceneUrl || theme ? 12 : 0 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#C4B5FD" }}>Visuels IA</div>
                <div style={{ fontSize: 11, color: "rgba(196,181,253,0.45)", marginTop: 1 }}>Pollinations.ai + Claude</div>
              </div>
              <button onClick={generate} disabled={!canGenerate || generating} style={{
                padding: "8px 16px", borderRadius: 20, border: "none", cursor: canGenerate && !generating ? "pointer" : "default", fontFamily: "inherit",
                background: canGenerate && !generating ? "linear-gradient(130deg,#7C3AED,#8B5CF6)" : "rgba(255,255,255,0.06)",
                color: canGenerate && !generating ? "#fff" : "rgba(255,255,255,0.2)",
                fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 5, transition: "all 0.2s",
              }}>
                <span style={{ animation: generating ? "spin 1s linear infinite" : "none", display: "inline-block" }}>✦</span>
                {generating ? genStatus : "Générer"}
              </button>
            </div>
            {/* Previews */}
            {(sceneUrl || glassUrl || theme) && (
              <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                {sceneUrl && (
                  <div style={{ flex: 2, borderRadius: 10, overflow: "hidden", background: "rgba(255,255,255,0.04)", minHeight: 70 }}>
                    <img src={sceneUrl} alt="" style={{ width: "100%", height: 80, objectFit: "cover", display: "block" }}
                      onError={e => e.target.parentElement.style.display = "none"} />
                  </div>
                )}
                {glassUrl && (
                  <div style={{ flex: 1, borderRadius: 10, overflow: "hidden", background: "rgba(255,255,255,0.04)", minHeight: 70 }}>
                    <img src={glassUrl} alt="" style={{ width: "100%", height: 80, objectFit: "cover", display: "block" }}
                      onError={e => e.target.parentElement.style.display = "none"} />
                  </div>
                )}
                {theme && (
                  <div style={{ flex: "0 0 36px", display: "flex", flexDirection: "column", gap: 3, borderRadius: 10, overflow: "hidden" }}>
                    {[theme.bg, theme.from, theme.mid, theme.to, theme.accent].map((c, i) => (
                      <div key={i} style={{ flex: 1, background: c, borderRadius: i === 0 ? "10px 10px 0 0" : i === 4 ? "0 0 10px 10px" : 0 }} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Submit + delete */}
        <div style={{ padding: "12px 20px 30px", flexShrink: 0, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: 8 }}>
          {confirm ? (
            <>
              <div style={{fontSize:12.5,color:"rgba(255,255,255,0.5)",textAlign:"center",marginBottom:2}}>Supprimer ce cocktail ?</div>
              <button onClick={onDelete} style={{padding:13,border:"none",borderRadius:14,background:"#C0392B",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>Supprimer définitivement</button>
              <button onClick={()=>setConfirm(false)} style={{padding:11,border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,background:"transparent",color:"rgba(255,255,255,0.45)",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Annuler</button>
            </>
          ) : (
            <>
              <button onClick={handleSubmit} disabled={!canSubmit} style={{
                width: "100%", padding: 14, border: "none", borderRadius: 16, fontFamily: "inherit",
                background: canSubmit ? "linear-gradient(130deg,#52B788,#A0C4FF)" : "rgba(255,255,255,0.07)",
                color: canSubmit ? "#fff" : "rgba(255,255,255,0.2)",
                fontSize: 15, fontWeight: 800, cursor: canSubmit ? "pointer" : "default", transition: "all 0.2s",
              }}>
                {canSubmit ? (editMode ? "Enregistrer les modifications" : "Créer le cocktail") : "Générer les visuels d'abord ✨"}
              </button>
              {editMode && onDelete && (
                <button onClick={()=>setConfirm(true)} style={{padding:11,border:"1px solid rgba(255,60,60,0.25)",borderRadius:14,background:"rgba(255,60,60,0.07)",color:"rgba(255,100,100,0.65)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                  Supprimer ce cocktail
                </button>
              )}
            </>
          )}
        </div>

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

Object.assign(window, { AddCocktailModal });
