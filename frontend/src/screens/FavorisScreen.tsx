import type { CocktailListItem } from '../types.ts';
import { AmbientHeader } from '../components/ui/AmbientHeader.tsx';
import { CocktailCard } from '../components/CocktailCard.tsx';

interface FavorisScreenProps {
  cocktails: CocktailListItem[];
  favorites: Set<string>;
  onSelect: (c: CocktailListItem) => void;
}

export const FavorisScreen = ({ cocktails, favorites, onSelect }: FavorisScreenProps) => {
  const favs = cocktails.filter(c => favorites.has(c.id));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <AmbientHeader />
      <div style={{ padding: '18px 20px 10px', flexShrink: 0, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 5 }}>Sauvegardés</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>Favoris</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 20px' }}>
        {favs.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 70 }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>🤍</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, lineHeight: 1.6 }}>
              Appuyez sur le ❤️ dans<br />une recette pour la sauvegarder
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {favs.map(c => <CocktailCard key={c.id} cocktail={c} onSelect={onSelect} />)}
          </div>
        )}
      </div>
    </div>
  );
};
