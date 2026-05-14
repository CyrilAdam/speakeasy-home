import { useState } from 'react';
import type { Bottle } from '../types.ts';
import { BOTTLE_CATEGORIES } from '../types.ts';

interface EditBottleModalProps {
  bottle: Bottle;
  onSave: (data: Partial<Omit<Bottle, 'id'>>) => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
}

const getCatColor = (cat: string) => BOTTLE_CATEGORIES.find(c => c.label === cat)?.color ?? '#9E9E9E';

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12, padding: '11px 14px', color: '#fff', fontSize: 14,
  fontFamily: 'inherit', outline: 'none',
};

export const EditBottleModal = ({ bottle, onSave, onDelete, onClose }: EditBottleModalProps) => {
  const [name, setName]         = useState(bottle.name);
  const [category, setCategory] = useState(bottle.category);
  const [pantry, setPantry]     = useState(!!bottle.pantry);
  const [confirm, setConfirm]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const canSave = name.trim() && category;

  const categories = [...new Set([...BOTTLE_CATEGORIES.map(c => c.label)])];

  const handleSave = async () => {
    if (!canSave) return;
    setLoading(true);
    await onSave({ name: name.trim(), category, color: getCatColor(category), pantry });
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    await onDelete();
    setLoading(false);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 160, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#13131F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px 24px 0 0', maxHeight: '88%', display: 'flex', flexDirection: 'column', animation: 'slideUpModal 0.28s cubic-bezier(0.4,0,0.2,1)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 2px', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.18)' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 14px', flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Modifier la bouteille</div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 20, padding: '5px 12px', color: 'rgba(255,255,255,0.45)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Annuler</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 7 }}>Nom</div>
            <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 7 }}>Catégorie</div>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)} style={{ padding: '5px 12px', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit', background: category === cat ? `${getCatColor(cat)}28` : 'rgba(255,255,255,0.05)', border: category === cat ? `1.5px solid ${getCatColor(cat)}70` : '1.5px solid rgba(255,255,255,0.09)', color: category === cat ? getCatColor(cat) : 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: category === cat ? 700 : 400, transition: 'all 0.14s' }}>{cat}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 4 }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>Toujours disponible</div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>Ingrédient de base</div>
            </div>
            <button onClick={() => setPantry(p => !p)} style={{ width: 44, height: 26, borderRadius: 13, cursor: 'pointer', border: 'none', background: pantry ? '#74C69D' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background 0.2s' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: pantry ? 21 : 3, transition: 'left 0.2s' }} />
            </button>
          </div>
        </div>

        <div style={{ padding: '14px 20px 30px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {confirm ? (
            <>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 2 }}>Confirmer la suppression ?</div>
              <button onClick={handleDelete} disabled={loading} style={{ padding: 13, border: 'none', borderRadius: 14, background: '#C0392B', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>Supprimer définitivement</button>
              <button onClick={() => setConfirm(false)} style={{ padding: 11, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, background: 'transparent', color: 'rgba(255,255,255,0.45)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Annuler</button>
            </>
          ) : (
            <>
              <button onClick={handleSave} disabled={!canSave || loading} style={{ padding: 13, border: 'none', borderRadius: 14, background: canSave ? 'linear-gradient(130deg,#52B788,#A0C4FF)' : 'rgba(255,255,255,0.07)', color: canSave ? '#fff' : 'rgba(255,255,255,0.2)', fontSize: 14, fontWeight: 800, cursor: canSave ? 'pointer' : 'default', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                {loading ? 'Enregistrement…' : 'Enregistrer'}
              </button>
              <button onClick={() => setConfirm(true)} style={{ padding: 11, border: '1px solid rgba(255,60,60,0.25)', borderRadius: 14, background: 'rgba(255,60,60,0.07)', color: 'rgba(255,100,100,0.65)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Supprimer cette bouteille
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
