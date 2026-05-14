import { useState } from 'react';
import { BOTTLE_CATEGORIES } from '../types.ts';

interface AddBottleModalProps {
  onAdd: (data: { id: string; name: string; category: string; color: string; owned: boolean; pantry?: boolean }) => Promise<void>;
  onClose: () => void;
}

export const AddBottleModal = ({ onAdd, onClose }: AddBottleModalProps) => {
  const [name, setName]         = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [pantry, setPantry]     = useState(false);
  const [loading, setLoading]   = useState(false);

  const selectedCat = BOTTLE_CATEGORIES.find(c => c.label === category);
  const canSubmit = name.trim() && category;

  const handleAdd = async () => {
    if (!canSubmit || !selectedCat) return;
    setLoading(true);
    await onAdd({ id: `b-${Date.now()}`, name: name.trim(), category: selectedCat.label, color: selectedCat.color, owned: true, pantry });
    setLoading(false);
    onClose();
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 150, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#13131F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px 24px 0 0', paddingBottom: 32, animation: 'slideUpModal 0.28s cubic-bezier(0.4,0,0.2,1)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.18)' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 14px' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Nouvelle bouteille</div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 20, padding: '5px 12px', color: 'rgba(255,255,255,0.45)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Annuler</button>
        </div>

        <div style={{ padding: '0 20px 14px' }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 7 }}>Nom</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex : Hendrick's Gin…" autoFocus
            style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '12px 14px', color: '#fff', fontSize: 16, fontFamily: 'inherit', outline: 'none' }}
          />
        </div>

        <div style={{ padding: '0 20px 14px' }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 7 }}>Catégorie</div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {BOTTLE_CATEGORIES.map(cat => (
              <button key={cat.label} onClick={() => setCategory(cat.label)} style={{ padding: '5px 12px', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit', background: category === cat.label ? `${cat.color}28` : 'rgba(255,255,255,0.05)', border: category === cat.label ? `1.5px solid ${cat.color}70` : '1.5px solid rgba(255,255,255,0.09)', color: category === cat.label ? cat.color : 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: category === cat.label ? 700 : 400, transition: 'all 0.14s', display: 'flex', alignItems: 'center', gap: 4 }}>
                {category === cat.label && <div style={{ width: 5, height: 5, borderRadius: '50%', background: cat.color }} />}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 20px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>Toujours disponible</div>
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>Ingrédient de base (jus, sirop…)</div>
          </div>
          <button onClick={() => setPantry(p => !p)} style={{ width: 44, height: 26, borderRadius: 13, cursor: 'pointer', border: 'none', background: pantry ? '#74C69D' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background 0.2s' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: pantry ? 21 : 3, transition: 'left 0.2s' }} />
          </button>
        </div>

        <div style={{ padding: '0 20px' }}>
          <button onClick={handleAdd} disabled={!canSubmit || loading} style={{ width: '100%', padding: 15, border: 'none', borderRadius: 16, background: canSubmit ? 'linear-gradient(130deg, #52B788, #A0C4FF)' : 'rgba(255,255,255,0.07)', color: canSubmit ? '#fff' : 'rgba(255,255,255,0.25)', fontSize: 15, fontWeight: 800, fontFamily: 'inherit', cursor: canSubmit ? 'pointer' : 'default', transition: 'all 0.2s' }}>
            {loading ? 'Ajout…' : 'Ajouter au bar'}
          </button>
        </div>
      </div>
      <style>{`@keyframes slideUpModal{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </div>
  );
};
