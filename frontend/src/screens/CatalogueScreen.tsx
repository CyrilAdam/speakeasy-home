import { useState } from 'react';
import type { CocktailListItem, Palette } from '../types.ts';
import { AmbientHeader } from '../components/ui/AmbientHeader.tsx';
import { MoodChip } from '../components/ui/MoodChip.tsx';
import { Icon } from '../components/ui/Icon.tsx';
import { CocktailCard } from '../components/CocktailCard.tsx';

interface CatalogueScreenProps {
  cocktails: CocktailListItem[];
  onSelect: (c: CocktailListItem) => void;
  search: string;
  setSearch: (s: string) => void;
  isManager: boolean;
  availability: Record<string, boolean>;
  onToggleAvailable: (id: string) => void;
  onSwitchToConsumer: () => void;
  onRequestManagerMode: () => void;
  onAddCocktail: () => void;
  palette?: Palette;
}

export const CatalogueScreen = ({ cocktails, onSelect, search, setSearch, isManager, availability, onToggleAvailable, onSwitchToConsumer, onRequestManagerMode, onAddCocktail, palette }: CatalogueScreenProps) => {
  const [mood, setMood] = useState('tous');
  const allMoods = ['tous', ...new Set(cocktails.flatMap(c => c.moods))];
  const makeableCount = cocktails.filter(c => c.canMake).length;

  const filtered = cocktails.filter(c => {
    const matchMood = mood === 'tous' || c.moods.includes(mood);
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.tagline.toLowerCase().includes(search.toLowerCase());
    return matchMood && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <AmbientHeader palette={palette} />

      <div style={{ padding: '18px 20px 10px', flexShrink: 0, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
            {isManager ? 'Gérant 🍸' : 'Menu du soir 🍸'}
          </div>
          {isManager ? (
            <button onClick={onSwitchToConsumer} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '4px 10px 4px 8px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, fontFamily: 'inherit', letterSpacing: '0.02em' }}>
              <Icon name="user" size={13} color="rgba(255,255,255,0.5)" />
              Vue client
            </button>
          ) : (
            <button onClick={onRequestManagerMode} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(160,196,255,0.08)', border: '1px solid rgba(160,196,255,0.2)', borderRadius: 20, padding: '4px 10px 4px 8px', cursor: 'pointer', color: '#A0C4FF', fontSize: 11, fontWeight: 600, fontFamily: 'inherit', letterSpacing: '0.02em' }}>
              <Icon name="lock" size={13} color="#A0C4FF" />
              Gérant
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
            {isManager ? 'Que boit-on ?' : 'La carte'}
          </div>
          {isManager && (
            <button onClick={onAddCocktail} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'linear-gradient(130deg,#8B5CF688,#A0C4FF88)', border: '1px solid rgba(160,196,255,0.3)', borderRadius: 20, padding: '6px 13px 6px 9px', cursor: 'pointer', fontFamily: 'inherit', color: '#fff', fontSize: 12, fontWeight: 700 }}>
              <Icon name="plus" size={14} color="#fff" />
              Cocktail
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <div style={{ background: 'rgba(160,196,255,0.1)', border: '1px solid rgba(160,196,255,0.2)', borderRadius: 12, padding: '5px 12px', fontSize: 12, color: '#A0C4FF', fontWeight: 500 }}>
            {cocktails.length} recettes
          </div>
          {isManager && makeableCount > 0 && (
            <div style={{ background: 'rgba(116,198,157,0.12)', border: '1px solid rgba(116,198,157,0.25)', borderRadius: 12, padding: '5px 12px', fontSize: 12, color: '#74C69D', fontWeight: 600 }}>
              ✓ {makeableCount} faisable{makeableCount > 1 ? 's' : ''} ce soir
            </div>
          )}
          {!isManager && (
            <div style={{ background: 'rgba(116,198,157,0.12)', border: '1px solid rgba(116,198,157,0.25)', borderRadius: 12, padding: '5px 12px', fontSize: 12, color: '#74C69D', fontWeight: 600 }}>
              {cocktails.filter(c => availability[c.id] !== false).length} disponibles
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: '9px 13px', marginBottom: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
          <Icon name="search" size={15} color="rgba(255,255,255,0.3)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…" style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 13.5, flex: 1, fontFamily: 'inherit' }} />
        </div>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6, marginRight: -20, paddingRight: 20 }}>
          {allMoods.map(m => (
            <MoodChip key={m} label={m} active={mood === m} onClick={() => setMood(m)} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '2px 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 50, color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>Aucun cocktail trouvé</div>
        )}
        {filtered.map(c => (
          <CocktailCard key={c.id} cocktail={c} onSelect={onSelect} isManager={isManager} available={availability[c.id] !== false} onToggleAvailable={onToggleAvailable} />
        ))}
      </div>
    </div>
  );
};
