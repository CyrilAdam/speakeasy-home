import { useState } from 'react';
import type { Bottle } from '../types.ts';
import { BOTTLE_CATEGORIES } from '../types.ts';
import { AmbientHeader } from '../components/ui/AmbientHeader.tsx';
import { Icon } from '../components/ui/Icon.tsx';
import { AddBottleModal } from '../modals/AddBottleModal.tsx';

interface BarScreenProps {
  bottles: Bottle[];
  toggleBottle: (id: string) => void;
  addBottle: (data: { id: string; name: string; category: string; color: string; owned: boolean; pantry?: boolean }) => Promise<void>;
  isManager: boolean;
  onEditBottle: (b: Bottle) => void;
  onManageCategories: () => void;
}

const catColor = (cat: string) => BOTTLE_CATEGORIES.find(c => c.label === cat)?.color ?? '#9E9E9E';

export const BarScreen = ({ bottles, toggleBottle, addBottle, isManager, onEditBottle, onManageCategories }: BarScreenProps) => {
  const [showAdd, setShowAdd] = useState(false);
  const categories = [...new Set(bottles.map(b => b.category))];
  const ownedCount = bottles.filter(b => b.owned).length;
  const pct = bottles.length > 0 ? Math.round((ownedCount / bottles.length) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {showAdd && <AddBottleModal onAdd={addBottle} onClose={() => setShowAdd(false)} />}
      <AmbientHeader />
      <div style={{ padding: '18px 20px 14px', flexShrink: 0, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Inventaire</div>
          {isManager && (
            <button onClick={onManageCategories} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '4px 10px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>
              Catégories
            </button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>Mon Bar</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', paddingBottom: 2 }}>{ownedCount} / {bottles.length}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4, height: 5 }}>
          <div style={{ width: `${pct}%`, height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #74C69D, #A0C4FF)', transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)' }} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 80px' }}>
        {categories.map(cat => {
          const catBottles = bottles.filter(b => b.category === cat);
          const color = catColor(cat);
          return (
            <div key={cat} style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>{cat}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {catBottles.map(b => (
                  <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 0, background: b.owned ? `${color}18` : 'rgba(255,255,255,0.04)', border: b.owned ? `1px solid ${color}44` : '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', transition: 'all 0.2s' }}>
                    <button onClick={() => !b.pantry && toggleBottle(b.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, padding: '11px 14px', background: 'transparent', border: 'none', cursor: b.pantry ? 'default' : 'pointer', textAlign: 'left' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, background: b.owned ? color : 'rgba(255,255,255,0.12)', boxShadow: b.owned ? `0 0 10px ${color}99` : 'none', transition: 'all 0.2s' }} />
                      <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: b.owned ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)' }}>{b.name}</span>
                      {b.pantry ? (
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>toujours dispo</span>
                      ) : b.owned ? (
                        <Icon name="check" size={14} color={color} />
                      ) : null}
                    </button>
                    {isManager && (
                      <button onClick={e => { e.stopPropagation(); onEditBottle(b); }} style={{ background: 'transparent', border: 'none', borderLeft: '1px solid rgba(255,255,255,0.07)', padding: '11px 12px', cursor: 'pointer', color: 'rgba(255,255,255,0.28)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        ✏️
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={() => setShowAdd(true)} style={{ position: 'absolute', bottom: 18, right: 18, zIndex: 5, width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #A0C4FF, #74C69D)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 24px rgba(160,196,255,0.4)' }}
        onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.92)')}
        onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <Icon name="plus" size={24} color="#0A0A18" />
      </button>
    </div>
  );
};
