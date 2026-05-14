// manage-modals.jsx — EditBottleModal + ManageCategoriesModal

const CAT_COLORS = {
  "Tequila":"#D4A017","Vodka":"#90CAF9","Rhum":"#F5DEB3","Gin":"#B2EBF2",
  "Whiskey":"#C8963C","Cognac":"#8B4513","Liqueur":"#FF7043","Vermouth":"#8B1C1C",
  "Amer":"#C4180A","Bitters":"#7B3F00","Pétillant":"#F5DEB3","Vin":"#722F37",
  "Jus":"#FFF176","Soda":"#E3F2FD","Sirop":"#FFE0B2","Autre":"#9E9E9E",
};
const getCatColor = (cat, fallback = "#9E9E9E") => CAT_COLORS[cat] || fallback;

// ─── Shared style helpers ─────────────────────────────────────────────────
const mInputStyle = {
  width:"100%", boxSizing:"border-box",
  background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)",
  borderRadius:12, padding:"11px 14px", color:"#fff", fontSize:14,
  fontFamily:"inherit", outline:"none",
};
const MLabel = ({children}) => (
  <div style={{fontSize:10.5,fontWeight:700,letterSpacing:"0.08em",color:"rgba(255,255,255,0.35)",textTransform:"uppercase",marginBottom:7}}>
    {children}
  </div>
);
const ModalWrap = ({onClose, children}) => (
  <div style={{position:"absolute",inset:0,zIndex:160,background:"rgba(0,0,0,0.72)",backdropFilter:"blur(12px)",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}
    onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{background:"#13131F",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"24px 24px 0 0",maxHeight:"88%",display:"flex",flexDirection:"column",animation:"slideUpModal 0.28s cubic-bezier(0.4,0,0.2,1)"}}>
      <div style={{display:"flex",justifyContent:"center",padding:"12px 0 2px",flexShrink:0}}>
        <div style={{width:36,height:4,borderRadius:2,background:"rgba(255,255,255,0.18)"}}/>
      </div>
      {children}
    </div>
  </div>
);

