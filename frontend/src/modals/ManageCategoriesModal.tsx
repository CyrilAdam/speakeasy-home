import { BOTTLE_CATEGORIES } from '../types.ts';

interface ManageCategoriesModalProps {
  bottles: { category: string }[];
  onClose: () => void;
}

const getCatColor = (cat: string) => BOTTLE_CATEGORIES.find(c => c.label === cat)?.color ?? '#9E9E9E';

export const ManageCategoriesModal = ({ bottles, onClose }: ManageCategoriesModalProps) => {
  const categories = [...new Set(bottles.map(b => b.category))].sort();

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 160, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#13131F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px 24px 0 0', maxHeight: '88%', display: 'flex', flexDirection: 'column', animation: 'slideUpModal 0.28s cubic-bezier(0.4,0,0.2,1)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 2px', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.18)' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 12px', flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Catégories</div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 20, padding: '5px 12px', color: 'rgba(255,255,255,0.45)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Fermer</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 30px', display: 'flex', flexDirection: 'column', gap: 7 }}>
          {categories.map(cat => {
            const count = bottles.filter(b => b.category === cat).length;
            const color = getCatColor(cat);
            return (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>{cat}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{count} bouteille{count !== 1 ? 's' : ''}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
