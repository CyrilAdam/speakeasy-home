import type { CocktailListItem } from '../types.ts';
import { AmbientHeader } from '../components/ui/AmbientHeader.tsx';
import { CocktailCard } from '../components/CocktailCard.tsx';

interface ConsumerCeSoirScreenProps {
  cocktails: CocktailListItem[];
  onSelect: (c: CocktailListItem) => void;
  availability: Record<string, boolean>;
}

export const ConsumerCeSoirScreen = ({ cocktails, onSelect, availability }: ConsumerCeSoirScreenProps) => {
  const available = cocktails.filter(c => availability[c.id] !== false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <AmbientHeader />
      <div style={{ padding: '18px 20px 4px', flexShrink: 0, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 5 }}>Ce soir</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 4 }}>Au programme…</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>
          {available.length} cocktail{available.length !== 1 ? 's' : ''} disponible{available.length !== 1 ? 's' : ''} ce soir
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {available.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🌙</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Le bar prépare sa carte…</div>
          </div>
        ) : available.map(c => <CocktailCard key={c.id} cocktail={c} onSelect={onSelect} available={true} />)}
      </div>
    </div>
  );
};