// ─── Edit Bottle Modal ────────────────────────────────────────────────────
function EditBottleModal({ bottle, allCategories, onSave, onDelete, onClose }) {
  const [name, setName]       = React.useState(bottle.name);
  const [category, setCategory] = React.useState(bottle.category);
  const [pantry, setPantry]   = React.useState(!!bottle.pantry);
  const [confirm, setConfirm] = React.useState(false);
  const canSave = name.trim() && category;

  return (
    <ModalWrap onClose={onClose}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 20px 14px",flexShrink:0}}>
        <div style={{fontSize:18,fontWeight:800,color:"#fff",letterSpacing:"-0.02em"}}>Modifier la bouteille</div>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.07)",border:"none",borderRadius:20,padding:"5px 12px",color:"rgba(255,255,255,0.45)",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Annuler</button>
      </div>

      {/* Form */}
      <div style={{flex:1,overflowY:"auto",padding:"0 20px",display:"flex",flexDirection:"column",gap:14}}>
        <div>
          <MLabel>Nom</MLabel>
          <input value={name} onChange={e=>setName(e.target.value)} style={mInputStyle}/>
        </div>

        <div>
          <MLabel>Catégorie</MLabel>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {allCategories.map(cat=>(
              <button key={cat} onClick={()=>setCategory(cat)} style={{
                padding:"5px 12px",borderRadius:20,cursor:"pointer",fontFamily:"inherit",
                background:category===cat?`${getCatColor(cat)}28`:"rgba(255,255,255,0.05)",
                border:category===cat?`1.5px solid ${getCatColor(cat)}70`:"1.5px solid rgba(255,255,255,0.09)",
                color:category===cat?getCatColor(cat):"rgba(255,255,255,0.45)",
                fontSize:12,fontWeight:category===cat?700:400,transition:"all 0.14s",
              }}>{cat}</button>
            ))}
          </div>
        </div>

        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:4}}>
          <div>
            <div style={{fontSize:13.5,fontWeight:600,color:"rgba(255,255,255,0.75)"}}>Toujours disponible</div>
            <div style={{fontSize:11.5,color:"rgba(255,255,255,0.3)",marginTop:1}}>Ingrédient de base</div>
          </div>
          <button onClick={()=>setPantry(p=>!p)} style={{width:44,height:26,borderRadius:13,cursor:"pointer",border:"none",background:pantry?"#74C69D":"rgba(255,255,255,0.1)",position:"relative",transition:"background 0.2s"}}>
            <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:pantry?21:3,transition:"left 0.2s"}}/>
          </button>
        </div>
      </div>

      {/* Actions */}
      <div style={{padding:"14px 20px 30px",flexShrink:0,display:"flex",flexDirection:"column",gap:8,borderTop:"1px solid rgba(255,255,255,0.07)"}}>
        {confirm ? (
          <>
            <div style={{fontSize:12.5,color:"rgba(255,255,255,0.5)",textAlign:"center",marginBottom:2}}>Confirmer la suppression ?</div>
            <button onClick={onDelete} style={{padding:13,border:"none",borderRadius:14,background:"#C0392B",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
              Supprimer définitivement
            </button>
            <button onClick={()=>setConfirm(false)} style={{padding:11,border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,background:"transparent",color:"rgba(255,255,255,0.45)",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
              Annuler
            </button>
          </>
        ) : (
          <>
            <button onClick={()=>canSave&&onSave({name:name.trim(),category,color:getCatColor(category,bottle.color),pantry})}
              disabled={!canSave} style={{padding:13,border:"none",borderRadius:14,background:canSave?"linear-gradient(130deg,#52B788,#A0C4FF)":"rgba(255,255,255,0.07)",color:canSave?"#fff":"rgba(255,255,255,0.2)",fontSize:14,fontWeight:800,cursor:canSave?"pointer":"default",fontFamily:"inherit",transition:"all 0.2s"}}>
              Enregistrer
            </button>
            <button onClick={()=>setConfirm(true)} style={{padding:11,border:"1px solid rgba(255,60,60,0.25)",borderRadius:14,background:"rgba(255,60,60,0.07)",color:"rgba(255,100,100,0.65)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
              Supprimer cette bouteille
            </button>
          </>
        )}
      </div>
    </ModalWrap>
  );
}

// ─── Manage Categories Modal ──────────────────────────────────────────────
function ManageCategoriesModal({ categories, bottlesByCategory, onAdd, onRename, onDelete, onClose }) {
  const [editIdx, setEditIdx] = React.useState(null);
  const [editVal, setEditVal] = React.useState("");
  const [adding, setAdding]   = React.useState(false);
  const [newCat, setNewCat]   = React.useState("");

  const saveEdit = (idx) => {
    if (editVal.trim() && editVal.trim() !== categories[idx]) onRename(categories[idx], editVal.trim());
    setEditIdx(null);
  };

  return (
    <ModalWrap onClose={onClose}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 20px 12px",flexShrink:0}}>
        <div style={{fontSize:18,fontWeight:800,color:"#fff",letterSpacing:"-0.02em"}}>Catégories</div>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.07)",border:"none",borderRadius:20,padding:"5px 12px",color:"rgba(255,255,255,0.45)",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Fermer</button>
      </div>

      {/* List */}
      <div style={{flex:1,overflowY:"auto",padding:"0 20px 24px",display:"flex",flexDirection:"column",gap:7}}>
        {categories.map((cat,i) => {
          const count = (bottlesByCategory[cat]||[]).length;
          const color = getCatColor(cat);
          return (
            <div key={cat} style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"10px 12px"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:color,flexShrink:0}}/>
              {editIdx===i ? (
                <>
                  <input value={editVal} onChange={e=>setEditVal(e.target.value)} autoFocus
                    onKeyDown={e=>{if(e.key==="Enter")saveEdit(i);if(e.key==="Escape")setEditIdx(null);}}
                    style={{flex:1,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,padding:"5px 10px",color:"#fff",fontSize:13,fontFamily:"inherit",outline:"none"}}/>
                  <button onClick={()=>saveEdit(i)} style={{background:"#52B788",border:"none",borderRadius:8,padding:"5px 12px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>OK</button>
                  <button onClick={()=>setEditIdx(null)} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.3)",fontSize:16,cursor:"pointer",lineHeight:1}}>✕</button>
                </>
              ) : (
                <>
                  <span style={{flex:1,fontSize:13.5,fontWeight:500,color:"rgba(255,255,255,0.85)"}}>{cat}</span>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.28)",marginRight:4}}>{count}</span>
                  <button onClick={()=>{setEditIdx(i);setEditVal(cat);}} style={{background:"rgba(255,255,255,0.07)",border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",color:"rgba(255,255,255,0.5)",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✏️</button>
                  <button onClick={()=>count===0&&onDelete(cat)} title={count>0?"Retirez d'abord les bouteilles":""} style={{background:count>0?"transparent":"rgba(255,60,60,0.08)",border:"none",borderRadius:8,width:28,height:28,cursor:count>0?"not-allowed":"pointer",color:count>0?"rgba(255,255,255,0.12)":"rgba(255,100,100,0.65)",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>🗑️</button>
                </>
              )}
            </div>
          );
        })}

        {/* Add category */}
        {adding ? (
          <div style={{display:"flex",gap:8,alignItems:"center",background:"rgba(255,255,255,0.04)",border:"1px dashed rgba(255,255,255,0.15)",borderRadius:12,padding:"10px 12px"}}>
            <input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="Nom de la catégorie" autoFocus
              onKeyDown={e=>{if(e.key==="Enter"&&newCat.trim()){onAdd(newCat.trim());setNewCat("");setAdding(false);}if(e.key==="Escape"){setAdding(false);}}}
              style={{flex:1,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.18)",borderRadius:8,padding:"6px 10px",color:"#fff",fontSize:13,fontFamily:"inherit",outline:"none"}}/>
            <button onClick={()=>{if(newCat.trim()){onAdd(newCat.trim());setNewCat("");setAdding(false);}}} style={{background:"#52B788",border:"none",borderRadius:8,padding:"5px 14px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>OK</button>
            <button onClick={()=>{setAdding(false);setNewCat("");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.3)",fontSize:16,cursor:"pointer"}}>✕</button>
          </div>
        ) : (
          <button onClick={()=>setAdding(true)} style={{background:"rgba(255,255,255,0.04)",border:"1px dashed rgba(255,255,255,0.15)",borderRadius:12,padding:"11px",color:"rgba(255,255,255,0.38)",fontSize:12.5,cursor:"pointer",fontFamily:"inherit",width:"100%"}}>
            + Nouvelle catégorie
          </button>
        )}
      </div>
    </ModalWrap>
  );
}

Object.assign(window, { EditBottleModal, ManageCategoriesModal, getCatColor });
