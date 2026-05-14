import type { CocktailListItem } from '../types.ts';
import { AmbientHeader } from '../components/ui/AmbientHeader.tsx';
import { CocktailCard } from '../components/CocktailCard.tsx';

interface FaisablesScreenProps {
  cocktails: CocktailListItem[];
  onSelect: (c: CocktailListItem) => void;
}

const SectionTitle = ({ label, count, color }: { label: string; count: number; color: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '16px 0 10px' }}>
    <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{label}</span>
    <span style={{ background: `${color}22`, color, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>{count}</span>
  </div>
);

export const FaisablesScreen = ({ cocktails, onSelect }: FaisablesScreenProps) => {
  const canMake   = cocktails.filter(c => c.canMake);
  const almostMake = cocktails.filter(c => !c.canMake && c.missingCount === 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <AmbientHeader />
      <div style={{ padding: '18px 20px 4px', flexShrink: 0, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 5 }}>Mon inventaire</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>Ce soir je fais…</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
        {canMake.length === 0 && almostMake.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 70 }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>🍾</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, lineHeight: 1.6 }}>
              Cochez vos bouteilles dans<br />"Mon Bar" pour voir ce que<br />vous pouvez préparer
            </div>
          </div>
        )}
        {canMake.length > 0 && (
          <>
            <SectionTitle label="Prêt à mixer" count={canMake.length} color="#74C69D" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {canMake.map(c => <CocktailCard key={c.id} cocktail={c} onSelect={onSelect} />)}
            </div>
          </>
        )}
        {almostMake.length > 0 && (
          <>
            <SectionTitle label="Il manque 1 ingrédient" count={almostMake.length} color="#FFB830" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {almostMake.map(c => (
                <div key={c.id} style={{ position: 'relative' }}>
                  <CocktailCard cocktail={c} onSelect={onSelect} />
                  <div style={{ position: 'absolute', bottom: 10, right: 36, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', borderRadius: 8, padding: '3px 9px', fontSize: 11, color: 'rgba(255,255,255,0.7)', pointerEvents: 'none' }}>
                    1 ingrédient manquant
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
